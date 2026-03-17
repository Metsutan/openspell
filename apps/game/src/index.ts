// Load environment variables from single shared config
import { config } from "dotenv";
import { join, resolve } from "path";

// In dev mode (ts-node), __dirname is src/
// In prod mode (node), __dirname is dist/
const sharedEnvPath = join(__dirname, "..", "..", "shared-assets", "base", "shared.env");

const result = config({ path: sharedEnvPath });
if (result.error) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[env] Failed to load shared.env from ${resolve(sharedEnvPath)}`);
    console.error(`[env] Make sure to run ./setup-env.ps1 first!`);
    process.exit(1);
  } else {
    console.warn(`[env] shared.env not found at ${resolve(sharedEnvPath)}, relying on external environment variables.`);
  }
}

console.log(`[env] Loaded shared.env from ${resolve(sharedEnvPath)}`);

// Verify critical environment variables
console.log(`[env] DATABASE_URL: ${process.env.DATABASE_URL ? '✓ Set' : '✗ Not set'}`);
console.log(`[env] API_URL: ${process.env.API_URL || 'Not set (will default to http://localhost:3002)'}`);
console.log(`[env] HISCORES_UPDATE_SECRET: ${process.env.HISCORES_UPDATE_SECRET ? '✓ Set' : '✗ Not set'}`);

import { GameServer } from "./server/GameServer";
import { disconnectDb } from "./db";

const USE_HTTPS = process.env.USE_HTTPS === "true";

const DEFAULT_PORT = 8888;
const requestedPortRaw = process.env.GAME_PORT ?? process.env.PORT;
const requestedPort = requestedPortRaw ? Number(requestedPortRaw) : DEFAULT_PORT;

const tickMsRaw = process.env.TICK_MS;
const tickMs = tickMsRaw ? Number(tickMsRaw) : 600;

const serverIdRaw = process.env.SERVER_ID;
const serverId = serverIdRaw ? Number(serverIdRaw) : 1;

const gameServer = new GameServer({
  port: requestedPort,
  useHttps: USE_HTTPS,
  tickMs,
  serverId
});

void gameServer
  .start()
  .then(() => {
    const proto = USE_HTTPS ? "https" : "http";
    console.log(`Game server ${serverId} listening on ${proto}://localhost:${requestedPort} (tickMs=${tickMs})`);
  })
  .catch((err: unknown) => {
    const e = err as NodeJS.ErrnoException;
    if (e?.code === "EADDRINUSE") {
      console.error(`Port ${requestedPort} is already in use.`);
      console.error(
        `To find the owning process on Windows PowerShell:\n` +
          `  Get-NetTCPConnection -LocalPort ${requestedPort} | Select -ExpandProperty OwningProcess | Get-Process\n`
      );
      console.error(`Or run on another port:\n  $env:PORT=8890; npm run dev\n`);
    } else {
      console.error("Server start error:", err);
    }
    process.exit(1);
  });
