import * as fs from "fs";
import * as path from "path";
import { 
  RequirementsChecker, 
  RequirementCheckContext, 
  RequirementCheckResult,
  Requirement 
} from "./RequirementsChecker";

/**
 * Represents a location with x, y, and map level.
 */
export interface WorldEntityActionLocation {
  x: number;
  y: number;
  lvl: number;
}

/**
 * Represents a player event action (e.g., TeleportTo, GoThroughDoor, MineThroughRocks).
 */
export interface PlayerEventAction {
  type: string;
  /** Used by TeleportTo */
  location?: WorldEntityActionLocation;
  /** Used by GoThroughDoor - position on one side of the door */
  insideLocation?: WorldEntityActionLocation;
  /** Used by GoThroughDoor - position on other side of the door */
  outsideLocation?: WorldEntityActionLocation;
  /** Used by GoThroughDoor - when true, requirements apply in both directions (default is outside -> inside only) */
  checkRequirementsFromBothSides?: boolean;
  /** Used by GoThroughDoor - if true, may lock inside -> outside traversal (unless requirements are explicitly one-way) */
  doesLockAfterEntering?: boolean;
  /** Used by MineThroughRocks - position on one side of the rocks */
  sideOne?: WorldEntityActionLocation;
  /** Used by MineThroughRocks - position on other side of the rocks */
  sideTwo?: WorldEntityActionLocation;
  /** Used by PlayerGiveItems - optional message when items are removed */
  messageToPlayer?: string;
  /** Used by PlayerGiveItems - item stacks removed from player inventory */
  playerGiveItems?: Array<{
    id?: number;
    itemId?: number;
    isIOU?: boolean;
    isiou?: boolean;
    amt?: number;
    amount?: number;
  }>;
  /** Optional side filter in data; currently not evaluated by server */
  executeOnDoorSide?: string;
  /** Used by SpawnInstancedNPC */
  id?: number;
  spawnOnDoorSide?: string | null;
  requirements?: Requirement[] | null;
}

/**
 * Represents an action that can be performed on a world entity.
 */
export interface WorldEntityAction {
  targetAction: string;
  requirements: Requirement[] | null;
  requirementFailureMessage?: string; // Optional custom message when requirements fail
  playerEventActions: PlayerEventAction[];
}

/**
 * Represents the configuration for a world entity type.
 */
export interface WorldEntityTypeConfig {
  worldEntityTypeId: number;
  onActions: WorldEntityAction[];
}

/**
 * Service for loading and accessing world entity action configurations.
 * Parses worldentityactions.4.carbon file and provides lookup methods.
 */
export class WorldEntityActionService {
  private actionsByEntityId: Map<number, WorldEntityTypeConfig> = new Map();
  private initialized = false;
  private requirementsChecker: RequirementsChecker;

  constructor() {
    this.requirementsChecker = new RequirementsChecker();
  }

  /**
   * Loads and parses the worldentityactions.4.carbon file.
   * Should be called during server initialization.
   */
  async initialize(filePath?: string): Promise<void> {
    if (this.initialized) {
      console.warn("[WorldEntityActionService] Already initialized");
      return;
    }

    // Default path to the worldentityactions file - now in shared-assets
    const defaultStaticDir = path.join(
      __dirname,
      "../../../..",
      "shared-assets/base/static"
    );
    const staticDir = process.env.STATIC_ASSETS_PATH 
      ? path.resolve(process.env.STATIC_ASSETS_PATH)
      : defaultStaticDir;
    
    const worldEntityActionsFilename = process.env.WORLD_ENTITY_ACTIONS_FILE || "worldentityactions.4.carbon";
    const defaultPath = path.join(staticDir, worldEntityActionsFilename);
    const actualPath = filePath ?? defaultPath;

    try {
      console.log(`[WorldEntityActionService] Loading from: ${actualPath}`);
      const fileContent = fs.readFileSync(actualPath, "utf-8");
      const configs: WorldEntityTypeConfig[] = JSON.parse(fileContent);

      // Index by worldEntityTypeId for fast lookup
      for (const config of configs) {
        this.actionsByEntityId.set(config.worldEntityTypeId, config);
      }

      this.initialized = true;
      console.log(
        `[WorldEntityActionService] Loaded ${configs.length} world entity action configurations`
      );
    } catch (error) {
      console.error("[WorldEntityActionService] Failed to load worldentityactions.4.carbon:", error);
      throw error;
    }
  }

  /**
   * Gets the action configuration for a specific world entity and action.
   * 
   * @param worldEntityId The ID of the world entity instance
   * @param actionName The action being performed (e.g., "enter", "exit", "touch")
   * @returns The action configuration if found, or null
   */
  getActionConfig(worldEntityId: number, actionName: string): WorldEntityAction | null {
    const config = this.actionsByEntityId.get(worldEntityId);
    if (!config) {
      return null;
    }

    // Find the matching action
    const action = config.onActions.find(
      (a) => a.targetAction.toLowerCase() === actionName.toLowerCase()
    );

    return action ?? null;
  }

  /**
   * Checks if a world entity supports a specific action.
   * 
   * @param worldEntityId The ID of the world entity instance
   * @param actionName The action to check
   * @returns True if the action is supported
   */
  hasAction(worldEntityId: number, actionName: string): boolean {
    return this.getActionConfig(worldEntityId, actionName) !== null;
  }

  /**
   * Gets all actions supported by a world entity.
   * 
   * @param worldEntityId The ID of the world entity instance
   * @returns Array of action names
   */
  getAvailableActions(worldEntityId: number): string[] {
    const config = this.actionsByEntityId.get(worldEntityId);
    if (!config) {
      return [];
    }

    return config.onActions.map((a) => a.targetAction);
  }

  /**
   * Returns whether the service has been initialized.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Checks if a player meets the requirements for a specific action.
   * 
   * @param action The world entity action to check requirements for
   * @param context The requirement check context (player state, quest progress, etc.)
   * @returns Result indicating if requirements are met and failure reason if not
   */
  checkActionRequirements(
    action: WorldEntityAction,
    context: RequirementCheckContext
  ): RequirementCheckResult {
    // If no requirements, pass
    if (!action.requirements || action.requirements.length === 0) {
      return { passed: true };
    }

    return this.requirementsChecker.checkRequirements(
      action.requirements,
      context
    );
  }

  /**
   * Gets action config and checks if requirements are met in one call.
   * 
   * @param worldEntityId The ID of the world entity instance
   * @param actionName The action being performed (e.g., "enter", "exit", "touch")
   * @param context The requirement check context
   * @returns Object with action config and requirement check result, or null if action not found
   */
  getActionWithRequirementCheck(
    worldEntityId: number,
    actionName: string,
    context: RequirementCheckContext
  ): { action: WorldEntityAction; requirementCheck: RequirementCheckResult } | null {
    const action = this.getActionConfig(worldEntityId, actionName);
    if (!action) {
      return null;
    }

    const requirementCheck = this.checkActionRequirements(action, context);

    return {
      action,
      requirementCheck,
    };
  }
}
