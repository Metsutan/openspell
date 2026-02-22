import { GameAction } from "../../protocol/enums/GameAction";
import { States } from "../../protocol/enums/States";
import { buildReceivedBankItemsPayload } from "../../protocol/packets/actions/ReceivedBankItems";
import { buildStartedBankingPayload } from "../../protocol/packets/actions/StartedBanking";
import type { PlayerState, BankItem } from "../../world/PlayerState";

/**
 * Full bank storage: 500 slots, each can be null (empty) or a BankItem tuple
 * CRITICAL: Must include null to preserve slot positions!
 */
export type FullBank = (BankItem | null)[];

/**
 * Bank storage size constant
 */
export const BANK_SLOT_COUNT = 300;

/**
 * Configuration for BankingService
 */
export interface BankingServiceConfig {
  /** Callback to send messages to specific users */
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  
  /** Map of all connected player states */
  playerStatesByUserId: Map<number, PlayerState>;
}

/**
 * BankingService
 * 
 * Manages player banking operations:
 * - Loading bank data from database
 * - Sending bank contents to client (once per connection)
 * - Depositing and withdrawing items
 * - Saving bank changes to database
 * 
 * Design:
 * - ReceivedBankItems packet is sent ONCE per connection when player first opens bank
 * - Client caches the bank contents locally
 * - All subsequent deposits/withdrawals send only delta updates
 */
export class BankingService {
  /** Track which users have received their bank items this session */
  private readonly receivedBankItems = new Set<number>();
  
  /** Reference to the Prisma client (injected lazily) */
  private prisma: any = null;
  
  private readonly config: BankingServiceConfig;
  
  constructor(config: BankingServiceConfig) {
    this.config = config;
  }
  
  /**
   * Initialize the service with database access
   * Called after database connection is established
   */
  async initialize(prisma: any) {
    this.prisma = prisma;
  }
  
  /**
   * Reset tracking when a player disconnects
   * Called by GameServer on player disconnect
   */
  handlePlayerDisconnect(userId: number): void {
    this.receivedBankItems.delete(userId);
  }
  
  /**
   * Opens the bank for a player
   * 
   * Prerequisites: Bank data should already be loaded during login (pre-loaded for performance)
   * 
   * Flow:
   * - First time per session: Sends ReceivedBankItems + StartedBanking
   * - Subsequent times: Sends only StartedBanking
   * - Always: Sets player state to BankingState
   * 
   * @param userId - The user opening the bank
   * @param worldEntityId - The world entity ID of the bank being accessed (e.g., 2907)
   * @returns Promise<boolean> - True if bank was opened successfully
   */
  async openBank(userId: number, worldEntityId: number = 0): Promise<boolean> {
    // Get player state
    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[banking] Cannot open bank for user ${userId}: player state not found`);
      return false;
    }
    
    // Bank should already be loaded during login for instant response
    // If not loaded, attempt lazy load as fallback (shouldn't normally happen)
    if (!playerState.bank) {
      console.warn(`[banking] Bank not pre-loaded for user ${userId}, loading now (unexpected)`);
      const loaded = await this.loadBankForPlayer(userId, playerState.persistenceId);
      if (!loaded) {
        console.error(`[banking] Failed to load bank for user ${userId}`);
        return false;
      }
      playerState.bank = loaded;
    }
    
    // Check if this is the first time opening bank this session
    const isFirstOpen = !this.receivedBankItems.has(userId);
    
    if (isFirstOpen) {
      // Send ReceivedBankItems packet (once per session)
      // Note: Items must be wrapped in an array [[null, [itemId, amount], null, ...]]
      const receivedPayload = buildReceivedBankItemsPayload({
        Items: this.serializeBankForClient(playerState.bank)
      });
      
      this.config.enqueueUserMessage(userId, GameAction.ReceivedBankItems, receivedPayload);
      
      // Mark that this user has received their bank items
      this.receivedBankItems.add(userId);
      
    }
    
    // Always send StartedBanking packet (every time bank is opened)
    // Note: EntityID is player's userId, BankID is the world entity ID
    const startedPayload = buildStartedBankingPayload({
      EntityID: userId,        // Player's ID
      BankID: worldEntityId    // World entity ID (e.g., 2907)
    });
    
    this.config.enqueueUserMessage(userId, GameAction.StartedBanking, startedPayload);
    
    // Set player state to BankingState
    playerState.setState(States.BankingState);
    return true;
  }
  
  /**
   * Loads a player's bank from the database
   * 
   * This method is called during login to pre-load bank data for instant response.
   * Public so it can be called by ConnectionService during player login.
   * 
   * @param userId - The user to load bank for
   * @returns Promise<FullBank | null> - The bank data or null on error
   */
  async loadBankForPlayer(userId: number, persistenceId: number): Promise<FullBank | null> {
    if (!this.prisma) {
      console.warn("[banking] Database not initialized, returning empty bank");
      return this.createEmptyBank();
    }
    if (!Number.isInteger(persistenceId) || persistenceId <= 0) {
      throw new Error(`[banking] Missing persistenceId for bank load (user ${userId})`);
    }
    
    try {
      const record = await this.prisma.playerBank.findUnique({
        where: {
          userId_persistenceId: {
            userId,
            persistenceId
          }
        }
      });
      
      if (!record) {
        // Player has no bank record yet, create empty bank
        return this.createEmptyBank();
      }
      
      // Parse the JSON bank data
      const bankData = this.parseBankData(record.items);
      return bankData;
      
    } catch (error) {
      console.error(`[banking] Error loading bank for user ${userId}:`, error);
      return null;
    }
  }
  
  /**
   * Saves a player's bank to the database
   * 
   * @param userId - The user to save bank for
   * @returns Promise<boolean> - True if save was successful
   */
  async saveBankToDatabase(playerState: PlayerState): Promise<boolean> {
    if (!this.prisma) {
      console.warn(`[banking] Database not initialized, cannot save bank for user ${playerState.userId}`);
      return false;
    }
    
    if (!playerState || !playerState.bank) {
      console.warn(`[banking] Cannot save bank for user ${playerState.userId}: no bank data in memory`);
      return false;
    }
    if (!Number.isInteger(playerState.persistenceId) || playerState.persistenceId <= 0) {
      throw new Error(`[banking] Missing persistenceId for bank save (user ${playerState.userId})`);
    }
    
    try {
      await this.prisma.playerBank.upsert({
        where: {
          userId_persistenceId: {
            userId: playerState.userId,
            persistenceId: playerState.persistenceId
          }
        },
        create: {
          userId: playerState.userId,
          persistenceId: playerState.persistenceId,
          items: this.serializeBankForDatabase(playerState.bank)
        },
        update: {
          items: this.serializeBankForDatabase(playerState.bank)
        }
      });
      
      return true;
      
    } catch (error) {
      console.error(`[banking] Error saving bank for user ${playerState.userId}:`, error);
      return false;
    }
  }
  
  // ============================================================================
  // Utility Methods
  // ============================================================================
  
  /**
   * Creates an empty bank (all 500 slots null)
   */
  createEmptyBank(): FullBank {
    return Array(BANK_SLOT_COUNT).fill(null);
  }
  
  /**
   * Parses bank data from database JSON format
   * 
   * CRITICAL: Preserves nulls at each slot position to maintain bank sorting/organization.
   * Always returns exactly 500 slots with nulls for empty positions.
   */
  private parseBankData(rawData: unknown): FullBank {
    if (!Array.isArray(rawData)) {
      return this.createEmptyBank();
    }
    
    // Ensure exactly 500 slots - nulls MUST be preserved for slot ordering
    const bank: FullBank = [];
    for (let i = 0; i < BANK_SLOT_COUNT; i++) {
      const slot = rawData[i];
      
      // Validate slot format: null or [itemId, amount]
      if (slot === null || slot === undefined) {
        bank.push(null); // Preserve null - critical for slot positions
      } else if (Array.isArray(slot) && slot.length >= 2) {
        const itemId = Number(slot[0]);
        const amount = Number(slot[1]);
        
        if (Number.isInteger(itemId) && Number.isInteger(amount) && amount > 0) {
          bank.push([itemId, amount]);
        } else {
          bank.push(null); // Invalid data becomes null
        }
      } else {
        bank.push(null); // Invalid format becomes null
      }
    }
    
    return bank;
  }
  
  /**
   * Serializes bank data for database storage (JSON)
   * 
   * CRITICAL: Preserves nulls to maintain slot positions.
   * Returns array of exactly 500 elements: null or [itemId, amount]
   */
  private serializeBankForDatabase(bank: FullBank): unknown {
    return bank.map((slot) => (slot === null ? null : [slot[0], slot[1]]));
  }
  
  /**
   * Serializes bank data for client packet
   * 
   * CRITICAL: Client requires the full 500-slot array with nulls preserved.
   * Nulls are mandatory to maintain bank sorting and organization.
   * Returns: [null, [itemId, amount], null, [itemId, amount], ...]
   * 
   * Note: This returns the inner array. The caller must wrap it in another array:
   * Items: [[null, [itemId, amount], null, ...]]
   */
  private serializeBankForClient(bank: FullBank): unknown {
    return bank.map((slot) => (slot === null ? null : [slot[0], slot[1]]));
  }
  
  /**
   * Counts the number of non-empty slots in the bank
   */
  private countNonEmptySlots(bank: FullBank): number {
    return bank.filter((slot) => slot !== null).length;
  }
  
  /**
   * Deposits an item into the bank
   * 
   * Adds the specified amount to the bank. First tries to stack with existing
   * items of the same type, then uses first empty slot if needed.
   * 
   * @param userId - The user depositing to bank
   * @param itemId - The item ID to deposit
   * @param amount - Amount to deposit
   * @param preferredSlot - Optional preferred slot for redeposit scenarios
   * @returns Object with success status, slot where deposited, and previous/new amounts
   */
  depositItem(userId: number, itemId: number, amount: number, preferredSlot?: number): {
    success: boolean;
    slot: number;
    previousAmount: number;
    newAmount: number;
  } {
    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState || !playerState.bank) {
      return { success: false, slot: -1, previousAmount: 0, newAmount: 0 };
    }
    
    // Validate itemId and amount
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return { success: false, slot: -1, previousAmount: 0, newAmount: 0 };
    }
    
    if (!Number.isInteger(amount) || amount <= 0) {
      return { success: false, slot: -1, previousAmount: 0, newAmount: 0 };
    }
    
    let targetSlot = -1;
    let shouldCreateAtTargetSlot = false;
    
    // Prefer restoring to a specific slot when possible (e.g., withdraw overflow rollback)
    if (preferredSlot !== undefined && this.isValidSlotIndex(preferredSlot)) {
      const preferredItem = playerState.bank[preferredSlot];
      if (preferredItem === null) {
        targetSlot = preferredSlot;
        shouldCreateAtTargetSlot = true;
      } else if (preferredItem[0] === itemId) {
        targetSlot = preferredSlot;
      }
    }
    
    // If preferred slot wasn't usable, find existing slot with same itemId
    if (targetSlot === -1) {
      for (let i = 0; i < BANK_SLOT_COUNT; i++) {
        const bankItem = playerState.bank[i];
        if (bankItem && bankItem[0] === itemId) {
          targetSlot = i;
          break;
        }
      }
  }
    
    let previousAmount = 0;
    
    if (targetSlot !== -1 && !shouldCreateAtTargetSlot) {
      // Found existing slot, add to it
      const bankItem = playerState.bank[targetSlot]!;
      previousAmount = bankItem[1];
      bankItem[1] += amount;
    } else if (targetSlot !== -1 && shouldCreateAtTargetSlot) {
      // Preferred slot is empty: restore stack directly into that slot
      playerState.bank[targetSlot] = [itemId, amount];
      previousAmount = 0;
    } else {
      // No existing slot, find first empty slot
      targetSlot = this.findFirstEmptySlot(playerState.bank);
      
      if (targetSlot === -1) {
        // Bank is full
        return { success: false, slot: -1, previousAmount: 0, newAmount: 0 };
      }
      
      // Create new item in empty slot
      playerState.bank[targetSlot] = [itemId, amount];
      previousAmount = 0;
    }
    
    const newAmount = previousAmount + amount;
    
    // Mark bank as dirty for autosave
    playerState.markBankDirty();
    
    return {
      success: true,
      slot: targetSlot,
      previousAmount,
      newAmount
    };
  }

  /**
   * Validates if a slot index is within valid bank bounds
   */
  isValidSlotIndex(slotIndex: number): boolean {
    return Number.isInteger(slotIndex) && slotIndex >= 0 && slotIndex < BANK_SLOT_COUNT;
  }
  
  /**
   * Finds the first empty slot in the bank
   * @returns Slot index or -1 if bank is full
   */
  findFirstEmptySlot(bank: FullBank): number {
    return bank.findIndex((slot) => slot === null);
  }
  
  /**
   * Counts the number of empty slots in the bank
   */
  countEmptySlots(bank: FullBank): number {
    return bank.filter((slot) => slot === null).length;
  }
  
  // ============================================================================
  // Bank Manipulation Methods
  // ============================================================================
  
  /**
   * Withdraws an item from the bank
   * 
   * Removes the specified amount from a bank slot. If the amount exceeds
   * what's available, withdraws only what's available.
   * 
   * @param userId - The user withdrawing from bank
   * @param slot - Bank slot index
   * @param amount - Amount to withdraw (will be clamped to available)
   * @returns Object with success status, actual itemId/amount withdrawn, and remaining amount
   */
  withdrawItem(userId: number, slot: number, amount: number): {
    success: boolean;
    itemId: number;
    amountWithdrawn: number;
    amountRemaining: number;
  } {
    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState || !playerState.bank) {
      return { success: false, itemId: -1, amountWithdrawn: 0, amountRemaining: 0 };
    }
    
    // Validate slot
    if (!this.isValidSlotIndex(slot)) {
      return { success: false, itemId: -1, amountWithdrawn: 0, amountRemaining: 0 };
    }
    
    // Validate amount
    if (!Number.isInteger(amount) || amount <= 0) {
      return { success: false, itemId: -1, amountWithdrawn: 0, amountRemaining: 0 };
    }
    
    const bankItem = playerState.bank[slot];
    if (!bankItem) {
      // Slot is empty
      return { success: false, itemId: -1, amountWithdrawn: 0, amountRemaining: 0 };
    }
    
    const [itemId, availableAmount] = bankItem;
    
    // Withdraw min(requested, available)
    const amountToWithdraw = Math.min(amount, availableAmount);
    const remaining = availableAmount - amountToWithdraw;
    
    if (remaining <= 0) {
      // Remove item from bank entirely
      playerState.bank[slot] = null;
    } else {
      // Reduce amount
      bankItem[1] = remaining;
    }
    
    // Mark bank as dirty for autosave
    playerState.markBankDirty();
    
    return {
      success: true,
      itemId,
      amountWithdrawn: amountToWithdraw,
      amountRemaining: remaining
    };
  }
  
  /**
   * Swaps two slots in the bank
   * 
   * @param userId - The user whose bank to modify
   * @param slot1 - First slot index
   * @param slot2 - Second slot index
   * @returns Object with success status and the items at each slot after swap
   */
  swapBankSlots(userId: number, slot1: number, slot2: number): {
    success: boolean;
    item1: BankItem | null;
    item2: BankItem | null;
  } {
    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState || !playerState.bank) {
      return { success: false, item1: null, item2: null };
    }
    
    // Validate slot indices
    if (!this.isValidSlotIndex(slot1) || !this.isValidSlotIndex(slot2)) {
      return { success: false, item1: null, item2: null };
    }
    
    // Perform the swap
    const temp = playerState.bank[slot1];
    playerState.bank[slot1] = playerState.bank[slot2];
    playerState.bank[slot2] = temp;
    
    // Mark bank as dirty for autosave
    playerState.markBankDirty();
    
    // Return the items at each slot after swap (note: indices are swapped in return)
    return {
      success: true,
      item1: playerState.bank[slot2], // What's now at slot1's position
      item2: playerState.bank[slot1]  // What's now at slot2's position
    };
  }
  
  /**
   * Inserts an item from one slot into another, shifting items down
   * 
   * Example: Insert slot 0 at slot 3
   * Before: [A, B, C, D, E, F]
   * After:  [B, C, D, A, E, F]
   * 
   * @param userId - The user whose bank to modify
   * @param fromSlot - Slot to take item from
   * @param toSlot - Slot to insert item at
   * @returns Object with success status and the items at each slot after insert
   */
  insertAtBankSlot(userId: number, fromSlot: number, toSlot: number): {
    success: boolean;
    item1: BankItem | null;
    item2: BankItem | null;
  } {
    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState || !playerState.bank) {
      return { success: false, item1: null, item2: null };
    }
    
    // Validate slot indices
    if (!this.isValidSlotIndex(fromSlot) || !this.isValidSlotIndex(toSlot)) {
      return { success: false, item1: null, item2: null };
    }
    
    // If same slot, no-op
    if (fromSlot === toSlot) {
      return {
        success: true,
        item1: playerState.bank[fromSlot],
        item2: playerState.bank[toSlot]
      };
    }
    
    // Remove item from fromSlot
    const [itemToMove] = playerState.bank.splice(fromSlot, 1);
    
    // Insert at toSlot (this shifts everything after toSlot down)
    playerState.bank.splice(toSlot, 0, itemToMove);
    
    // Mark bank as dirty for autosave
    playerState.markBankDirty();
    
    // Return items at the final positions
    return {
      success: true,
      item1: playerState.bank[fromSlot], // What's now at fromSlot after shift
      item2: playerState.bank[toSlot]    // What's now at toSlot (the moved item)
    };
  }
}
