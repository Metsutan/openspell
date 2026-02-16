import { GameAction } from "../../protocol/enums/GameAction";
import { buildCreatedItemPayload } from "../../protocol/packets/actions/CreatedItem";
import { SKILLS, isSkillSlug, type PlayerState } from "../../world/PlayerState";
import type { WorldEntityState } from "../state/EntityState";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { ExperienceService } from "./ExperienceService";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import { InventoryManager } from "../../world/systems/InventoryManager";

type EnchantingObeliskConfig = {
  inputItemId: number;
  outputItemId: number;
  requiredLevel: number;
};

type BonusMultiplierUnlock = {
  level: number;
  multiplier: number;
};

export interface EnchantingServiceDependencies {
  inventoryService: InventoryService;
  messageService: MessageService;
  experienceService: ExperienceService;
  itemCatalog: ItemCatalog;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
}

// World-entity-specific enchanting outputs (hardcoded by design).
const ENCHANTING_OBELISK_BY_TYPE: Record<string, EnchantingObeliskConfig> = {
  waterobelisk: { inputItemId: 149, outputItemId: 176, requiredLevel: 1 },
  natureobelisk: { inputItemId: 149, outputItemId: 177, requiredLevel: 8 },
  fireobelisk: { inputItemId: 149, outputItemId: 175, requiredLevel: 16 },
  furyobelisk: { inputItemId: 150, outputItemId: 178, requiredLevel: 25 },
  energyobelisk: { inputItemId: 152, outputItemId: 180, requiredLevel: 32 },
  rageobelisk: { inputItemId: 151, outputItemId: 179, requiredLevel: 45 },
  goldenobelisk: { inputItemId: 183, outputItemId: 184, requiredLevel: 56 },
  portalobelisk: { inputItemId: 153, outputItemId: 181, requiredLevel: 70 },
  wizardsobelisk: { inputItemId: 354, outputItemId: 355, requiredLevel: 82 },
  bloodobelisk: { inputItemId: 357, outputItemId: 358, requiredLevel: 90 }
};

const BONUS_MULTIPLIERS_BY_OUTPUT_ITEM_ID: Partial<Record<number, BonusMultiplierUnlock[]>> = {
  176: [
    { level: 10, multiplier: 2 },
    { level: 20, multiplier: 3 },
    { level: 30, multiplier: 4 },
    { level: 40, multiplier: 5 },
    { level: 50, multiplier: 6 },
    { level: 60, multiplier: 7 },
    { level: 70, multiplier: 8 },
    { level: 80, multiplier: 9 },
    { level: 90, multiplier: 10 },
    { level: 100, multiplier: 11 }
  ],
  177: [
    { level: 20, multiplier: 2 },
    { level: 32, multiplier: 3 },
    { level: 44, multiplier: 4 },
    { level: 56, multiplier: 5 },
    { level: 68, multiplier: 6 },
    { level: 80, multiplier: 7 },
    { level: 92, multiplier: 8 },
    { level: 104, multiplier: 9 }
  ],
  175: [
    { level: 30, multiplier: 2 },
    { level: 44, multiplier: 3 },
    { level: 58, multiplier: 4 },
    { level: 72, multiplier: 5 },
    { level: 86, multiplier: 6 },
    { level: 100, multiplier: 7 }
  ],
  178: [
    { level: 40, multiplier: 2 },
    { level: 56, multiplier: 3 },
    { level: 72, multiplier: 4 },
    { level: 88, multiplier: 5 },
    { level: 104, multiplier: 6 }
  ],
  180: [
    { level: 50, multiplier: 2 },
    { level: 68, multiplier: 3 },
    { level: 86, multiplier: 4 },
    { level: 104, multiplier: 5 }
  ],
  179: [
    { level: 60, multiplier: 2 },
    { level: 80, multiplier: 3 },
    { level: 100, multiplier: 4 }
  ],
  184: [
    { level: 70, multiplier: 2 },
    { level: 92, multiplier: 3 }
  ],
  181: [
    { level: 80, multiplier: 2 },
    { level: 104, multiplier: 3 }
  ],
  355: [{ level: 90, multiplier: 2 }],
  358: [{ level: 100, multiplier: 2 }]
};

export class EnchantingService {
  constructor(private readonly deps: EnchantingServiceDependencies) {}

  startEnchanting(playerState: PlayerState, itemId: number, entityState: WorldEntityState): void {
    const config = ENCHANTING_OBELISK_BY_TYPE[entityState.type];
    if (!config || config.inputItemId !== itemId) {
      this.deps.messageService.sendServerInfo(playerState.userId, "Nothing interesting happens.");
      return;
    }

    const enchantingLevel = playerState.getEffectiveLevel(SKILLS.enchanting);
    if (enchantingLevel < config.requiredLevel) {
      this.deps.messageService.sendServerInfo(
        playerState.userId,
        `You need level ${config.requiredLevel} enchanting to use this obelisk.`
      );
      return;
    }

    const outputDefinition = this.deps.itemCatalog.getDefinitionById(config.outputItemId);
    if (!outputDefinition) {
      this.deps.messageService.sendServerInfo(playerState.userId, "That enchantment is not available.");
      return;
    }

    const recipeInputAmount = getPrimaryRecipeInputAmount(outputDefinition);
    if (recipeInputAmount <= 0) {
      this.deps.messageService.sendServerInfo(playerState.userId, "That enchantment is not available.");
      return;
    }

    const availableInput = playerState.countItem(config.inputItemId, 0);
    if (availableInput < recipeInputAmount) {
      this.deps.messageService.sendServerInfo(playerState.userId, "You have no scrolls to enchant.");
      return;
    }

    const craftCount = Math.floor(availableInput / recipeInputAmount);
    if (craftCount <= 0) {
      this.deps.messageService.sendServerInfo(playerState.userId, "You have no scrolls to enchant.");
      return;
    }

    const outputMultiplier = getBonusMultiplier(config.outputItemId, enchantingLevel);
    const totalInputToConsume = craftCount * recipeInputAmount;
    const totalOutputToCreate = craftCount * outputMultiplier;

    if (!canFitOutputAfterConsumption(this.deps.itemCatalog, playerState, config.inputItemId, config.outputItemId, totalInputToConsume, totalOutputToCreate)) {
      this.deps.messageService.sendServerInfo(playerState.userId, "Your inventory is full.");
      return;
    }

    const removed = this.deps.inventoryService.removeItem(playerState.userId, config.inputItemId, totalInputToConsume, 0);
    if (removed.removed < totalInputToConsume) {
      this.deps.messageService.sendServerInfo(playerState.userId, "You have no scrolls to enchant.");
      return;
    }

    const given = this.deps.inventoryService.giveItem(playerState.userId, config.outputItemId, totalOutputToCreate, 0);
    if (given.added < totalOutputToCreate) {
      // Best-effort rollback in the rare case inventory changed mid-action.
      if (given.added > 0) {
        this.deps.inventoryService.removeItem(playerState.userId, config.outputItemId, given.added, 0);
      }
      this.deps.inventoryService.giveItem(playerState.userId, config.inputItemId, totalInputToConsume, 0);
      this.deps.messageService.sendServerInfo(playerState.userId, "Your inventory is full.");
      return;
    }

    const expFromObtaining = outputDefinition.expFromObtaining;
    if (
      expFromObtaining &&
      isSkillSlug(expFromObtaining.skill) &&
      expFromObtaining.skill === SKILLS.enchanting &&
      expFromObtaining.amount > 0
    ) {
      this.deps.experienceService.addSkillXp(playerState, SKILLS.enchanting, expFromObtaining.amount * totalOutputToCreate);
    }

    const createdPayload = buildCreatedItemPayload({
      ItemID: config.outputItemId,
      Amount: totalOutputToCreate,
      RecipeInstancesToRemove: craftCount
    });
    this.deps.enqueueUserMessage(playerState.userId, GameAction.CreatedItem, createdPayload);
  }
}

function canFitOutputAfterConsumption(
  itemCatalog: ItemCatalog,
  playerState: PlayerState,
  inputItemId: number,
  outputItemId: number,
  totalInputToConsume: number,
  totalOutputToCreate: number
): boolean {
  const previewInventory = playerState.inventory.map((item) => (item ? ([...item] as [number, number, number]) : null));
  const previewManager = new InventoryManager(previewInventory, itemCatalog);

  const removed = previewManager.removeItems(inputItemId, totalInputToConsume, 0);
  if (removed.removed < totalInputToConsume) {
    return false;
  }

  const added = previewManager.addItems(outputItemId, totalOutputToCreate, 0);
  return added.overflow === 0;
}

function getPrimaryRecipeInputAmount(definition: { recipe: unknown }): number {
  const recipe = definition.recipe as unknown;
  if (!Array.isArray(recipe)) {
    return 1;
  }

  const first = recipe[0] as any;
  const amount = Number(first?.amount);
  if (!Number.isInteger(amount) || amount <= 0) {
    return 1;
  }
  return amount;
}

function getBonusMultiplier(outputItemId: number, enchantingLevel: number): number {
  const unlocks = BONUS_MULTIPLIERS_BY_OUTPUT_ITEM_ID[outputItemId] ?? [];
  let multiplier = 1;
  for (const unlock of unlocks) {
    if (enchantingLevel >= unlock.level && unlock.multiplier > multiplier) {
      multiplier = unlock.multiplier;
    }
  }
  return multiplier;
}
