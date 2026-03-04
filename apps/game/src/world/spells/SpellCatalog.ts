import fs from "fs/promises";
import path from "path";

// Static spells path - configurable via environment variable
// Default assumes shared-assets structure for Docker compatibility
const DEFAULT_STATIC_ASSETS_DIR = path.resolve(
  __dirname,
  "../../../../..",
  "apps",
  "shared-assets",
  "base",
  "static"
);
const STATIC_ASSETS_DIR = process.env.STATIC_ASSETS_PATH
  ? path.resolve(process.env.STATIC_ASSETS_PATH)
  : DEFAULT_STATIC_ASSETS_DIR;

const SPELL_DEFS_FILENAME = process.env.SPELL_DEFS_FILE || "spelldefs.10.carbon";
const SPELL_DEFS_FILE = path.join(STATIC_ASSETS_DIR, SPELL_DEFS_FILENAME);

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
    const rawData = await fs.readFile(SPELL_DEFS_FILE, "utf8");
    const rawDefs = JSON.parse(rawData) as RawSpellDefinition[];

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
