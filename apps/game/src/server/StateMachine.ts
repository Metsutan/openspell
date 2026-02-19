import { States } from "../protocol/enums/States";
import { EntityType } from "../protocol/enums/EntityType";
import type { PlayerState } from "../world/PlayerState";
import { EventBus } from "./events/EventBus";
import { createEntityStateChangedEvent } from "./events/GameEvents";
import type { WoodcuttingService } from "./services/WoodcuttingService";
import type { FishingService } from "./services/FishingService";
import type { HarvestingService } from "./services/HarvestingService";
import type { MiningService } from "./services/MiningService";
import type { CookingService } from "./services/CookingService";
import type { ItemInteractionService } from "./services/ItemInteractionService";
import { GameAction } from "../protocol/enums/GameAction";
import { SkillClientReference } from "../world/PlayerState";
import { buildStoppedBankingPayload } from "../protocol/packets/actions/StoppedBanking";
import { buildStoppedShoppingPayload } from "../protocol/packets/actions/StoppedShopping";
import { buildStoppedSkillingPayload } from "../protocol/packets/actions/StoppedSkilling";

/**
 * Entity reference for state machine operations.
 */
export type EntityRef = { type: EntityType; id: number };

/**
 * Context interface for state machine operations.
 * Provides access to GameServer methods needed for state transitions.
 */
export interface StateMachineContext {
    /**
     * Event bus for emitting state change events.
     */
    eventBus: EventBus;

    /**
     * Cancels a movement plan for an entity.
     */
    cancelMovementPlan(entityRef: EntityRef): void;

    /**
     * Drops NPC aggro (clears target and returns to idle).
     */
    dropNpcAggro(npcId: number): void;

    /**
     * Gets a player state by userId.
     */
    getPlayerState(userId: number): PlayerState | undefined;

    /**
     * Gets an NPC state by npcId.
     */
    getNpcState(npcId: number): { currentState: States; aggroTarget: unknown | null } | undefined;

    /**
     * Makes an entity key string from an entity reference.
     */
    makeEntityKey(entityRef: EntityRef): string;

    /**
     * Checks if a movement plan exists for an entity.
     */
    hasMovementPlan(entityKey: string): boolean;

    /**
     * Ends a conversation for a player.
     * @param userId - The player whose conversation is ending
     * @param handleStateTransitions - Whether to handle state transitions
     */
    endConversation(userId: number, handleStateTransitions: boolean): void;

    /**
     * Clears a player's target (visual indicator).
     * @param userId - The player whose target should be cleared
     */
    clearPlayerTarget(userId: number): void;

    /**
     * Sends a server info message to a player.
     * @param userId - The player to send the message to
     * @param message - The message text
     */
    sendServerInfo(userId: number, message: string): void;

    /**
     * Handles cleanup when a player exits TradingState.
     * @param userId - The player leaving trading state
     */
    onPlayerExitedTradingState(userId: number): void;

    /**
     * Gets the woodcutting service (may be null if not loaded).
     */
    getWoodcuttingService(): WoodcuttingService | null;

    /**
     * Gets the fishing service (may be null if not loaded).
     */
    getFishingService(): FishingService | null;

    /**
     * Gets the harvesting service (may be null if not loaded).
     */
    getHarvestingService(): HarvestingService | null;

    /**
     * Gets the mining service (may be null if not loaded).
     */
    getMiningService(): MiningService | null;

    /**
     * Gets the cooking service (may be null if not loaded).
     */
    getCookingService(): CookingService | null;

    /**
     * Gets the item interaction service (may be null if not loaded).
     */
    getItemInteractionService(): ItemInteractionService | null;

    /**
     * Enqueues a message to a specific user.
     * @param userId - The user to send the message to
     * @param action - The game action
     * @param payload - The packet payload
     */
    enqueueUserMessage(userId: number, action: number, payload: unknown[]): void;
}

/**
 * State Machine for managing entity state transitions.
 * Handles enter/exit logic for state changes to keep cleanup centralized.
 * Emits EntityStateChangedEvent when states change for other systems to react.
 */
export class StateMachine {
    constructor(private readonly context: StateMachineContext) {}

    /**
     * Sets the state for an entity, handling exit and enter logic.
     * @param entityRef The entity whose state is changing
     * @param newState The new state to transition to
     * @returns true if the state was changed, false if already in that state
     */
    setState(entityRef: EntityRef, newState: States): boolean {
        const currentState = this.getCurrentState(entityRef);
        if (currentState === newState) {
            return false;
        }

        // Exit current state
        this.exitState(entityRef, currentState);

        // Update state
        this.updateEntityState(entityRef, newState);

        // Emit state change event (other systems can react to this)
        this.context.eventBus.emit(createEntityStateChangedEvent(entityRef, currentState, newState));

        // Enter new state
        this.enterState(entityRef, newState);

        return true;
    }

    /**
     * Gets the current state of an entity.
     */
    public getCurrentState(entityRef: EntityRef): States {
        if (entityRef.type === EntityType.Player) {
            const playerState = this.context.getPlayerState(entityRef.id);
            return playerState?.currentState ?? States.IdleState;
        } else if (entityRef.type === EntityType.NPC) {
            const npcState = this.context.getNpcState(entityRef.id);
            return npcState?.currentState ?? States.IdleState;
        }
        return States.IdleState;
    }

    /**
     * Updates the entity's state property.
     */
    private updateEntityState(entityRef: EntityRef, newState: States): void {
    if (entityRef.type === EntityType.Player) {
            const playerState = this.context.getPlayerState(entityRef.id);
            if (playerState) {
                playerState.setState(newState);
            }
        } else if (entityRef.type === EntityType.NPC) {
            const npcState = this.context.getNpcState(entityRef.id);
            if (npcState) {
                npcState.currentState = newState;
            }
        }
    }

    /**
     * Handles cleanup when exiting a state.
     */
    private exitState(entityRef: EntityRef, state: States): void {
        switch (state) {
            case States.MovingState:
            case States.MovingTowardTargetState:
                // Cancel any active movement plan by deleting it directly
                const entityKey = this.context.makeEntityKey(entityRef);
                if (this.context.hasMovementPlan(entityKey)) {
                    this.context.cancelMovementPlan(entityRef);
                }
                break;

            case States.MeleeCombatState:
            case States.MagicCombatState:
            case States.RangeCombatState:
                break;

            case States.BankingState:
                // Close bank interface for players leaving BankingState
                if (entityRef.type === EntityType.Player) {
                    const stoppedPayload = buildStoppedBankingPayload({
                        EntityID: entityRef.id
                    });
                    this.context.enqueueUserMessage(entityRef.id, GameAction.StoppedBanking, stoppedPayload);
                }
                break;

            case States.TradingState:
                if (entityRef.type === EntityType.Player) {
                    this.context.onPlayerExitedTradingState(entityRef.id);
                }
                break;

            case States.ShoppingState:
                // Close shop interface and clear current shop ID when player exits shopping
                if (entityRef.type === EntityType.Player) {
                    const playerState = this.context.getPlayerState(entityRef.id);
                    if (playerState) {
                        const stoppedPayload = buildStoppedShoppingPayload({
                            ShopID: playerState.currentShopId,
                            EntityID: entityRef.id
                        });
                        this.context.enqueueUserMessage(entityRef.id, GameAction.StoppedShopping, stoppedPayload);
                        playerState.currentShopId = null;
                    }
                }
                break;

            case States.WoodcuttingState:
                // Cancel active woodcutting session and send StoppedSkilling packet
                if (entityRef.type === EntityType.Player) {
                    const woodcuttingService = this.context.getWoodcuttingService();
                    if (woodcuttingService) {
                        // Cancel session without sending packets (we handle packets here)
                        woodcuttingService.cancelSession(entityRef.id, false);
                    }
                    
                    // Send StoppedSkilling packet to client
                    const stoppedPayload = buildStoppedSkillingPayload({
                        PlayerEntityID: entityRef.id,
                        Skill: SkillClientReference.Forestry,
                        DidExhaustResources: false
                    });
                    this.context.enqueueUserMessage(entityRef.id, GameAction.StoppedSkilling, stoppedPayload);
                    
                    // Send "You have stopped chopping" message
                    this.context.sendServerInfo(entityRef.id, "You have stopped chopping.");
                }
                break;

        case States.FishingState:
            // Cancel active fishing session and send StoppedSkilling packet
            if (entityRef.type === EntityType.Player) {
                const fishingService = this.context.getFishingService();
                if (fishingService) {
                    fishingService.cancelSession(entityRef.id, false);
                }

                const stoppedPayload = buildStoppedSkillingPayload({
                    PlayerEntityID: entityRef.id,
                    Skill: SkillClientReference.Fishing,
                    DidExhaustResources: false
                });
                this.context.enqueueUserMessage(entityRef.id, GameAction.StoppedSkilling, stoppedPayload);
                this.context.sendServerInfo(entityRef.id, "You have stopped fishing.");
            }
            break;
            case States.CookingState:
                if (entityRef.type === EntityType.Player) {
                    const cookingService = this.context.getCookingService();
                    if (cookingService) {
                        cookingService.cancelSession(entityRef.id, false);
                    }

                    const stoppedPayload = buildStoppedSkillingPayload({
                        PlayerEntityID: entityRef.id,
                        Skill: SkillClientReference.Cooking,
                        DidExhaustResources: false
                    });
                    this.context.enqueueUserMessage(entityRef.id, GameAction.StoppedSkilling, stoppedPayload);
                    this.context.sendServerInfo(entityRef.id, "You have stopped cooking.");
                }
                break;
            case States.HarvestingState:
                if (entityRef.type === EntityType.Player) {
                    const harvestingService = this.context.getHarvestingService();
                    if (harvestingService) {
                        harvestingService.cancelSession(entityRef.id, false);
                    }

                    const stoppedPayload = buildStoppedSkillingPayload({
                        PlayerEntityID: entityRef.id,
                        Skill: SkillClientReference.Harvesting,
                        DidExhaustResources: false
                    });
                    this.context.enqueueUserMessage(entityRef.id, GameAction.StoppedSkilling, stoppedPayload);
                    //handled by the client
                    //this.context.sendServerInfo(entityRef.id, "You have stopped harvesting.");
                }
                break;
            case States.MiningState:
                if (entityRef.type === EntityType.Player) {
                    const miningService = this.context.getMiningService();
                    if (miningService) {
                        miningService.cancelSession(entityRef.id, false);
                    }

                    const stoppedPayload = buildStoppedSkillingPayload({
                        PlayerEntityID: entityRef.id,
                        Skill: SkillClientReference.Mining,
                        DidExhaustResources: false
                    });
                    this.context.enqueueUserMessage(entityRef.id, GameAction.StoppedSkilling, stoppedPayload);
                    this.context.sendServerInfo(entityRef.id, "You have stopped mining.");
                }
                break;
            case States.TreeShakingState:
                // Stop skill activity (placeholder for future implementation)
                // stopSkillActivity(entityRef);
                break;
            case States.SmeltingState:
            case States.SmeltingKilnState:
            case States.SmithingState:
            case States.CraftingState:
            case States.PotionMakingState:
            case States.CraftingAtTableState:
                if (entityRef.type === EntityType.Player) {
                    if (state === States.CraftingAtTableState) {
                        const stoppedPayload = buildStoppedSkillingPayload({
                            PlayerEntityID: entityRef.id,
                            Skill: SkillClientReference.Crafting,
                            DidExhaustResources: false
                        });
                        this.context.enqueueUserMessage(entityRef.id, GameAction.StoppedSkilling, stoppedPayload);
                    }
                    const itemInteractionService = this.context.getItemInteractionService();
                    itemInteractionService?.cancelItemOnItemSession(entityRef.id, false);
                    const message = this.getSkillingStopMessage(state);
                    if (message) {
                        this.context.sendServerInfo(entityRef.id, message);
                    }
                }
                break;
            case States.EnchantingState:
            case States.UsingSpinningWheelState:
                // Stop skill activity (placeholder for future implementation)
                // stopSkillActivity(entityRef);
                break;

            case States.ConversationState:
                // Player exiting conversation - end it via ConversationService
                // Pass false to handleStateTransitions since FSM is managing state transitions
                if (entityRef.type === EntityType.Player) {
                    this.context.endConversation(entityRef.id, false);
                    
                    // Clear player's target when leaving conversation
                    // (e.g., if they clicked to move away from NPC)
                    this.context.clearPlayerTarget(entityRef.id);
                }
                break;

            case States.NPCConversationState:
                // NPC state is managed by ConversationService.endConversation()
                // when player conversation ends - no action needed here
                break;

            case States.ChangingAppearanceState:
                // Close appearance changer (placeholder for future implementation)
                // closeAppearanceChanger(entityRef);
                break;

            case States.PickpocketingState:
                // Stop pickpocketing (placeholder for future implementation)
                // stopPickpocketing(entityRef);
                break;

            case States.PicklockingState:
                // Stop picklocking (placeholder for future implementation)
                // stopPicklocking(entityRef);
                break;

            case States.UsingItemOnEntityState:
                // Clear item-on-entity action (placeholder for future implementation)
                // clearItemOnEntityAction(entityRef);
                break;

            // IdleState, RespawningState, PlayerDeadState, NPCDeadState, etc.
            // don't need cleanup when exiting
            default:
                break;
        }
    }

    /**
     * Handles initialization when entering a state.
     */
    private enterState(entityRef: EntityRef, state: States): void {
        switch (state) {
            case States.MovingState:
            case States.MovingTowardTargetState:
                // Movement plans are created before state transition,
                // so we just ensure the state is set correctly
                // startPathfinding is handled by scheduleMovementPlan
                break;

            case States.MeleeCombatState:
            case States.MagicCombatState:
            case States.RangeCombatState:
                // Combat loop is started by the combat system
                // startCombatLoop(entityRef);
                break;

            case States.BankingState:
                // Open bank interface (placeholder for future implementation)
                // openBank(entityRef);
                break;

            case States.TradingState:
                // Open trade interface (placeholder for future implementation)
                // openTrade(entityRef);
                break;

            case States.ShoppingState:
                // Open shop interface (placeholder for future implementation)
                // openShop(entityRef);
                break;

            case States.WoodcuttingState:
                // Send "You start chopping away" message
                if (entityRef.type === EntityType.Player) {
                    // this.context.sendServerInfo(entityRef.id, "You start chopping away.");
                }
                break;

            case States.FishingState:
            case States.CookingState:
            case States.MiningState:
            case States.HarvestingState:
            case States.TreeShakingState:
            case States.EnchantingState:
            case States.UsingSpinningWheelState:
                // Start skill activity (placeholder for future implementation)
                // startSkillActivity(entityRef, state);
                break;
            case States.SmeltingState:
            case States.SmeltingKilnState:
            case States.SmithingState:
            case States.CraftingState:
            case States.CraftingAtTableState:
            case States.PotionMakingState:
                if (entityRef.type === EntityType.Player) {
                    const message = this.getSkillingStartMessage(state);
                    if (message) {
                        this.context.sendServerInfo(entityRef.id, message);
                    }
                }
                break;

            case States.ConversationState:
            case States.NPCConversationState:
                // Start conversation (placeholder for future implementation)
                // startConversation(entityRef);
                break;

            case States.ChangingAppearanceState:
                // Open appearance changer (placeholder for future implementation)
                // openAppearanceChanger(entityRef);
                break;

            case States.PickpocketingState:
                // Start pickpocketing (placeholder for future implementation)
                // startPickpocketing(entityRef);
                break;

            case States.PicklockingState:
                // Start picklocking (placeholder for future implementation)
                // startPicklocking(entityRef);
                break;

            case States.TeleportingState: {
                // Defensive cleanup: teleport windups should never continue an existing path.
                const entityKey = this.context.makeEntityKey(entityRef);
                if (this.context.hasMovementPlan(entityKey)) {
                    this.context.cancelMovementPlan(entityRef);
                }
                break;
            }

            case States.UsingItemOnEntityState:
                // Start item-on-entity action (placeholder for future implementation)
                // startItemOnEntityAction(entityRef);
                break;
            case States.IdleState:
                if (entityRef.type === EntityType.Player) {
                    // Ensure combat targets are cleared when returning to idle (e.g., on equip/unequip).
                    this.context.clearPlayerTarget(entityRef.id);
                }
                break;
            // IdleState, RespawningState, PlayerDeadState, NPCDeadState, etc.
            // don't need initialization when entering
            // State change events are emitted before enterState, so VisibilitySystem
            // can handle EnteredIdleState packets via EntityStateChangedEvent
            default:
                break;
        }
    }

    private getSkillingStopMessage(state: States): string | null {
        switch (state) {
            case States.SmeltingState:
            case States.SmeltingKilnState:
                return "You have stopped smelting.";
            case States.SmithingState:
                return "You have stopped smithing.";
            case States.CraftingState:
            case States.CraftingAtTableState:
                return "You have stopped crafting.";
            case States.PotionMakingState:
                return "You have stopped brewing.";
            default:
                return null;
        }
    }

    private getSkillingStartMessage(state: States): string | null {
        switch (state) {
            case States.SmeltingState:
            case States.SmeltingKilnState:
                return "You start smelting.";
            case States.SmithingState:
                return "You start smithing.";
            case States.CraftingState:
            case States.CraftingAtTableState:
                return "You start crafting.";
            case States.PotionMakingState:
                return "You start brewing.";
            default:
                return null;
        }
    }
}
