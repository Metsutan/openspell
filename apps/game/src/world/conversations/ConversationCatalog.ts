/**
 * ConversationCatalog.ts - Loads and manages NPC conversation definitions.
 */

import { AssetLoader } from "../assets/AssetLoader";

const CONVERSATION_DEFS_FILENAME = process.env.NPC_CONVERSATION_DEFS_FILE || "npcconversationdefs.carbon";

export interface ConversationRequirement {
  type: string;
  [key: string]: unknown;
}

export interface PlayerConversationOption {
  id: number;
  requirements: ConversationRequirement[] | null;
  text: string;
  fullText?: string | null;
  nextDialogueId: number | null;
}

export interface PlayerEventAction {
  type: string;
  [key: string]: unknown;
}

export interface ContinuanceDialogue {
  requirements: ConversationRequirement[] | null;
  nextDialogueId: number;
}

export interface ConversationDialogue {
  id: number;
  npcText: string | null;
  playerConversationOptions: PlayerConversationOption[] | null;
  playerEventActions: PlayerEventAction[] | null;
  continuanceDialogues: ContinuanceDialogue[] | null;
}

export interface InitialConversationDialogue {
  id: number;
  requirements: ConversationRequirement[] | null;
}

export interface ConversationDefinition {
  _id: number;
  description: string;
  initialConversationDialogues: InitialConversationDialogue[];
  conversationDialogues: ConversationDialogue[];
}

/**
 * Catalog of all NPC conversation definitions.
 */
export class ConversationCatalog {
  constructor(private readonly conversationsById: Map<number, ConversationDefinition>) {}

  /**
   * Loads all conversation definitions from the static file.
   */
  static async load(): Promise<ConversationCatalog> {
    try {
      const rawConversations = await AssetLoader.loadOverlayArray<ConversationDefinition>(CONVERSATION_DEFS_FILENAME, "_id");

      const conversationsById = new Map<number, ConversationDefinition>();
      for (const conv of rawConversations) {
        conversationsById.set(conv._id, conv);
      }

      console.log(`[ConversationCatalog] Loaded ${conversationsById.size} conversations`);
      return new ConversationCatalog(conversationsById);
    } catch (err) {
      console.error("[ConversationCatalog] Failed to load conversations:", err);
      return new ConversationCatalog(new Map());
    }
  }

  /**
   * Gets a conversation definition by ID.
   */
  getConversationById(conversationId: number): ConversationDefinition | undefined {
    return this.conversationsById.get(conversationId);
  }

  /**
   * Gets the initial dialogue ID for a conversation.
   * Returns the first initial dialogue that meets requirements (or first if no requirements).
   */
  getInitialDialogueId(conversationId: number): number {
    const conversation = this.conversationsById.get(conversationId);
    if (!conversation || conversation.initialConversationDialogues.length === 0) {
      return 0;
    }

    // For now, just return the first initial dialogue
    // TODO: Check requirements when requirement system is implemented
    return conversation.initialConversationDialogues[0].id;
  }

  /**
   * Gets a specific dialogue within a conversation.
   */
  getDialogue(conversationId: number, dialogueId: number): ConversationDialogue | undefined {
    const conversation = this.conversationsById.get(conversationId);
    if (!conversation) {
      return undefined;
    }

    return conversation.conversationDialogues.find((d) => d.id === dialogueId);
  }
}
