const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SECRET_KEYS = [
  "API_WEB_SECRET",
  "GAME_SERVER_SECRET",
  "API_JWT_SECRET",
  "API_SESSION_SECRET",
  "WORLD_REGISTRATION_SECRET",
  "HISCORES_UPDATE_SECRET",
  "WEB_SESSION_SECRET",
  "GAME_JWT_SECRET",
];

const args = process.argv.slice(2);
const all = args.includes("--all");
const dryRun = args.includes("--dry-run");
const noBackup = args.includes("--no-backup");
const help = args.includes("--help") || args.includes("-h");
const envArg = args.find((arg) => arg.startsWith("--env="));

const defaultEnvPath = path.join(
  __dirname,
  "..",
  "apps",
  "shared-assets",
  "base",
  "shared.env",
);
const envPath = envArg ? path.resolve(envArg.split("=")[1]) : defaultEnvPath;

if (help) {
  console.log(
    [
      "Usage: node scripts/update-shared-secrets.js [options]",
      "",
      "Options:",
      "  --all         Rotate all secret values, not just change-me/empty values",
      "  --dry-run     Show which keys would be updated, but do not write",
      "  --no-backup   Skip creating a .bak timestamped backup before writing",
      "  --env=<path>  Use a custom env file path",
      "  -h, --help    Show this help message",
    ].join("\n"),
  );
  process.exit(0);
}

if (!fs.existsSync(envPath)) {
  console.error(`[secrets] Env file not found: ${envPath}`);
  process.exit(1);
}

const makeSecret = () => crypto.randomBytes(32).toString("hex");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const shouldReplaceValue = (value) => {
  const normalized = value.replace(/^['"]|['"]$/g, "").trim().toLowerCase();
  return normalized.length === 0 || normalized === "change-me";
};

const original = fs.readFileSync(envPath, "utf8");
let updated = original;
const changedKeys = [];

for (const key of SECRET_KEYS) {
  const linePattern = new RegExp(`^(${escapeRegExp(key)}=)(.*)$`, "m");
  const match = updated.match(linePattern);
  if (!match) {
    continue;
  }

  const currentValue = match[2].trim();
  if (!all && !shouldReplaceValue(currentValue)) {
    continue;
  }

  updated = updated.replace(linePattern, `${key}=${makeSecret()}`);
  changedKeys.push(key);
}

if (changedKeys.length === 0) {
  console.log("[secrets] No secret values needed updating.");
  process.exit(0);
}

if (dryRun) {
  console.log(
    `[secrets] Dry run complete. Would update ${changedKeys.length} key(s): ${changedKeys.join(", ")}`,
  );
  process.exit(0);
}

if (!noBackup) {
  const backupPath = `${envPath}.${Date.now()}.bak`;
  fs.writeFileSync(backupPath, original);
  console.log(`[secrets] Backup created: ${backupPath}`);
}

fs.writeFileSync(envPath, updated);
console.log(
  `[secrets] Updated ${changedKeys.length} key(s) in ${envPath}: ${changedKeys.join(", ")}`,
);
