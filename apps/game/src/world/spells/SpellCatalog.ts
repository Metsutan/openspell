import { AssetLoader } from "../assets/AssetLoader";

const SPELL_DEFS_FILENAME = process.env.SPELL_DEFS_FILE || "spelldefs.carbon";

export type SpellRecipeEntry = {
  itemId: number;
  amount: number;
};

export type SplashDamage = {
  size: number;
  damageAmountsFromCenter: number[];
  doesSplashDamageGiveXP: boolean;
};

export type SpellDefinition = {
  id: number;
  name: string;
  description: string;
  type: string;
  level: number;
  exp: number;
  maxDamage: number;
  recipe: SpellRecipeEntry[] | null;
  requirements: unknown;
  range?: number | null;
  splashDamage?: SplashDamage | null;
};

type RawSpellDefinition = {
  _id: number;
  name?: string;
  desc?: string;
  type?: string;
  lvl?: number;
  exp?: number;
  maxDamage?: number;
  recipe?: SpellRecipeEntry[] | null;
  requirements?: unknown;
  range?: number | null;
  splashDamage?: SplashDamage | null;
};

export class SpellCatalog {
  constructor(private readonly definitionsById: Map<number, SpellDefinition>) {}

  static async load(): Promise<SpellCatalog> {
    const rawDefs = await AssetLoader.loadOverlayArray<RawSpellDefinition>(SPELL_DEFS_FILENAME, "_id");

    const definitionsById = new Map<number, SpellDefinition>();
    for (const raw of rawDefs) {
      if (!raw || typeof raw._id !== "number") {
        continue;
      }
      const definition: SpellDefinition = {
        id: raw._id,
        name: raw.name ?? `Spell #${raw._id}`,
        description: raw.desc ?? "",
        type: raw.type ?? "unknown",
        level: raw.lvl ?? 1,
        exp: raw.exp ?? 0,
        maxDamage: raw.maxDamage ?? 0,
        recipe: raw.recipe ?? null,
        requirements: raw.requirements ?? null,
        range: raw.range ?? null,
        splashDamage: raw.splashDamage ?? null
      };
      definitionsById.set(definition.id, definition);
    }

    return new SpellCatalog(definitionsById);
  }

  getDefinitionById(id: number): SpellDefinition | undefined {
    return this.definitionsById.get(id);
  }
}
