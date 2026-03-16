const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const args = process.argv.slice(2);
const modeArg = args.find((arg) => arg.startsWith("--mode="));
const mode = (modeArg ? modeArg.split("=")[1] : "dev").toLowerCase();
const force = args.includes("--force");
const writeDockerEnv = args.includes("--write-docker-env");

const rootDir = process.cwd();
const sharedEnvPath = path.join(rootDir, "apps", "shared-assets", "base", "shared.env");
const sharedEnvDir = path.dirname(sharedEnvPath);
const templatePath = path.join(rootDir, "config", "shared.env.template");

if (!fs.existsSync(templatePath)) {
  console.error(`[env] Missing template: ${templatePath}`);
  process.exit(1);
}

const makeSecret = () => crypto.randomBytes(32).toString("hex");

// Mode defaults:
// - "dev": Running services directly on host machine (no Docker)
// - "docker": Local Docker development (uses Docker service names for internal, localhost for browser)
// - "prod": Production deployment (uses external domain URLs)
const modeDefaults = {
  prod: {
    DATABASE_URL: "postgresql://openspell:openspell@postgres:5432/openspell?schema=public",
    NODE_ENV: "production",
    USE_HTTPS: "false",
    USING_REVERSE_PROXY: "true",
    SSL_CERT_PATH: "/app/certs/localhost.pem",
    SSL_KEY_PATH: "/app/certs/localhost-key.pem",
    API_URL: "https://api.your-domain.com",
    WEB_URL: "https://your-domain.com",
    CHAT_URL: "https://chat.your-domain.com",
    CDN_URL: "https://your-domain.com",
    CLIENT_API_URL: "https://api.your-domain.com",
    ALLOW_INSECURE_HTTPS: "false",
    REDIS_HOST: "redis",
    REDIS_PORT: "6379",
    REDIS_PASSWORD: "openspell",
    REDIS_DISABLED: "false"
  },
  docker: {
    // Docker local dev: services talk to each other via Docker network names,
    // but browser accesses via localhost (port-mapped)
    DATABASE_URL: "postgresql://openspell:openspell@postgres:5432/openspell?schema=public",
    NODE_ENV: "production",
    USE_HTTPS: "false",
    USING_REVERSE_PROXY: "false",
    SSL_CERT_PATH: "/app/certs/localhost.pem",
    SSL_KEY_PATH: "/app/certs/localhost-key.pem",
    API_URL: "http://api:3002",           // Container-to-container (web/game → api)
    WEB_URL: "http://localhost:8887",     // Browser access
    CHAT_URL: "http://localhost:8765",    // Browser access
    CDN_URL: "http://localhost:8887",     // Browser access
    CLIENT_API_URL: "http://localhost:3002", // Browser → API (via port mapping)
    ALLOW_INSECURE_HTTPS: "false",
    REDIS_HOST: "redis",
    REDIS_PORT: "6379",
    REDIS_PASSWORD: "openspell",
    REDIS_DISABLED: "false"
  },
  dev: {
    // Host dev: everything runs directly on localhost
    DATABASE_URL: "postgresql://openspell:openspell@localhost:5432/openspell?schema=public",
    NODE_ENV: "development",
    USE_HTTPS: "false",
    USING_REVERSE_PROXY: "false",
    SSL_CERT_PATH: "../../certs/localhost.pem",
    SSL_KEY_PATH: "../../certs/localhost-key.pem",
    API_URL: "http://localhost:3002",
    WEB_URL: "http://localhost:8887",
    CHAT_URL: "http://localhost:8765",
    CDN_URL: "http://localhost:8887",
    CLIENT_API_URL: "http://localhost:3002",
    ALLOW_INSECURE_HTTPS: "false",
    REDIS_HOST: "localhost",
    REDIS_PORT: "6379",
    REDIS_PASSWORD: "",
    REDIS_DISABLED: "true"
  }
};

const defaults = modeDefaults[mode] || modeDefaults.dev;

const secrets = {
  API_WEB_SECRET: makeSecret(),
  GAME_SERVER_SECRET: makeSecret(),
  API_JWT_SECRET: makeSecret(),
  API_SESSION_SECRET: makeSecret(),
  WORLD_REGISTRATION_SECRET: makeSecret(),
  HISCORES_UPDATE_SECRET: makeSecret(),
  WEB_SESSION_SECRET: makeSecret(),
  GAME_JWT_SECRET: makeSecret(),
  CHAT_JWT_SECRET: makeSecret()
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const loadExistingSecrets = () => {
  if (!fs.existsSync(sharedEnvPath)) {
    return;
  }
  const data = fs.readFileSync(sharedEnvPath, "utf8");
  for (const key of Object.keys(secrets)) {
    const match = data.match(new RegExp(`^${key}=(.+)$`, "m"));
    if (!match || !match[1]) continue;
    const value = match[1].replace(/"/g, "").trim();
    if (!value) continue;
    if (value.toLowerCase() === "change-me") continue;
    secrets[key] = value;
  }
};

const renderTemplate = () => {
  let template = fs.readFileSync(templatePath, "utf8");
  const replacements = { ...defaults, ...secrets };
  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return template;
};

const updateEnvFile = (envPath, updates) => {
  if (!fs.existsSync(envPath)) {
    return;
  }
  let content = fs.readFileSync(envPath, "utf8");
  for (const [key, value] of Object.entries(updates)) {
    if (content.match(new RegExp(`^${key}=`, "m"))) {
      content = content.replace(new RegExp(`^${key}=.*$`, "m"), `${key}=${value}`);
    }
  }
  fs.writeFileSync(envPath, content);
};

ensureDir(sharedEnvDir);
loadExistingSecrets();

if (fs.existsSync(sharedEnvPath) && !force) {
  console.log(`[env] shared.env already exists at ${sharedEnvPath}`);
} else {
  const content = renderTemplate();
  fs.writeFileSync(sharedEnvPath, content);
  console.log(`[env] wrote shared.env (${mode}) to ${sharedEnvPath}`);
}

if (writeDockerEnv) {
  const dockerEnvPath = mode === "prod"
    ? path.join(rootDir, "config", "docker.env.prod")
    : path.join(rootDir, "config", "docker.env");
  updateEnvFile(dockerEnvPath, {
    API_WEB_SECRET: secrets.API_WEB_SECRET,
    GAME_SERVER_SECRET: secrets.GAME_SERVER_SECRET,
    API_JWT_SECRET: secrets.API_JWT_SECRET,
    WEB_SESSION_SECRET: secrets.WEB_SESSION_SECRET,
    GAME_JWT_SECRET: secrets.GAME_JWT_SECRET,
    CHAT_JWT_SECRET: secrets.CHAT_JWT_SECRET,
    WORLD_REGISTRATION_SECRET: secrets.WORLD_REGISTRATION_SECRET,
    HISCORES_UPDATE_SECRET: secrets.HISCORES_UPDATE_SECRET
  });
  console.log(`[env] updated secrets in ${dockerEnvPath}`);
}
