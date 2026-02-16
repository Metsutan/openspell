# OpenSpell

A browser-based MMORPG with a TypeScript game server, Express API, and SSR web frontend. Uses Socket.IO for real-time game communication and PostgreSQL for persistence.


## Foreword

This is very rough, it's maybe 70% complete but there's a lot still missing. I don't have the time or, candidly, the interest to dedicate myself exclusively to this project and I'd love it if the community took over. It's roughly playable in a sense but it needs many commits and even some architectural re-design to truly be scalable. For example the web server and api server are both just javascript files instead of typescript. This is almost a proof of concept more than a serious attempt at a robust replacement. However, as it is ~200-500 players would most likely be fine.

This repository comes with many of the assets *except* the client. To get the client you'll need to gather it yourself from the official website and place it in the `apps\shared-assets\base\js\client` path. This can be done with f12 and the Network tab of Chrome Developer tools. Just look for a `client.61.js` file and copy that. You might need to also look at the `assetsClient` while you're there if the client number has changed.

If you don't trust any of the assets, there is a list of assets you'll need in the `apps\shared-assets\ASSETS.md`. You are on your own acquiring them, but it's not complicated.

This repository is provided as is, but I've put a lot of effort into making it as easy as possible to set up to try/play locally. 

This project is open-source partly in an attempt to let it stand on its own rather than rely on any persons reputation, I encourage you to review it before using it. This was made with a lot of time and money in an attempt to solve problems the current game has. If you don't trust this project, don't use it. I understand there'll be a lot of design flaws, coding best practices missed, and tech-debt. But if you notice a problem, please update and make a pull request.

My ultimate goal is for someone to pick up the reigns, improve, and host a better version of this.

If you're interested in trying this: The docker containers should be easier to run locally.

If you're interest in developing this: Run this locally with debugging following the `launch.json` vscode configurations. Install docker to run postgres and hook it to the applications in the .env file.

If you're interest in production: It's not suited for production in its current state but it was being developed with the ultimate goal to do so. There's info further in on how it was being planned.

Please always remember to take backups, download, and keep a hold of anything provided to you online that you want to keep. Clone this repository, fork it for yourself, make sure it's available if the repository is ever removed.

## What's Missing

### Entity Actions (from `Actions.ts` enum)

**Not Implemented (stubs only):**
| Action | Notes |
|--------|-------|
| `Picklock` | ✅ Tentatively implemented |
| `Unlock` | ✅ Tentatively implemented |
| `Search` | ✅ Tentatively implemented |
| `SleepIn` | Shows "not yet implemented" message |
| `Follow` | Pathfinding works, execute is empty TODO |
| `TradeWith` | Pathfinding works, execute is empty TODO |
| `Moderate` | Pathfinding works, execute is empty TODO |
| `AddEntity` | Admin tool - not implemented |
| `EditEntity` | Admin tool - not implemented |

**Actions requiring world entity overrides (code exists, need data entries):**
- `Climb`, `Enter`, `Exit`, `Touch`, `WalkAcross`, `SwingOn`, `JumpOver`, `ClimbOver`, `SqueezeThrough`, `JumpTo`, `JumpIn`, `JumpOn`, `LeapFrom`, `WalkAlong`
- These are mapped but require `worldentityactions.carbon` entries per-entity. Without an updated .carbon file this will require A LOT of manual effort.

### Client Actions (no handler registered)

| ClientActionType | Notes |
|------------------|-------|
| `CaptchaAction` | Protocol exists, no server handler |
| `ChangeAppearance` | Protocol exists, no server handler |
| `UpdateTradeStatus` | Protocol exists, no server handler |

### Inventory Item Actions

| Action | Notes |
|--------|-------|
| `eat` | ✅ Tentatively implemented |
| `drink` | ✅ Tentatively implemented |
| `open` (item) | TODO - opening containers |
| `offer` | TODO - Trading |
| `revoke` | TODO - Trading |
| `create` | TODO |
| `rub` | TODO |
| `dropx` | TODO - drop specific quantity |
| `look_at` | TODO - clue scrolls |
| `dig` | TODO - clue scrolls |
| `discard` | TODO - clue scrolls|
| `blow` | TODO |

### Admin/Moderator Commands

| Command | Status |
|---------|--------|
| `/bank` | Not implemented |
| `/mute` | Not implemented |
| `/ban` | Not implemented |
| `/kick` | Not implemented |

### Major Systems

| System | Notes |
|--------|-------|
| **Trading** | Protocol exists (`UpdateTradeStatus`), no handlers |
| **Following** | Movement works, execute logic empty |
| **Friends List** | Not implemented - Requires chat server |
| **Player Moderation UI** | Moderate action is stub |
| **Captcha/Anti-bot** | Protocol exists, no implementation |
| **Appearance Customization** | Protocol exists, no handler |
| **Quest Event Triggers** | Service exists, not wired to conversations |
| **NPC Item Rewards** | Infrastructure exists, not wired |

### Combat System

- Temporary stat buffs from potions (partially done - boosted levels exist but consumption doesn't apply them)
Future additions with placeholders
- Prayer bonuses
- Gear set effect bonuses
- Target-specific gear bonuses (e.g., dragon weapons vs dragons)

### Other TODOs in Code

| Item | Location |
|------|----------|
| Health regeneration | `GameServer.ts` tick loop |
| Treasure map item ID | `MonsterDropService.ts` |
| Teleport spell coordinates | `handleCastTeleportSpell.ts` |

---

## Local Development (VS Code)

Best for rapid iteration with hot reload, debugging, and breakpoints. Runs services directly on your machine without Docker.

### Prerequisites

1. **Node.js 18+** and **pnpm** installed
2. **PostgreSQL** running locally (or use Docker just for the database)

**Quick database with Docker Desktop (Windows)** (if you don't have PostgreSQL installed):
1. Install Docker Desktop for Windows and open it (wait for "Engine running").
2. Run this in PowerShell:
```powershell
docker run -d --name openspell -p 5432:5432 -e POSTGRES_USER=openspell -e POSTGRES_PASSWORD=openspell -e POSTGRES_DB=openspell postgres:16-alpine
```
If you already created the container, start it with:
```powershell
docker start openspell-postgres
```
3. **VS Code** with the workspace open

### Initial Setup

```powershell
# 1. Install dependencies
pnpm install

# 2. Generate protocol files (required for game server)
pnpm run protocol:generate

# 3. Generate shared.env from template
#    - dev = run services on your host (DATABASE_URL uses localhost)
#    - docker = run services with docker compose (DATABASE_URL uses postgres)
node scripts/setup-env.js --mode=dev

# 4. Edit apps/shared-assets/base/shared.env with your database URL
#    Host dev example:    DATABASE_URL=postgresql://openspell:openspell@localhost:5432/openspell?schema=public
#    Docker compose:      DATABASE_URL=postgresql://openspell:openspell@postgres:5432/openspell?schema=public

# 5. Run database migrations (make sure DATABASE_URL points to localhost)
cd packages/db
pnpm prisma:migrate:dev

# 6. Seed initial data (optional - creates admin user and World 1) (while inside of \packages\db)
pnpm prisma:seed
```



### Running with VS Code Debugger

The project includes pre-configured launch configurations in `launch.json`. Add it to your .vscode or use as reference.

**Recommended: Launch all servers at once**
1. Open the Run and Debug panel (`Ctrl+Shift+D`)
2. Select **"Debug All Servers"** from the dropdown
3. Press `F5` or click the green play button
4. All three servers start with debugging enabled

**Available launch configurations:**

| Configuration | Description |
|--------------|-------------|
| `Debug All Servers` | Launches Web + API + Game (HTTP) |
| `Debug All Servers (HTTPS)` | Launches all with HTTPS enabled |
| `Debug Web Server` | Web server only (port 8887) |
| `Debug API Server` | API server only (port 3002) |
| `Debug Game Server` | Game server only (port 8888) |
| `Debug Web + API` | Website without game server |
| `Debug API + Game` | Backend without website |

**HTTPS variants** require certificates in `certs/`. Run `setup-https.ps1` or `setup-https.sh` to generate them with mkcert. No guarantee they actually work, I never used the HTTPS launches.

### Running from Terminal (Alternative)

If you prefer terminals over the VS Code debugger:

```powershell
# Terminal 1: Web Server
cd apps/web
node web-server.js

# Terminal 2: API Server
cd apps/api
node api-server.js

# Terminal 3: Game Server (TypeScript)
cd apps/game
pnpm dev
```

Or use the package.json scripts from the root:
```powershell
pnpm -C apps/web dev    # Web server with nodemon
pnpm -C apps/api dev    # API server with nodemon
pnpm -C apps/game dev   # Game server with ts-node
```

### Development Workflow

1. **Make code changes** - Restart servers as needed
2. **Set breakpoints** in VS Code - Debugger pauses execution
3. **Check browser** at `http://localhost:8887`
4. **View logs** in the integrated terminal panels

### Environment Configuration

All services load from `apps/shared-assets/base/shared.env`. Key variables for development:

```env
DATABASE_URL=postgresql://openspell:openspell@localhost:5432/openspell
USE_HTTPS=false
NODE_ENV=development

# Service ports (defaults)
WEB_PORT=8887
API_PORT=3002
GAME_PORT=8888
```

See `ENV-VARIABLES-REFERENCE.md` for the complete list.

---

## Docker Quickstart (recommended for easy setup)

### Prerequisites
1. Install Docker Desktop (Windows/macOS) or Docker Engine (Linux).

### Local, single-player setup (Docker)
This is the simplest, lowest-security setup. Email verification, CAPTCHA, Redis, and heavy logging are **off** by default.

1. Clone the repo and open a terminal in the repo root.
2. Generate env files + secrets:
   - PowerShell: `$env:ENV_MODE="docker"; docker compose --env-file config/docker.env --profile init run --rm env-init`
   - Bash/Zsh: `ENV_MODE=docker docker compose --env-file config/docker.env --profile init run --rm env-init`
3. Build and start the stack:
   - `docker compose --env-file config/docker.env up -d --build`
4. Run database migrations (creates tables):
   - `docker compose --env-file config/docker.env --profile migrate run --rm migrate`
5. Seed initial data (worlds, skills, admin user):
   - `docker compose --env-file config/docker.env run --rm api node packages/db/prisma/seed.js`
   - **Important:** Skip this step if you want a clean database or are upgrading an existing install
6. Verify containers are running: `docker compose ps`
7. Open the site: `http://localhost:8887`
8. Click "Play" and select "World 1" to enter the game

**Default admin account** (created by seed):
Please change this or delete it from the database for any serious use. This is here for your convenience.
- Username: `admin`
- Password: `admin123`

Protocol files are generated automatically during `pnpm install` in the Docker build, so no manual step is needed.
Note: Docker Compose only uses shell or `.env` values for interpolation, so these commands pass `--env-file config/docker.env` explicitly.

### Fresh clone checklist (Docker-only)
- Clone repo
- PowerShell: `$env:ENV_MODE="docker"; docker compose --env-file config/docker.env --profile init run --rm env-init`
- Bash/Zsh: `ENV_MODE=docker docker compose --env-file config/docker.env --profile init run --rm env-init`
- `docker compose --env-file config/docker.env up -d --build`
- `docker compose --env-file config/docker.env --profile migrate run --rm migrate` (creates tables)
- `docker compose --env-file config/docker.env run --rm api node packages/db/prisma/seed.js` (seeds data)
- Go to http://localhost:8887, click Play, select World 1
- Login with `admin` / `admin123` or create a new account

If something fails:
- Check logs: `docker compose --env-file config/docker.env logs -f api` or `docker compose --env-file config/docker.env logs -f game`
- Re-run migrations: `docker compose --env-file config/docker.env --profile migrate run --rm migrate`
- If you see `Cannot find module 'dotenv'` during Docker build, ensure the root dependency is installed (it is listed in `package.json`).
- On Windows PowerShell, set env vars with `$env:NAME="value"` (not `NAME=value`).
- To reset everything: `docker compose --env-file config/docker.env down -v` (removes volumes), then start from step 2.

**Verify database was seeded:**
If worlds don't appear on the /play page or the admin login doesn't work, the seed likely didn't run.
```bash
# Check if worlds exist
docker exec openspell-postgres psql -U openspell -d openspell -c "SELECT COUNT(*) FROM worlds;"

# If count is 0, run the seed manually:
docker compose --env-file config/docker.env run --rm api node packages/db/prisma/seed.js
```

### Rebuilding containers after code changes

**Important:** Docker containers have a copy of your code from when they were built. If you edit source files, the running containers still have the OLD code. You must rebuild the container to see your changes.

#### Quick reference

| What you changed | Rebuild command |
|------------------|-----------------|
| `apps/web/*` (website) | `docker compose --env-file config/docker.env up -d --build web` |
| `apps/api/*` (API server) | `docker compose --env-file config/docker.env up -d --build api` |
| `apps/game/*` (game server) | `docker compose --env-file config/docker.env up -d --build game` |
| Multiple services | `docker compose --env-file config/docker.env up -d --build` |
| Database schema (`packages/db/prisma/*`) | See "Database changes" below |

#### Step-by-step: Rebuild a single service

Example: You edited `apps/web/web-server.js`

```powershell
# PowerShell / Bash - rebuild and restart the web container
docker compose --env-file config/docker.env up -d --build web
```

This command:
1. Rebuilds the `web` Docker image with your new code
2. Stops the old container
3. Starts a new container with the updated image
4. Runs in detached mode (`-d`) so you get your terminal back

#### Rebuild all services at once

If you changed files in multiple apps, rebuild everything:

```powershell
docker compose --env-file config/docker.env up -d --build
```

#### Database changes (schema/migrations/seed)

If you changed `packages/db/prisma/schema.prisma` or `seed.js`:

```powershell
# 1. Rebuild api and game (they include the Prisma client)
docker compose --env-file config/docker.env up -d --build api game

# 2. Run migrations (creates/updates tables)
docker compose --env-file config/docker.env --profile migrate run --rm migrate

# 3. Run seed (optional - only if you want to reset initial data)
docker compose --env-file config/docker.env run --rm api node packages/db/prisma/seed.js
```

#### Force a clean rebuild (if something seems stuck)

If your changes still aren't showing up, force a rebuild without Docker's cache:

```powershell
# Rebuild without cache (slower, but guarantees fresh build)
docker compose --env-file config/docker.env build --no-cache web
docker compose --env-file config/docker.env up -d web
```

#### Nuclear option: Reset everything

If all else fails, tear it all down and start fresh:

```powershell
# Stop and remove all containers + volumes (WARNING: deletes database data!)
docker compose --env-file config/docker.env down -v

# Rebuild and start everything from scratch
docker compose --env-file config/docker.env up -d --build

# Re-run migrations (creates tables)
docker compose --env-file config/docker.env --profile migrate run --rm migrate

# Re-run seed (populates initial data)
docker compose --env-file config/docker.env run --rm api node packages/db/prisma/seed.js
```

#### View logs to debug issues

```powershell
# Follow logs for a specific service
docker compose --env-file config/docker.env logs -f web
docker compose --env-file config/docker.env logs -f api
docker compose --env-file config/docker.env logs -f game

# View last 100 lines of all services
docker compose --env-file config/docker.env logs --tail 100
```

### Production/Dev (Ubuntu + Cloudflare Tunnel)
Choose one deployment style:

#### Option A — Image-based deploy (recommended for production deployments)
Build images locally, push to a registry, and pull on the server.

1. **On your dev machine: build and push images**
   - Build: `./scripts/docker-build.ps1` (Windows) or `./scripts/docker-build.sh`  
     _Builds Docker images for api/web/game from this repo._
   - Push: `./scripts/docker-push.ps1` (Windows) or `./scripts/docker-push.sh`  
     _Pushes those images to the registry in `REGISTRY` (e.g., GHCR or Docker Hub)._
   - Optional tags: `IMAGE_TAG=2026-01-20 REGISTRY=ghcr.io/openspell ./scripts/docker-build.sh`
2. **On the server: clone the repo once**
   - `git clone <your-repo-url> /opt/openspell`
   - `cd /opt/openspell`
   - _Why clone if we pull images?_ The repo provides `docker-compose.yml`, env templates, and scripts. You only need it once; updates are optional unless compose/config changes.
3. **Configure production env**
   - Edit `config/docker.env.prod`:
     - Set domain URLs (`API_URL`, `WEB_URL`, `CDN_URL`, `CLIENT_API_URL`, `CHAT_URL`)
     - Replace secrets (`API_WEB_SECRET`, `GAME_SERVER_SECRET`, `API_JWT_SECRET`, etc.)
4. **Generate/refresh `shared.env`**
   - `ENV_MODE=prod docker compose --profile init run --rm env-init`
5. **Start services from images**
   - `REGISTRY=ghcr.io/openspell IMAGE_TAG=2026-01-20 docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
6. **Run database migrations**
   - `docker compose --profile migrate run --rm migrate`
7. **Seed initial data** (first-time setup only)
   - `docker compose run --rm api node packages/db/prisma/seed.js`
8. **Configure Cloudflare Tunnel**
   - `your-domain.com` -> `http://localhost:8887`
   - `api.your-domain.com` -> `http://localhost:3002`
   - `game.your-domain.com` -> `http://localhost:8888`
9. **Verify**
   - `docker compose ps`
   - Visit `https://your-domain.com`

#### Option B — Build on the server (recommended for individual use)
You update the repo on the server and build images there.

1. **Clone or update the repo**
   - First time: `git clone <your-repo-url> /opt/openspell`
   - Updates: `git pull` in `/opt/openspell`
2. **Generate/refresh `shared.env`**
   - `ENV_MODE=prod docker compose --profile init run --rm env-init`
3. **Build and start services**
   - `docker compose up -d --build`
4. **Run database migrations**
   - `docker compose --profile migrate run --rm migrate`
5. **Seed initial data** (first-time setup only)
   - `docker compose run --rm api node packages/db/prisma/seed.js`
6. **Configure Cloudflare Tunnel**
   - `your-domain.com` -> `http://localhost:8887`
   - `api.your-domain.com` -> `http://localhost:3002`
   - `game.your-domain.com` -> `http://localhost:8888`
7. **Verify**
   - `docker compose ps`
   - Visit `https://your-domain.com`

#### Updating an existing deployment
- Image-based: `docker compose -f docker-compose.yml -f docker-compose.prod.yml pull && docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
- Build-on-server: `git pull && docker compose up -d --build`

---

## Quick Reference Table

| Service | Entry Point | Default Port | Transport | Primary Role |
|---------|-------------|--------------|-----------|--------------|
| **Web** | `apps/web/web-server.js` | 8887 | HTTP(S) | SSR website, session management, game page delivery |
| **API** | `apps/api/api-server.js` | 3002 | HTTP(S) | Source of truth: auth, worlds, hiscores, game tokens |
| **Game** | `apps/game/src/index.ts` | 8888 | Socket.IO | Real-time game logic, player state, combat, movement |
| **Chat** | `apps/chat/` | 8765 | (planned) | Not implemented |

---

## Repository Structure

```
OpenSpell/
├── apps/
│   ├── api/                    # Express API server (source of truth)
│   │   ├── api-server.js       # ← ENTRYPOINT
│   │   ├── prisma/             # Database schema & migrations
│   │   └── services/           # Email service
│   │
│   ├── web/                    # Express SSR website
│   │   ├── web-server.js       # ← ENTRYPOINT
│   │   ├── routes/             # auth.js, account.js, news.js
│   │   ├── services/           # api.js, html.js, auth.js, csrf.js
│   │   └── middleware/         # rateLimit.js
│   │
│   ├── game/                   # TypeScript game server (Socket.IO)
│   │   ├── src/
│   │   │   ├── index.ts        # ← ENTRYPOINT
│   │   │   ├── server/         # GameServer, services, systems, actions
│   │   │   ├── protocol/       # Packet encoders/decoders, enums
│   │   │   └── world/          # World model, catalogs, pathfinding
│   │   └── dist/               # Generated build output
│   │
│   ├── shared-assets/          # Static assets shared across services
│   │   ├── base/               # Default asset set
│   │   ├── custom/             # Example custom asset set
│   │   └── ASSETS.md           # Asset inventory (replace with your own)
│
├── packages/                   # Shared internal packages
│   ├── db/                     # @openspell/db - Prisma client wrapper
│   │   └── prisma/schema.prisma  # ← CANONICAL DATABASE SCHEMA
│   └── rate-limiter/           # @openspell/rate-limiter - Redis/memory limiter
│
├── certs/                      # Local HTTPS certificates (mkcert)
├── config/                     # Docker env presets (edit locally)
│   ├── docker.env              # Local docker config
│   └── docker.env.prod         # Production docker config
├── setup-env.ps1               # Environment setup script
├── setup-env.sh                # Environment setup (Linux/macOS)
├── setup-https.ps1             # HTTPS certificate generation
├── docker-compose.yml          # Container orchestration
└── ARCHITECTURE.md             # Detailed service map
```

---

## Generated Files

- Protocol action enums/codecs in `apps/game/src/protocol/fields/actions/` and
  `apps/game/src/protocol/packets/actions/` are generated from
  `apps/game/gameActionFactory.js`.
  - Regenerate from repo root:
    `pnpm run protocol:generate`
- Client bundles are expected at:
  - `apps/shared-assets/<asset-set>/js/client/client.<version>.js`
  The `<version>` comes from `apps/shared-assets/<asset-set>/assetsClient.json`.
  The base asset set does not include these bundles; supply your own assets as needed.

---

## Decision Tree: Where to Find/Modify Code

```
What are you trying to do?
│
├─► User authentication (login/register/password)?
│   └─► apps/api/api-server.js → search "AUTH" section
│       Routes: /api/auth/login, /api/auth/register, /api/auth/me
│
├─► Database schema changes?
│   └─► packages/db/prisma/schema.prisma
│       Then run: pnpm --filter @openspell/db prisma migrate dev
│
├─► Game server logic (combat, movement, skills)?
│   └─► apps/game/src/server/
│       ├── systems/           # Tick-based systems (Combat, Movement, Death, etc.)
│       ├── services/          # Request-based services (Inventory, Equipment, etc.)
│       └── actions/           # Client action handlers
│
├─► Network protocol (packets, events)?
│   └─► apps/game/src/protocol/
│       ├── enums/GameAction.ts      # Socket.IO event IDs (server→client)
│       ├── enums/ClientActionType.ts # Client command types
│       └── packets/actions/         # Packet builders/decoders
│
├─► Website pages (UI, forms)?
│   └─► apps/web/
│       ├── routes/            # Express route handlers
│       ├── services/html.js   # Page generation
│       └── dist/              # Served HTML files
│
├─► Player persistence (save/load)?
│   └─► apps/game/src/server/services/
│       ├── PlayerPersistenceManager.ts  # Autosave, shutdown save
│       ├── StateLoaderService.ts        # Load NPCs, items, world entities
│       └── LoginService.ts              # Player login/state initialization
│
├─► Hiscores/leaderboards?
│   └─► apps/api/api-server.js → search "HISCORES" section
│       Endpoints: /api/hiscores/:skill, /api/hiscores/player/:name
│
├─► World/server selection?
│   └─► apps/api/api-server.js → search "WORLDS" section
│       Endpoints: /api/worlds, /api/worlds/register, /api/worlds/heartbeat
│
└─► Environment variables?
    └─► See: ENV-VARIABLES-REFERENCE.md
        config/docker.env + apps/shared-assets/base/shared.env
```

---

## Service Communication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 BROWSER                                     │
│                                                                             │
│  1. Website Access (SSR)                                                    │
│     GET /, /play, /login, /account, /hiscores                               │
│     ┌──────────────────────────────────────────────────────────────────┐    │
│     │ apps/web (Port 8887)                                             │    │
│     │ - Sessions/cookies for website auth                              │    │
│     │ - Serves static assets: /css, /js, /images, /static              │    │
│     │ - Generates /game HTML with runtime config                       │    │
│     └───────────────┬──────────────────────────────────────────────────┘    │
│                     │ Internal fetch (Node → Node)                          │
│                     ▼                                                       │
│     ┌──────────────────────────────────────────────────────────────────┐    │
│     │ apps/api (Port 3002)                                             │    │
│     │ - PostgreSQL via Prisma (source of truth)                        │    │
│     │ - JWT authentication                                             │    │
│     │ - World registry (game server heartbeats)                        │    │
│     │ - /getLoginToken → game login flow                               │    │
│     └──────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  2. Game Runtime (after /game page loads)                                   │
│     - API calls direct to apps/api                                          │
│     - Socket.IO to apps/game                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Game Client Login Flow:
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1. Browser loads /game HTML                                                  │
│ 2. Client reads hidden inputs: #api-url, #server-url, #server-id-input       │
│ 3. POST /getLoginToken → apps/api (username, password, serverId, version)    │
│ 4. API returns { token } on success                                          │
│ 5. Client opens Socket.IO to #server-url (apps/game)                         │
│ 6. Game server emits CanLogin (event "81")                                   │
│ 7. Client emits Login (event "13") with token                                │
│ 8. Game server validates, emits LoggedIn (event "15")                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Key Models)

> Full schema: `packages/db/prisma/schema.prisma`

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `User` | Player account | `id`, `username`, `displayName`, `email`, `password`, `isAdmin`, `bannedUntil` |
| `Session` | Website JWT sessions | `userId`, `token`, `expiresAt` |
| `OnlineUser` | Live presence tracking | `userId`, `serverId`, `lastSeen` |
| `World` | Game server registry | `serverId`, `name`, `serverUrl`, `lastHeartbeat`, `isActive` |
| `GameLoginToken` | Short-lived game auth tokens | `token`, `userId`, `serverId`, `expiresAt` |
| `PlayerSkill` | Per-skill XP/level/rank | `userId`, `skillId`, `level`, `experience`, `rank` |
| `PlayerLocation` | Logout position | `userId`, `mapLevel`, `x`, `y` |
| `PlayerEquipment` | Equipped items by slot | `userId`, `slot`, `itemDefId`, `amount` |
| `PlayerInventory` | 28-slot inventory | `userId`, `slot`, `itemId`, `amount`, `isIOU` |
| `PlayerBank` | 500-slot bank (JSON array) | `userId`, `items` |
| `PlayerAbility` | HP/stamina current values | `userId`, `values` |
| `PlayerSetting` | Client settings | `userId`, `data` |
| `PlayerStateSnapshot` | Full state JSON (optional) | `userId`, `state` |
| `Skill` | Skill definitions | `slug`, `title`, `iconPosition`, `displayOrder` |
| `News` | News articles | `slug`, `title`, `content`, `date` |

---

## Game Server Architecture (`apps/game/src/`)

### Core Classes

```
GameServer (server/GameServer.ts)
├── Lifecycle: start(), stop(), runServerTick()
├── Networking: Socket.IO events, packet queueing
├── State Maps:
│   ├── playerStatesByUserId: Map<userId, PlayerState>
│   ├── npcStates: Map<npcId, NPCState>
│   ├── groundItemStates: Map<itemId, GroundItemState>
│   └── worldEntityStates: Map<entityId, WorldEntityState>
└── Dependency Injection for systems/services
```

### Systems (Tick-Based, in `server/systems/`)

| System | Purpose | Tick Order |
|--------|---------|------------|
| `DeathSystem` | Process dying entities, respawns | 1 |
| `DelaySystem` | Timed actions (stun, pickpocket) | 2 |
| `AggroSystem` | NPC aggro detection | 3 |
| `PathfindingSystem` | Compute paths for players/NPCs | 4-5 |
| `MovementSystem` | Execute movement steps | 6-7 |
| `CombatSystem` | Process attacks (player then NPC) | 8-9 |
| `WoodcuttingSystem` | Skilling tick processing | 10 |
| `EnvironmentSystem` | Time-of-day, weather | 11 |
| `AbilitySystem` | Regenerate HP/stamina | 12 |
| `ShopSystem` | Restock shop items | 13 |
| `VisibilitySystem` | Send entity enter/exit chunks | Always |

### Services (Request-Based, in `server/services/`)

| Service | Purpose |
|---------|---------|
| `LoginService` | Handle player login, state initialization |
| `ConnectionService` | Socket connect/disconnect |
| `InventoryService` | Add/remove/move inventory items |
| `EquipmentService` | Equip/unequip items |
| `BankingService` | Bank operations |
| `ExperienceService` | Award XP, level up |
| `DamageService` | Calculate and apply damage |
| `TargetingService` | Player/NPC target management |
| `TeleportService` | Teleport players |
| `MessageService` | Send chat/server messages |
| `ConversationService` | NPC dialogue trees |
| `PickpocketService` | Thieving mechanics |
| `WoodcuttingService` | Woodcutting mechanics |
| `PlayerPersistenceManager` | Autosave, shutdown save |

### Action Handlers (in `server/actions/`)

Client actions are dispatched via `dispatchClientAction()`:

| Action | Handler | Purpose |
|--------|---------|---------|
| `SendMovementPath` | `handleMovementPath.ts` | Player movement request |
| `PerformActionOnEntity` | `handlePerformActionOnEntity.ts` | Interact with entity |
| `InvokeInventoryItemAction` | `handleInvokeInventoryItemAction.ts` | Use/drop/equip item |
| `ReorganizeInventorySlots` | `handleReorganizeInventorySlots.ts` | Swap/move items |
| `PublicMessage` | `handlePublicMessage.ts` | Chat message |
| `CastTeleportSpell` | `handleCastTeleportSpell.ts` | Teleport spell |
| `SelectNPCConversationOption` | `handleRespondToNPCConversation.ts` | Dialogue choice |
| `Logout` | `handleLogout.ts` | Player logout |

---

## Protocol Reference (`apps/game/src/protocol/`)

### Socket.IO Event Names

Events are emitted as **string numbers** (e.g., `"1"`, `"13"`, `"15"`).

```typescript
// Server → Client events (GameAction enum)
"0"  = GameStateUpdate   // Batched state updates
"15" = LoggedIn          // Login success
"81" = CanLogin          // Server ready for login

// Client → Server events
"1"  = ClientAction      // Wrapper for all client commands
"13" = Login             // Login request
```

### ClientAction Payload Structure

```typescript
// Client emits: socket.emit("1", [actionType, actionData])
// actionType = ClientActionType enum value
// actionData = action-specific payload

// Example: Move to position
socket.emit("1", [
  10,                    // ClientActionType.SendMovementPath
  [[x1, y1], [x2, y2]]   // Path waypoints
]);
```

### Key GameAction IDs

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 0 | `GameStateUpdate` | S→C | Batched updates |
| 1 | `ClientAction` | C→S | All client commands |
| 2 | `EntityMoveTo` | S→C | Entity movement |
| 8 | `ShowDamage` | S→C | Damage splat |
| 15 | `LoggedIn` | S→C | Login success |
| 18 | `LoggedOut` | S→C | Logout/disconnect |
| 32 | `StartedTargeting` | S→C | Combat started |
| 33 | `StoppedTargeting` | S→C | Combat ended |
| 44 | `TeleportTo` | S→C | Teleport entity |
| 45 | `PlayerDied` | S→C | Death event |
| 74 | `ServerInfoMessage` | S→C | System message |
| 81 | `CanLogin` | S→C | Server ready |

---

## World & Entity Data

### Catalogs (Loaded at Startup)

| Catalog | Source File | Purpose |
|---------|-------------|---------|
| `EntityCatalog` | `npcentitydefs.*.carbon`, `npcentities.*.carbon` | NPC definitions & spawns |
| `ItemCatalog` | `itemdefs.*.carbon`, `grounditems.*.carbon` | Item definitions & ground spawns |
| `WorldEntityCatalog` | `worldentitydefs.*.carbon`, `worldentities.*.carbon` | Trees, rocks, doors |
| `ConversationCatalog` | `npcconversationdefs.*.carbon` | NPC dialogue trees |
| `ShopCatalog` | `shopdefs.*.carbon` | Shop inventories |
| `WorldModel` | Map layer files | Pathfinding grids, collision |

### Entity Types

```typescript
enum EntityType {
  Player = 0,
  NPC = 1,
  Item = 2,
  WorldEntity = 3
}
```

---

## Environment Variables

> Full reference: `ENV-VARIABLES-REFERENCE.md`

### Critical Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | `config/docker.env` | PostgreSQL connection string |
| `API_WEB_SECRET` | `config/docker.env` | Web→API authentication |
| `GAME_SERVER_SECRET` | `config/docker.env` | Game→API authentication |
| `API_JWT_SECRET` | `config/docker.env` | JWT signing for API tokens |
| `WEB_SESSION_SECRET` | `config/docker.env` | Web session encryption |

### Service URLs (in `shared.env`)

| Variable | Default | Purpose |
|----------|---------|---------|
| `API_URL` | `http://localhost:3002` | API server (internal) |
| `WEB_URL` | `http://localhost:8887` | Web server |
| `CDN_URL` | `http://localhost:8887` | Static assets |
| `CLIENT_API_URL` | `http://localhost:3002` | API for game client |

`shared.env` is generated from `config/shared.env.template` by `scripts/setup-env.js`.
The Docker quickstart uses `docker compose --profile init run --rm env-init`,
which writes `apps/shared-assets/base/shared.env` and updates secrets in `config/docker.env`.

---

## Common Tasks

### Start Development Servers

```bash
# Terminal 1: API server
pnpm -C apps/api dev

# Terminal 2: Web server
pnpm -C apps/web dev

# Terminal 3: Game server
pnpm -C apps/game dev
```

### Database Migrations

```bash
# Generate migration from schema changes
cd packages/db
pnpm prisma migrate dev --name migration_name

# Apply migrations (production)
pnpm prisma migrate deploy

# View database
pnpm prisma studio
```

### Add a New Client Action Handler

1. Add action type to `protocol/enums/ClientActionType.ts` if new
2. Create decoder in `protocol/packets/actions/`
3. Create handler in `server/actions/`
4. Register in `server/actions/index.ts` dispatcher

### Add a New System

1. Create class in `server/systems/`
2. Initialize in `GameServer.ts` constructor
3. Call in `runServerTick()` at appropriate point

### Add a New Service

1. Create class in `server/services/`
2. Initialize in `GameServer.start()`
3. Inject into `ActionContext` if needed by handlers

---

## API Endpoints Summary

### Authentication (`/api/auth/`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | Web secret | Create account |
| POST | `/api/auth/login` | Web secret | Login, get JWT |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/auth/logout` | JWT | Invalidate session |
| POST | `/api/auth/change-password` | JWT | Change password |
| POST | `/api/auth/change-email` | JWT | Change email |
| POST | `/api/auth/forgot-password` | Public | Request reset |
| POST | `/api/auth/reset-password` | Token | Complete reset |

### Game Login (`/getLoginToken`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/getLoginToken` | Public | Get game session token |
| POST | `/api/game/consumeLoginToken` | Game secret | Validate token |

### Worlds (`/api/worlds/`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/worlds` | Web secret | List worlds |
| GET | `/api/worlds/:serverId` | Web secret | Get world details |
| POST | `/api/worlds/register` | World secret | Register/upsert world |
| POST | `/api/worlds/heartbeat` | Game secret | Update heartbeat |

### Hiscores (`/api/hiscores/`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/hiscores/skills` | Web secret | List skills |
| GET | `/api/hiscores/:skill` | Web secret | Leaderboard for skill |
| GET | `/api/hiscores/player/:name` | Web secret | Player stats |
| POST | `/api/hiscores/recompute` | Hiscores secret | Recalculate ranks |

---

## Debugging Tips

### Game Server

```typescript
// Enable verbose logging in GameServer.ts
console.log(`[tick ${this.tick}] Processing...`);

// Inspect player state
const player = this.playerStatesByUserId.get(userId);
console.log('Player state:', player);

// Track packet flow
console.log(`[packet] Sending ${GameAction[action]} to user ${userId}`);
```

### Protocol Issues

```typescript
// Log all incoming client actions
socket.on(GameAction.ClientAction.toString(), (payload) => {
  console.log('[ClientAction]', payload);
});
```

### Database Queries

```bash
# Enable Prisma query logging
DATABASE_URL="postgresql://...?schema=public" 
DEBUG="prisma:query" npm run dev
```

---

## File Quick Reference

### Most Frequently Modified Files

| Purpose | File |
|---------|------|
| Database schema | `packages/db/prisma/schema.prisma` |
| Game server core | `apps/game/src/server/GameServer.ts` |
| Player state | `apps/game/src/world/PlayerState.ts` |
| Combat logic | `apps/game/src/server/systems/CombatSystem.ts` |
| Movement logic | `apps/game/src/server/systems/MovementSystem.ts` |
| Inventory | `apps/game/src/server/services/InventoryService.ts` |
| Equipment | `apps/game/src/server/services/EquipmentService.ts` |
| API auth | `apps/api/api-server.js` (AUTH section) |
| Web routes | `apps/web/routes/*.js` |

### Configuration Files

| Purpose | File |
|---------|------|
| Docker env (local) | `config/docker.env` |
| Docker env (prod) | `config/docker.env.prod` |
| Shared config | `apps/shared-assets/base/shared.env` |
| Asset manifest | `apps/shared-assets/base/assetsClient.json` |
| Docker setup | `docker-compose.yml` |
| TypeScript | `apps/game/tsconfig.json` |

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `ARCHITECTURE.md` | Detailed service architecture |
| `ENV-VARIABLES-REFERENCE.md` | Complete environment variable reference |
| `apps/shared-assets/ASSETS.md` | Shared asset inventory |
