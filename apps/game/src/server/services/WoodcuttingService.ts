/**
* WoodcuttingService.ts - Handles woodcutting/chopping trees
* 
* Architecture:
* - Validates player has forestry tool equipped with proper tier
* - Uses DelaySystem ONLY for axe-based initial delay
* - After initial delay, WoodcuttingSystem processes attempts every tick (no delay spam!)
* - Calculates success probability based on player level, axe bonus, and tree probability
* - Implements continuous chopping: rolls every tick after initial delay
* - Tracks tree resource depletion and respawn
* - Awards logs and XP based on tree type
* 
* Workflow:
* 1. Player clicks chop -> validate tool/level -> start initial delay (axe-dependent)
* 2. After initial delay -> WoodcuttingSystem calls processTick() every tick
* 3. On success: Award logs/XP, deplete tree resource, nextAttemptTick = current + axeDelay
* 4. On failure: nextAttemptTick = current + 1 (try again next tick, no delay object created!)
* 5. When tree depleted: Stop chopping, schedule respawn
* 
* Performance:
* - Old approach: Created 1000s of 1-tick delay objects for failed rolls
* - New approach: Single tick check per session, zero delay overhead for failures
*/

import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { SkillClientReference } from "../../world/PlayerState";
import type { PlayerState } from "../../world/PlayerState";
import { SKILLS } from "../../world/PlayerState";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { DelaySystem } from "../systems/DelaySystem";
import { DelayType } from "../systems/DelaySystem";
import type { StateMachine } from "../StateMachine";
import type { EventBus } from "../events/EventBus";
import type { WorldEntityState } from "../state/EntityState";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { EquipmentService } from "./EquipmentService";
import type { VisibilitySystem } from "../systems/VisibilitySystem";
import type { ExperienceService } from "./ExperienceService";
import type { ShakingService } from "./ShakingService";
import { buildStoppedSkillingPayload } from "../../protocol/packets/actions/StoppedSkilling";
import { buildObtainedResourcePayload } from "../../protocol/packets/actions/ObtainedResource";
import { createPlayerStartedSkillingEvent } from "../events/GameEvents";

// =============================================================================
// Constants
// =============================================================================

/** Success probability constants */
const BASE_PROBABILITY = 0.0225;  // Base 2.25% chance
const PROBABILITY_SCALE = 1747;   // Scaling factor for level contribution
const MIN_PROBABILITY = 0.01;     // Floor: 1% minimum
const MAX_PROBABILITY = 0.60;     // Ceiling: 60% maximum
const LUCKY_LOG_ITEM_ID = 182;
const LUCKY_LOG_DROP_CHANCE = 1 / 32;

// =============================================================================
// Axe Configuration
// =============================================================================

export enum AxeTier {
    BRONZE = 'bronze',
    IRON = 'iron',
    STEEL = 'steel',
    PALLADIUM = 'palladium',
    CORONIUM = 'coronium',
    CELADON = 'celadon'
}

export interface AxeConfig {
    tier: AxeTier;
    itemId: number;
    requiredLevel: number;
    initialDelay: number;    // Ticks before first roll
    levelBonus: number;      // Virtual level bonus
}

const AXE_CONFIGS: Record<AxeTier, AxeConfig> = {
    [AxeTier.BRONZE]: {
        tier: AxeTier.BRONZE,
        itemId: 314,
        requiredLevel: 1,
        initialDelay: 17,
        levelBonus: 0
    },
    [AxeTier.IRON]: {
        tier: AxeTier.IRON,
        itemId: 315,
        requiredLevel: 10,
        initialDelay: 15,
        levelBonus: 5
    },
    [AxeTier.STEEL]: {
        tier: AxeTier.STEEL,
        itemId: 316,
        requiredLevel: 20,
        initialDelay: 12,
        levelBonus: 10
    },
    [AxeTier.PALLADIUM]: {
        tier: AxeTier.PALLADIUM,
        itemId: 317,
        requiredLevel: 30,
        initialDelay: 9,
        levelBonus: 20
    },
    [AxeTier.CORONIUM]: {
        tier: AxeTier.CORONIUM,
        itemId: 318,
        requiredLevel: 40,
        initialDelay: 7,
        levelBonus: 30
    },
    [AxeTier.CELADON]: {
        tier: AxeTier.CELADON,
        itemId: 319,
        requiredLevel: 70,
        initialDelay: 5,
        levelBonus: 40
    }
};

/** Map item ID to axe config for quick lookup */
const AXE_CONFIG_BY_ITEM_ID: Map<number, AxeConfig> = new Map(
    Object.values(AXE_CONFIGS).map(config => [config.itemId, config])
);

// =============================================================================
// Tree Configuration (from worldentitydefs)
// =============================================================================

/** Tree configuration mapping type to log item ID */
interface TreeConfig {
    logItemId: number;
    logName: string;
    requiredLevel: number;
}

/** Tree configs - maps tree type to log item and required level */
const TREE_CONFIGS: Record<string, TreeConfig> = {
    normaltree: { logItemId: 64, logName: "logs", requiredLevel: 1 },
    pinetree: { logItemId: 65, logName: "pine logs", requiredLevel: 10 },
    oaktree: { logItemId: 66, logName: "oak logs", requiredLevel: 20 },
    palmtree: { logItemId: 67, logName: "palm logs", requiredLevel: 35 },
    cherryblossom: { logItemId: 68, logName: "cherry logs", requiredLevel: 45 },
    moneytree: { logItemId: 182, logName: "lucky logs", requiredLevel: 60 },
    deadtree: { logItemId: 64, logName: "logs", requiredLevel: 1 },
    wizardstree: { logItemId: 353, logName: "wizard logs", requiredLevel: 70 },
    deadwoodtree: { logItemId: 356, logName: "deadwood logs", requiredLevel: 85 }
};

// =============================================================================
// Service Types
// =============================================================================

export interface WoodcuttingServiceConfig {
    inventoryService: InventoryService;
    messageService: MessageService;
    equipmentService: EquipmentService;
    itemCatalog: ItemCatalog;
    delaySystem: DelaySystem;
    eventBus: EventBus;
    visibilitySystem: VisibilitySystem;
    experienceService: ExperienceService;
    stateMachine: StateMachine;
    playerStatesByUserId: Map<number, PlayerState>;
    worldEntityStates: Map<number, WorldEntityState>;
    enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
    shakingService?: ShakingService | null;
}

/** Active woodcutting session */
interface WoodcuttingSession {
    userId: number;
    treeId: number;
    axeConfig: AxeConfig;
    resourcesRemaining: number;
    successProbability: number;
    nextAttemptTick: number | null; // null = initial delay in progress, number = ready at this tick
}

// =============================================================================
// Service Implementation
// =============================================================================

/**
 * Service for handling woodcutting mechanics.
 */
export class WoodcuttingService {
    /** Active woodcutting sessions (userId -> session) */
    private activeSessions = new Map<number, WoodcuttingSession>();

    /** Tree resources remaining (treeId -> count) */
    private treeResources = new Map<number, number>();

    constructor(private readonly config: WoodcuttingServiceConfig) { }

    /**
     * Creates the woodcutting service.
     */
    static async load(config: WoodcuttingServiceConfig): Promise<WoodcuttingService> {
        const service = new WoodcuttingService(config);
        console.log(`[WoodcuttingService] Service initialized`);
        return service;
    }

    /**
     * Initiates a woodcutting attempt on a tree.
     * Validates tool, checks requirements, and starts the initial delay.
     * 
     * @param playerState - The player attempting to chop
     * @param entityState - The tree entity being chopped
     * @returns true if woodcutting was initiated, false otherwise
     */
    public initiateChop(playerState: PlayerState, entityState: WorldEntityState): boolean {
        // Check if player has a forestry tool equipped and get its config
        const axeConfig = this.getEquippedAxeConfig(playerState);

        if (!axeConfig) {
            this.config.messageService.sendServerInfo(
                playerState.userId,
                "You need to equip an axe to chop trees."
            );
            return false;
        }

        // Get tree configuration
        const treeConfig = TREE_CONFIGS[entityState.type];
        if (!treeConfig) {
            //TODO: Log malformed packet
            this.config.messageService.sendServerInfo(
                playerState.userId,
                "You can't chop that."
            );
            return false;
        }

        // Must have capacity for at least one log before starting woodcutting.
        const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
            playerState.userId,
            treeConfig.logItemId,
            0 // Not IOU
        );
        if (availableCapacity < 1) {
            this.config.messageService.sendServerInfo(playerState.userId, "Your inventory is full.");
            return false;
        }

        // Check forestry level requirement for tree
        // Use effective level (includes potions - equipment bonuses like forestry pendants)
        let playerLevel = playerState.getSkillBoostedLevel(SKILLS.forestry);
        if (playerLevel < treeConfig.requiredLevel) {
            //TODO: Log malformed packet: Client should prevent this.
            this.config.messageService.sendServerInfo(
                playerState.userId,
                `You need level ${treeConfig.requiredLevel} Forestry to chop this tree.`
            );
            return false;
        }

        // Check if tree has resources remaining
        if (!this.hasTreeResources(entityState)) {
            //Todo: Log malformed packet: Client should prevent this.
            this.config.messageService.sendServerInfo(
                playerState.userId,
                "This tree has been depleted."
            );
            return false;
        }

        // Initialize tree resources if not already tracked
        if (!this.treeResources.has(entityState.id)) {
            const { minResourcesPerSpawn, maxResourcesPerSpawn } = entityState.definition;
            const min = minResourcesPerSpawn ?? 1;
            const max = maxResourcesPerSpawn ?? 1;
            const resources = Math.floor(Math.random() * (max - min + 1)) + min;
            this.treeResources.set(entityState.id, resources);
        }

        // Add equipment bonuses to player level
        playerLevel += playerState.getSkillBonus(SKILLS.forestry);

        // Calculate success probability
        const successProbability = this.calculateSuccessProbability(
            playerLevel,
            axeConfig.levelBonus,
            entityState.definition.resourceProbability ?? 0.5
        );

        // Create session
        const session: WoodcuttingSession = {
            userId: playerState.userId,
            treeId: entityState.id,
            axeConfig,
            resourcesRemaining: this.treeResources.get(entityState.id)!,
            successProbability,
            nextAttemptTick: null // Initial delay in progress
        };
        this.activeSessions.set(playerState.userId, session);

        // Send StartedSkilling packet
        this.config.eventBus.emit(
            createPlayerStartedSkillingEvent(
                playerState.userId,
                entityState.id,
                SkillClientReference.Forestry,
                EntityType.Environment,
                {
                    mapLevel: playerState.mapLevel,
                    x: playerState.x,
                    y: playerState.y
                }
            )
        );

        // Start initial delay (axe-dependent)
        // After delay completes, WoodcuttingSystem will take over tick-based processing
        // Use skipStateRestore to stay in WoodcuttingState for continuous chopping
        const delayStarted = this.config.delaySystem.startDelay({
            userId: playerState.userId,
            type: DelayType.NonBlocking,
            ticks: axeConfig.initialDelay,
            state: States.WoodcuttingState,
            skipStateRestore: true, // Stay in WoodcuttingState after delay for continuous chopping
            onComplete: (userId) => this.onInitialDelayComplete(userId)
        });

        if (!delayStarted) {
            this.activeSessions.delete(playerState.userId);
            this.config.messageService.sendServerInfo(playerState.userId, "You're already busy.");
            return false;
        }

        return true;
    }

    /**
     * Called when initial axe-dependent delay completes.
     * Sets up the session for tick-based processing.
     */
    private onInitialDelayComplete(userId: number): void {
        const session = this.activeSessions.get(userId);
        if (!session) return;

        // Mark session as ready for immediate attempt (WoodcuttingSystem will process next tick)
        session.nextAttemptTick = 0; // 0 = attempt immediately
    }

    /**
     * Called every tick by WoodcuttingSystem.
     * Processes all active sessions that are ready to attempt a chop.
     */
    public processTick(currentTick: number): void {
        for (const [userId, session] of this.activeSessions.entries()) {
            const player = this.config.playerStatesByUserId.get(userId);
            if (!player) {
                // Player disconnected
                this.activeSessions.delete(userId);
                continue;
            }

            // CRITICAL: Only process if player is still in WoodcuttingState
            // If they moved, entered combat, or did anything else, their state changed
            if (player.currentState !== States.WoodcuttingState) {
                // Player left woodcutting state - cancel session silently
                // (StateMachine already handled cleanup and messages)
                this.activeSessions.delete(userId);
                continue;
            }

            // Skip if initial delay still in progress
            if (session.nextAttemptTick === null) {
                continue;
            }

            // Skip if not ready yet
            if (currentTick < session.nextAttemptTick) {
                continue;
            }

            // Ready to attempt chop
            this.attemptChop(userId, currentTick);
        }
    }

    /**
     * Attempts to chop the tree.
     * Called by processTick when session is ready.
     */
    private attemptChop(userId: number, currentTick: number): void {
        const player = this.config.playerStatesByUserId.get(userId);
        const session = this.activeSessions.get(userId);

        if (!player || !session) {
            return;
        }


        const tree = this.config.worldEntityStates.get(session.treeId);
        if (!tree) {
            //TODO: Log potential weird server issue
            this.endSession(userId, "The tree is no longer there.", false);
            return;
        }

        // Check if tree still has resources
        if (!this.hasTreeResources(tree)) {
            this.endSession(userId, undefined, true);
            return;
        }

        // Roll for success
        const roll = Math.random();
        const success = roll < session.successProbability;

        if (success) {
            this.handleChopSuccess(player, tree, session, currentTick);
        } else {
            // Failure - try again next tick (no delay overhead!)
            session.nextAttemptTick = currentTick + 1;
        }
    }

    /**
     * Handles successful woodcutting - awards XP and logs.
     */
    private handleChopSuccess(player: PlayerState, tree: WorldEntityState, session: WoodcuttingSession, currentTick: number): void {
        const treeConfig = TREE_CONFIGS[tree.type];
        if (!treeConfig) {
            this.endSession(player.userId, "Invalid tree type.", false);
            return;
        }

        // Deplete tree resource
        const remaining = this.treeResources.get(tree.id) ?? 0;
        this.treeResources.set(tree.id, remaining - 1);
        session.resourcesRemaining = remaining - 1;

        // Award logs (inventory has space, so this will succeed)
        this.config.inventoryService.giveItem(
            player.userId,
            treeConfig.logItemId,
            1,
            0 // Not IOU
        );
        this.rollLuckyLogDrop(player);

        // Award XP from the obtained log definition (itemdefs expFromObtaining).
        const forestryXp = this.getForestryXpForItem(treeConfig.logItemId);
        if (forestryXp > 0) {
            this.config.experienceService.addSkillXp(player, SKILLS.forestry, forestryXp);
        }

        // Send ObtainedResource packet (client calculates XP and shows "You get some <item>")
        const obtainedPayload = buildObtainedResourcePayload({
            ItemID: treeConfig.logItemId
        });
        this.config.enqueueUserMessage(player.userId, GameAction.ObtainedResource, obtainedPayload);

        const treeDepleted = session.resourcesRemaining <= 0;
        if (treeDepleted) {
            this.scheduleTreeRespawn(tree);
        }

        // Check if inventory has space after giving item
        const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
            player.userId,
            treeConfig.logItemId,
            0 // Not IOU
        );

        if (availableCapacity < 1) {
            // Inventory is full - stop session
            this.config.messageService.sendServerInfo(player.userId, "Your inventory is full.");
            this.endSession(player.userId, undefined, treeDepleted);
            return;
        }

        if (treeDepleted) {
            this.endSession(player.userId, undefined, true); // Tree depleted
        } else {
            // Continue chopping - next attempt after axe cooldown
            session.nextAttemptTick = currentTick + session.axeConfig.initialDelay;
        }
    }

    /**
     * Rolls an extra lucky log drop that does not consume tree resources.
     */
    private rollLuckyLogDrop(player: PlayerState): void {
        if (Math.random() >= LUCKY_LOG_DROP_CHANCE) {
            return;
        }

        const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
            player.userId,
            LUCKY_LOG_ITEM_ID,
            0 // Not IOU
        );
        if (availableCapacity < 1) {
            return;
        }

        this.config.inventoryService.giveItem(player.userId, LUCKY_LOG_ITEM_ID, 1, 0);

        const luckyLogXp = this.getForestryXpForItem(LUCKY_LOG_ITEM_ID);
        if (luckyLogXp > 0) {
            this.config.experienceService.addSkillXp(player, SKILLS.forestry, luckyLogXp);
        }

        const obtainedPayload = buildObtainedResourcePayload({
            ItemID: LUCKY_LOG_ITEM_ID
        });
        this.config.enqueueUserMessage(player.userId, GameAction.ObtainedResource, obtainedPayload);
    }


    /**
     * Ends a woodcutting session.
     * @param userId - The player's user ID
     * @param message - Optional message to send (e.g., "Tree depleted")
     * @param didExhaustResources - Whether the tree/inventory was depleted
     */
    private endSession(userId: number, message?: string, didExhaustResources: boolean = false): void {
        const player = this.config.playerStatesByUserId.get(userId);
        if (!player) return;

        this.activeSessions.delete(userId);

        if (message) {
            this.config.messageService.sendServerInfo(userId, message);
        }

        // Send StoppedSkilling packet
        const stoppedPayload = buildStoppedSkillingPayload({
            PlayerEntityID: userId,
            Skill: SkillClientReference.Forestry,
            DidExhaustResources: didExhaustResources
        });
        this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);

        // Transition to idle state via StateMachine (will trigger exitState cleanup)
        this.config.stateMachine.setState(
            { type: EntityType.Player, id: userId },
            States.IdleState
        );
    }

    /**
     * Schedules tree respawn after depletion.
     */
    private scheduleTreeRespawn(tree: WorldEntityState): void {
        const respawnTicks = tree.definition.respawnTicks ?? 30;

        // Get nearby players who can see the tree (position-based query for static entities)
        const nearbyPlayers = this.config.visibilitySystem.getPlayersNearEntity(tree);

        // Mark tree as exhausted and notify nearby players
        const exhaustionTracker = this.config.visibilitySystem.getResourceExhaustionTracker();
        exhaustionTracker.markExhausted(tree.id, nearbyPlayers);
        this.config.shakingService?.onTreeExhausted(tree.id);

        // Schedule replenishment
        setTimeout(() => {
            const { minResourcesPerSpawn, maxResourcesPerSpawn } = tree.definition;
            const min = minResourcesPerSpawn ?? 1;
            const max = maxResourcesPerSpawn ?? 1;
            const resources = Math.floor(Math.random() * (max - min + 1)) + min;
            this.treeResources.set(tree.id, resources);

            // Mark tree as replenished and notify all witnesses
            exhaustionTracker.markReplenished(tree.id);
            this.config.shakingService?.onTreeReplenished(tree.id);
        }, respawnTicks * 600); // 600ms per tick
    }

    /**
     * Checks if tree has resources remaining.
     */
    private hasTreeResources(tree: WorldEntityState): boolean {
        const remaining = this.treeResources.get(tree.id);
        if (remaining === undefined) {
            return true; // Not yet initialized, assume has resources
        }
        return remaining > 0;
    }

    /**
     * Gets the axe config for the player's equipped weapon.
     */
    private getEquippedAxeConfig(playerState: PlayerState): AxeConfig | null {
        const weaponItemId = this.config.equipmentService.getEquippedItemId(playerState.userId, "weapon");

        if (!weaponItemId) {
            return null;
        }

        const axeConfig = AXE_CONFIG_BY_ITEM_ID.get(weaponItemId);
        if (!axeConfig) {
            // Check if it has forestry requirement (might be a custom axe)
            const weaponDef = this.config.itemCatalog.getDefinitionById(weaponItemId);
            if (weaponDef?.equippableRequirements?.some((req: any) => req.skill === "forestry")) {
                // Default to bronze stats for unknown forestry tools
                return AXE_CONFIGS[AxeTier.BRONZE];
            }
            return null;
        }

        return axeConfig;
    }

    /**
     * Calculates success probability based on level, axe, and tree.
     * 
     * Formula: BASE + (treeProbability × effectiveLevel) / SCALE
     * Clamped between MIN_PROBABILITY and MAX_PROBABILITY
     */
    private calculateSuccessProbability(
        playerLevel: number,
        axeLevelBonus: number,
        treeProbability: number
    ): number {
        const effectiveLevel = playerLevel + axeLevelBonus;
        const rawProbability = BASE_PROBABILITY + (treeProbability * effectiveLevel) / PROBABILITY_SCALE;

        // Clamp between min and max
        return Math.max(MIN_PROBABILITY, Math.min(MAX_PROBABILITY, rawProbability));
    }

    /**
     * Gets forestry XP granted when obtaining the given item.
     */
    private getForestryXpForItem(itemId: number): number {
        const itemDef = this.config.itemCatalog.getDefinitionById(itemId);
        const expFromObtaining = itemDef?.expFromObtaining;
        if (expFromObtaining?.skill !== "forestry") {
            return 0;
        }

        return expFromObtaining.amount > 0 ? expFromObtaining.amount : 0;
    }

    /**
     * Cancels an active woodcutting session (e.g., when player moves).
     * @param sendPackets - Whether to send StoppedSkilling packet (false when StateMachine handles it)
     */
    public cancelSession(userId: number, sendPackets: boolean = true): void {
        if (!this.activeSessions.has(userId)) {
            return;
        }

        this.activeSessions.delete(userId);

        if (sendPackets) {
            // Send StoppedSkilling packet
            const stoppedPayload = buildStoppedSkillingPayload({
                PlayerEntityID: userId,
                Skill: SkillClientReference.Forestry,
                DidExhaustResources: false
            });
            this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);
        }

        // Cancel any active delay for this player
        this.config.delaySystem.clearDelay(userId);

    }
}
