const fs = require("fs");
const path = require("path");

const DEFAULT_CARBON_PATH = path.resolve(
  __dirname,
  "../apps/shared-assets/base/static/worldentityactions.carbon"
);

const ACTION_MAP = {
  "rock wall": "climb_same_map_level",
  "climbeablerocks": "climb_same_map_level",
  "climb": "climb_same_map_level",
  "fence gap": "squeeze_through",
  "gap": "squeeze_through",
  "squeeze": "squeeze_through",
  "log": "squeeze_through",
  "broken wall": "climb_over",
  "wall": "climb_over",
  "bridge jump": "jump_over",
  "jump": "jump_over"
};

const MAP_LEVELS = {
  overworld: 1,
  underworld: 0,
  underground: 0,
  cave: 0,
  sky: 2
};

/**
 * Parses CSV text and updates/inserts shortcut obstacles into worldentityactions.carbon
 * 
 * @param {string} csvContent - The CSV text with shortcut rows
 * @param {string} carbonPath - Path to worldentityactions.carbon
 * @param {object} options - Configuration options
 * @returns {{ added: number, updated: number, total: number }}
 */
function importShortcuts(csvContent, carbonPath = DEFAULT_CARBON_PATH, options = {}) {
  if (!fs.existsSync(carbonPath)) {
    throw new Error(`Target file not found: ${carbonPath}`);
  }

  // Backup file unless explicitly disabled
  if (options.backup !== false) {
    const backupPath = `${carbonPath}.bak`;
    fs.copyFileSync(carbonPath, backupPath);
    console.log(`[Backup] Created backup at ${backupPath}`);
  }

  const rawJson = fs.readFileSync(carbonPath, "utf-8");
  const actionConfigs = JSON.parse(rawJson);

  // Map of worldEntityTypeId -> config index
  const indexMap = new Map();
  actionConfigs.forEach((config, idx) => {
    indexMap.set(config.worldEntityTypeId, idx);
  });

  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // If first line is header, skip it
  const hasHeader = lines[0].toLowerCase().includes("location") || lines[0].toLowerCase().includes("id");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  let addedCount = 0;
  let updatedCount = 0;

  for (const line of dataLines) {
    const cols = line.split(",").map((s) => s.trim());
    if (cols.length < 10) {
      console.warn(`[Skip] Invalid column count (${cols.length}): "${line}"`);
      continue;
    }

    const [_loc, rawType, rawXp, rawReq, rawId, rawMapLevel, rawX1, rawZ1, rawX2, rawZ2] = cols;

    const entityId = parseInt(rawId, 10);
    if (isNaN(entityId)) {
      console.warn(`[Skip] Invalid entity ID: "${rawId}" in line: "${line}"`);
      continue;
    }

    const xpReward = parseInt(rawXp, 10) || 0;
    const levelReq = parseInt(rawReq, 10) || 0;
    const normMapLevel = (rawMapLevel || "").toLowerCase();
    const lvl = MAP_LEVELS[normMapLevel] !== undefined ? MAP_LEVELS[normMapLevel] : 1;

    const normType = (rawType || "").toLowerCase();
    const targetAction = ACTION_MAP[normType] || "climb_same_map_level";

    const x1 = parseInt(rawX1, 10);
    const y1 = parseInt(rawZ1, 10); // z in 3D world maps to y in 2D tile coordinates
    const x2 = parseInt(rawX2, 10);
    const y2 = parseInt(rawZ2, 10);

    const requirements =
      levelReq > 0
        ? [
            {
              desc: `Requires Athletics level ${levelReq}`,
              type: "skill",
              skill: "athletics",
              level: levelReq,
              operator: ">="
            }
          ]
        : null;

    const obstacleAction = {
      type: "athleticsObstacle",
      location1: { x: x1, y: y1, lvl },
      location2: { x: x2, y: y2, lvl }
    };

    if (normType === "bridge jump") {
      obstacleAction.actionValue = 4;
    }

    if (xpReward > 0) {
      obstacleAction.xpReward = xpReward;
    }

    if (indexMap.has(entityId)) {
      // Update existing entity configuration
      const existingConfig = actionConfigs[indexMap.get(entityId)];
      let existingAction = existingConfig.onActions?.find(
        (a) => a.targetAction.toLowerCase() === targetAction.toLowerCase()
      );

      if (existingAction) {
        existingAction.requirements = requirements;
        if (!existingAction.playerEventActions) {
          existingAction.playerEventActions = [obstacleAction];
        } else {
          const existingObstacle = existingAction.playerEventActions.find(
            (ea) => ea.type === "athleticsObstacle"
          );
          if (existingObstacle) {
            existingObstacle.location1 = obstacleAction.location1;
            existingObstacle.location2 = obstacleAction.location2;
            if (obstacleAction.actionValue !== undefined) {
              existingObstacle.actionValue = obstacleAction.actionValue;
            }
            if (xpReward > 0) {
              existingObstacle.xpReward = xpReward;
            }
          } else {
            existingAction.playerEventActions.push(obstacleAction);
          }
        }
      } else {
        if (!existingConfig.onActions) {
          existingConfig.onActions = [];
        }
        existingConfig.onActions.push({
          targetAction,
          requirements,
          playerEventActions: [obstacleAction]
        });
      }

      updatedCount++;
    } else {
      // Insert new entity configuration
      const newConfig = {
        worldEntityTypeId: entityId,
        onActions: [
          {
            targetAction,
            requirements,
            playerEventActions: [obstacleAction]
          }
        ]
      };

      actionConfigs.push(newConfig);
      indexMap.set(entityId, actionConfigs.length - 1);
      addedCount++;
    }
  }

  // Write back formatted JSON with 4 spaces indent
  fs.writeFileSync(carbonPath, JSON.stringify(actionConfigs, null, 4) + "\n", "utf-8");

  console.log(
    `[Done] Successfully imported shortcuts into ${carbonPath}: ${addedCount} added, ${updatedCount} updated, ${actionConfigs.length} total entities.`
  );

  return { added: addedCount, updated: updatedCount, total: actionConfigs.length };
}

// Built-in shortcut dataset provided by the user
const DEFAULT_CSV = `
location,type,xp,level req,id,map level,x1,z1,x2,z2
south of anglham castle,rock wall,10,15,12648,overworld,77,-242,77,-245
north of goblin tower,fence gap,5,15,12650,overworld,24,-290,24,-291
south of percy's mansion,fence gap,5,15,12653,overworld,-17,-329,-17,-328
north of sato's dojo,rock wall,10,25,12654,overworld,-58,-357,-58,-361
northwest of summerton,rock wall,10,35,12659,overworld,-203,-283,-200,-283
east of nature obby,fence gap,5,24,12657,overworld,-167,-214,-166,-214
cave on way to king gobbo,fence gap,5,62,12738,underworld,-207,-286,-208,-286
middlefern graveyard,fence gap,5,10,12647,overworld,68,-81,68,-80
celadon city entrance to cela highlands,fence gap,5,20,13596,overworld,376,6,375,6
cela highlands wooden skellies,bridge jump,20,20,13484,overworld,337,194,337,186
cela highlands wooden skellies,rock wall,10,20,13461,overworld,343,207,346,207
cela highlands broken to green drags,broken wall,15,30,13333,overworld,440,241,440,242
cela mountains up to black drags,rock wall,10,30,13447,overworld,349,289,349,292
cela mountains next to black drags,rock wall,10,65,13459,overworld,374,305,374,308
swamp course to rage obby,rock wall,10,35,12523,overworld,201,-150,201,-146
elf land lower level,rock wall,10,35,12663,overworld,263,165,263,168
elf land upper level,rock wall,10,35,12664,overworld,276,248,273,248
energy obby,rock wall,10,40,12681,overworld,-13,464,-10,464
under seashell shores bank to fire obby,rock wall,10,47,12735,underworld,-63,414,-63,411
ictirine city mesa to golden lake,rock wall,10,53,12685,overworld,20,241,17,241
ictirine city mesa to golden lake,rock wall,10,53,12686,overworld,24,240,21,240
ictirine city mesa to golden lake,rock wall,10,53,12687,overworld,25,241,25,244
fury obby cave,log,10,30,12661,underworld,-258,-159,-258,-170
highcove to pirates,rock wall,10,35,12658,overworld,-291,-300,-288,-300
`.trim();

// CLI Execution
if (require.main === module) {
  const args = process.argv.slice(2);
  let csvContent = DEFAULT_CSV;
  let carbonPath = DEFAULT_CARBON_PATH;

  const fileArg = args.find((a) => !a.startsWith("--"));
  if (fileArg) {
    if (fs.existsSync(fileArg)) {
      csvContent = fs.readFileSync(fileArg, "utf-8");
      console.log(`[Input] Reading CSV from file: ${fileArg}`);
    } else {
      console.error(`[Error] File not found: ${fileArg}`);
      process.exit(1);
    }
  } else {
    console.log("[Input] Using default shortcut dataset (24 shortcuts).");
  }

  const carbonArg = args.find((a) => a.startsWith("--carbon="));
  if (carbonArg) {
    carbonPath = path.resolve(carbonArg.split("=")[1]);
  }

  const noBackup = args.includes("--no-backup");

  importShortcuts(csvContent, carbonPath, { backup: !noBackup });
}

module.exports = { importShortcuts, DEFAULT_CSV, DEFAULT_CARBON_PATH };
