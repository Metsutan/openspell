/* eslint-disable no-console */
/**
 * Generates TS protocol "fields" enums + packet codecs from `apps/game/gameActionFactory.js`.
 *
 * This script is intentionally conservative: it focuses on *positional field order* and emits
 * simple decode/build helpers. You can later improve types for specific packets as you reverse
 * engineer them further.
 *
 * Run from repo root:
 *   node apps/game/tools/generate-protocol-from-factory.js
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..", "..", "..");
const FACTORY_PATH = path.join(REPO_ROOT, "apps", "game", "gameActionFactory.js");

const OUT_FIELDS_DIR = path.join(REPO_ROOT, "apps", "game", "src", "protocol", "fields", "actions");
const OUT_PACKETS_DIR = path.join(REPO_ROOT, "apps", "game", "src", "protocol", "packets", "actions");
const OVERWRITE = process.argv.includes("--overwrite");

/**
 * Some actions have known wire-order mismatches in the decompiled factory method body.
 * We pin them here so generated field enums match the real packet index order.
 */
const FIELD_ORDER_OVERRIDES = {
  PlayerEnteredChunk: [
    "EntityID",
    "EntityTypeID",
    "PlayerType",
    "Username",
    "MapLevel",
    "X",
    "Y",
    "HairStyleID",
    "BeardStyleID",
    "ShirtID",
    "BodyTypeID",
    "LegsID",
    "EquipmentHeadID",
    "EquipmentBodyID",
    "EquipmentLegsID",
    "EquipmentBootsID",
    "EquipmentNecklaceID",
    "EquipmentWeaponID",
    "EquipmentShieldID",
    "EquipmentBackPackID",
    "EquipmentGlovesID",
    "EquipmentProjectileID",
    "CombatLevel",
    "HitpointsLevel",
    "CurrentHitpointsLevel",
    "CurrentState",
    "MentalClarity",
  ],
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function toSafeTsIdent(name) {
  // Keep underscores; strip anything weird.
  return name.replace(/[^A-Za-z0-9_]/g, "");
}

function parseMethods(source) {
  // The file is a "method list" snippet (not valid JS). We parse by brace matching.
  const lines = source.split(/\r?\n/);
  const methods = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = /^create([A-Za-z0-9_]+)\((.*)\)\s*\{\s*$/.exec(line);
    if (!m) {
      i++;
      continue;
    }
    const methodName = "create" + m[1];
    const params = m[2];

    let body = "";
    let depth = 1;
    i++;
    while (i < lines.length && depth > 0) {
      const l = lines[i];
      // naive but works for this snippet style
      if (/\{\s*$/.test(l)) depth++;
      if (/^\s*\}\s*$/.test(l)) depth--;
      if (depth > 0) body += l + "\n";
      i++;
    }

    methods.push({ methodName, params, body });
  }

  return methods;
}

function extractActionConst(body) {
  const m = /new\s+AN\(\s*gameActions\.([A-Za-z0-9_]+)\s*,?/m.exec(body);
  return m ? m[1] : null;
}

function extractFieldRefs(body) {
  // Capture only LHS array assignments: [Enum.Field] = ...
  // This avoids pulling in unrelated enums from RHS expressions (e.g. kP.helmet).
  const refs = [];
  const re = /\[\s*([A-Za-z0-9_$]+)\.([A-Za-z0-9_]+)\s*\]\s*=/g;
  for (;;) {
    const m = re.exec(body);
    if (!m) break;
    refs.push({ enumSym: m[1], field: m[2], raw: `${m[1]}.${m[2]}` });
  }
  return refs;
}

function guessFieldType(body, enumSym, fieldName) {
  // heuristic: check assignment expression snippets around `[Enum.Field] = ...`
  const re = new RegExp(`\\[\\s*${enumSym.replace(/\$/g, "\\$")}\\.${fieldName}\\s*\\]\\s*=\\s*([^,\\n]+)`, "m");
  const m = re.exec(body);
  if (!m) return "unknown";
  const expr = m[1];
  if (/\?\s*1\s*:\s*0/.test(expr)) return "bool01";
  if (/toLowerCase\(\)/.test(expr)) return "string";
  if (/Math\.round\(/.test(expr)) return "number";
  if (/parseInt\(/.test(expr)) return "number";
  if (/new\s+Array\(/.test(expr) || /\.map\(/.test(expr) || /\.fill\(/.test(expr)) return "unknown";
  return "unknown";
}

function applyFieldOrderOverride(actionConst, uniqueFieldRefs) {
  const orderedFields = FIELD_ORDER_OVERRIDES[actionConst];
  if (!orderedFields) return uniqueFieldRefs;

  const byField = new Map(uniqueFieldRefs.map((r) => [r.field, r]));
  const overridden = [];
  const used = new Set();

  for (const field of orderedFields) {
    const ref = byField.get(field);
    if (!ref) continue;
    overridden.push(ref);
    used.add(field);
  }

  for (const ref of uniqueFieldRefs) {
    if (!used.has(ref.field)) overridden.push(ref);
  }

  return overridden;
}

function emitFieldsEnum(actionConst, fieldRefs) {
  const enumName = `${toSafeTsIdent(actionConst)}Fields`;
  const unique = [];
  const seen = new Set();
  for (const r of fieldRefs) {
    if (seen.has(r.field)) continue;
    seen.add(r.field);
    unique.push(r);
  }
  const ordered = applyFieldOrderOverride(actionConst, unique);

  const lines = [];
  lines.push(`/**`);
  lines.push(` * Auto-generated from \`apps/game/gameActionFactory.js\``);
  lines.push(` * Action: \`${actionConst}\``);
  if (ordered.length > 0) lines.push(` * Source field enum: \`${ordered[0].enumSym}\``);
  lines.push(` */`);
  lines.push(`export enum ${enumName} {`);
  ordered.forEach((r, idx) => {
    lines.push(`  ${r.field} = ${idx},`);
  });
  lines.push(`}`);
  lines.push(``);
  return { enumName, content: lines.join("\n"), unique: ordered };
}

function emitPacketCodec(actionConst, enumName, uniqueFieldRefs, body) {
  const typeName = `${toSafeTsIdent(actionConst)}Payload`;
  const fnDecode = `decode${toSafeTsIdent(actionConst)}Payload`;
  const fnBuild = `build${toSafeTsIdent(actionConst)}Payload`;

  // Null payload actions
  if (/new\s+AN\(\s*gameActions\.[A-Za-z0-9_]+\s*,\s*null\s*\)/m.test(body)) {
    const c = [];
    c.push(`/** Auto-generated from \`apps/game/gameActionFactory.js\` (${actionConst}) */`);
    c.push(`export type ${typeName} = null;`);
    c.push(``);
    c.push(`export function ${fnDecode}(payload: unknown): ${typeName} {`);
    c.push(`  if (payload !== null) throw new Error("${actionConst} payload must be null");`);
    c.push(`  return null;`);
    c.push(`}`);
    c.push(``);
    c.push(`export function ${fnBuild}(): ${typeName} {`);
    c.push(`  return null;`);
    c.push(`}`);
    c.push(``);
    return { typeName, content: c.join("\n") };
  }

  const c = [];
  // packets live at src/protocol/packets/actions/* so codec is ../../codec/*
  c.push(`import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";`);
  c.push(`import { ${enumName} } from "../../fields/actions/${enumName}";`);
  c.push(``);
  c.push(`/** Auto-generated from \`apps/game/gameActionFactory.js\` (${actionConst}) */`);
  c.push(`export type ${typeName} = {`);
  for (const r of uniqueFieldRefs) {
    const t = guessFieldType(body, r.enumSym, r.field);
    const tsType =
      t === "bool01" ? "boolean" :
      t === "string" ? "string" :
      t === "number" ? "number" :
      "unknown";
    c.push(`  ${r.field}: ${tsType};`);
  }
  c.push(`};`);
  c.push(``);
  c.push(`export function ${fnDecode}(payload: unknown): ${typeName} {`);
  c.push(`  assertIsArray(payload, "${actionConst} payload");`);
  c.push(`  const arr = payload as PacketArray;`);
  c.push(`  return {`);
  for (const r of uniqueFieldRefs) {
    c.push(`    ${r.field}: arr[${enumName}.${r.field}] as any,`);
  }
  c.push(`  };`);
  c.push(`}`);
  c.push(``);
  c.push(`export function ${fnBuild}(data: ${typeName}): unknown[] {`);
  c.push(`  const arr: unknown[] = new Array(${uniqueFieldRefs.length});`);
  for (const r of uniqueFieldRefs) {
    const t = guessFieldType(body, r.enumSym, r.field);
    if (t === "bool01") {
      c.push(`  arr[${enumName}.${r.field}] = data.${r.field} ? 1 : 0;`);
    } else {
      c.push(`  arr[${enumName}.${r.field}] = data.${r.field};`);
    }
  }
  c.push(`  return arr;`);
  c.push(`}`);
  c.push(``);

  return { typeName, content: c.join("\n") };
}

function main() {
  if (!fs.existsSync(FACTORY_PATH)) {
    console.error("Factory file not found:", FACTORY_PATH);
    process.exit(1);
  }
  const source = fs.readFileSync(FACTORY_PATH, "utf8");
  const methods = parseMethods(source);

  ensureDir(OUT_FIELDS_DIR);
  ensureDir(OUT_PACKETS_DIR);

  // We already maintain these by hand as core envelopes / early examples.
  const skipActionConsts = new Set([
  ]);

  const fieldIndexExports = [];
  const packetExports = [];

  let generatedFields = 0;
  let generatedPackets = 0;
  let updatedFields = 0;
  let updatedPackets = 0;

  for (const m of methods) {
    const actionConst = extractActionConst(m.body);
    if (!actionConst) continue;
    if (skipActionConsts.has(actionConst)) continue;

    const fieldRefs = extractFieldRefs(m.body);
    const { enumName, content: fieldsContent, unique } = emitFieldsEnum(actionConst, fieldRefs);

    const fieldsPath = path.join(OUT_FIELDS_DIR, `${enumName}.ts`);
    if (!fs.existsSync(fieldsPath) || OVERWRITE) {
      const existed = fs.existsSync(fieldsPath);
      fs.writeFileSync(fieldsPath, fieldsContent, "utf8");
      if (existed) updatedFields++;
      else generatedFields++;
    }
    fieldIndexExports.push(`export { ${enumName} } from "./${enumName}";`);

    const { content: packetContent } = emitPacketCodec(actionConst, enumName, unique, m.body);
    const packetFileName = `${toSafeTsIdent(actionConst)}.ts`;
    const packetPath = path.join(OUT_PACKETS_DIR, packetFileName);
    if (!fs.existsSync(packetPath) || OVERWRITE) {
      const existed = fs.existsSync(packetPath);
      fs.writeFileSync(packetPath, packetContent, "utf8");
      if (existed) updatedPackets++;
      else generatedPackets++;
    }
    packetExports.push(`export * from "./${toSafeTsIdent(actionConst)}";`);
  }

  // Write barrels (stable sorted)
  fieldIndexExports.sort();
  packetExports.sort();

  fs.writeFileSync(path.join(OUT_FIELDS_DIR, "index.ts"), fieldIndexExports.join("\n") + "\n", "utf8");
  fs.writeFileSync(path.join(OUT_PACKETS_DIR, "index.ts"), packetExports.join("\n") + "\n", "utf8");

  console.log(`[generate-protocol] methods parsed: ${methods.length}`);
  console.log(`[generate-protocol] fields generated: ${generatedFields}`);
  console.log(`[generate-protocol] packets generated: ${generatedPackets}`);
  console.log(`[generate-protocol] fields updated: ${updatedFields}`);
  console.log(`[generate-protocol] packets updated: ${updatedPackets}`);
  console.log(`[generate-protocol] fields dir: ${OUT_FIELDS_DIR}`);
  console.log(`[generate-protocol] packets dir: ${OUT_PACKETS_DIR}`);
}

main();

