const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const args = process.argv.slice(2);
const modeArg = args.find((arg) => arg.startsWith("--mode="));
const mode = (modeArg ? modeArg.split("=")[1] : "dev").toLowerCase();
const force = args.includes("--force");

const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env");
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



const loadExistingSecrets = () => {
  if (!fs.existsSync(envPath)) {
    return;
  }
  const data = fs.readFileSync(envPath, "utf8");
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

  for (const [key, value] of Object.entries(defaults)) {
    template = template.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }

  for (const [key, value] of Object.entries(secrets)) {
    template = template.replace(new RegExp(`^${key}=change-me`, "m"), `${key}=${value}`);
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

loadExistingSecrets();

if (fs.existsSync(envPath) && !force) {
  console.log(`[env] .env already exists at ${envPath}`);
  updateEnvFile(envPath, secrets);
  console.log(`[env] updated secrets in .env`);
} else {
  const content = renderTemplate();
  fs.writeFileSync(envPath, content);
  console.log(`[env] wrote .env (${mode}) to ${envPath}`);
}
