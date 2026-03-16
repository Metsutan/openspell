# Docker Deployment Notes

## Service inventory (runtime requirements)

### api
- Entrypoint: `node apps/api/api-server.js`
- Port: `API_PORT` (default 3002); container listens on `PORT` if provided
- Env (required in prod):
  - `DATABASE_URL`
  - `API_JWT_SECRET` or `JWT_SECRET`
  - `API_WEB_SECRET`
  - `GAME_SERVER_SECRET`
  - `WORLD_REGISTRATION_SECRET`
  - `HISCORES_UPDATE_SECRET`
  - `WEB_URL`, `API_URL`
- Depends on: Postgres, Redis (rate-limiter)

### web
- Entrypoint: `node apps/web/web-server.js`
- Port: `WEB_PORT` (default 8887); container listens on `PORT` if provided
- Env (required in prod):
  - `WEB_SESSION_SECRET` or `SESSION_SECRET`
  - `API_URL`, `WEB_URL`, `CDN_URL`, `CHAT_URL`, `CLIENT_API_URL`
  - `ASSET_SET` (default `base`)
  - `ASSETS_ROOT` (optional, defaults to shared-assets path)
- Depends on: api (for page data)

### game
- Entrypoint: `node apps/game/dist/index.js`
- Port: `GAME_PORT` (default 8888); container listens on `PORT` if provided
- Env (required in prod):
  - `DATABASE_URL`
  - `JWT_SECRET` (game client auth)
  - `API_URL`, `HISCORES_UPDATE_SECRET`
  - `SERVER_ID`, `TICK_MS`
  - `STATIC_ASSETS_PATH` (or rely on default shared-assets path)
- Depends on: api, Postgres, Redis

### chat
- Port: `CHAT_PORT` (default 8765); container listens on `PORT` if provided
- Env (required in prod):
  - `DATABASE_URL`
  - `CHAT_JWT_SECRET`
  - `USE_HTTPS`, `SSL_CERT_PATH`, `SSL_KEY_PATH`
- Depends on: Postgres

## Shared assets
- Expected at `apps/shared-assets` in container.
- `apps/shared-assets/base/shared.env` provides shared configuration.
- `apps/shared-assets/base/static` provides `.carbon` game data files.

## Compose env files
- Local Template: `config/docker.env`
- Production Template: `config/docker.env.prod`
- The `setup-env` script will copy the appropriate template to `.env` in the root directory and inject secrets. Edit these templates to change configurations before deployment.

## Environment initialization
- Docker: `docker compose --profile init run --rm env-init`
- Windows: `.\setup-env.ps1 -Mode dev -WriteDockerEnv`
- Linux/macOS: `./setup-env.sh dev --write-docker-env`

## Migrations
- Run once after deploy: `docker compose --profile migrate run --rm migrate`
- Uses the `migrate` target from the api image to run Prisma migrations.

## Build / push / deploy
- Build images: `./scripts/docker-build.ps1` (Windows) or `./scripts/docker-build.sh`
- Push images: `./scripts/docker-push.ps1` (Windows) or `./scripts/docker-push.sh`
- Deploy to Ubuntu: `./scripts/docker-deploy.ps1 -Host user@server` or `./scripts/docker-deploy.sh user@server`
- Set `REGISTRY` and `IMAGE_TAG` to control tagging.

## Cloudflare Tunnel mapping
- Example `config.yml` on Ubuntu (Cloudflared):
  - `https://your-domain.com` -> `http://localhost:8887` (web)
  - `https://api.your-domain.com` -> `http://localhost:3002` (api)
  - `https://game.your-domain.com` -> `http://localhost:8888` (game websocket/http)
  - `https://chat.your-domain.com` -> `http://localhost:8765` (chat websocket/http)
- Ensure `API_URL`, `WEB_URL`, `CDN_URL`, `CHAT_URL`, `CLIENT_API_URL` match these hostnames.

## Ops hardening
- Log rotation: Docker json-file logs are capped to 10MB x 5 files per service.
- Postgres backups:
  - Windows: `./scripts/backup-postgres.ps1`
  - Linux: `./scripts/backup-postgres.sh`
- Game packet traces: back up `./data/game-logs` on the host.

## SQLite log storage (game only)
- Packet audit trace files are stored under `PACKET_TRACE_PATH`.
- Default path in container: `/app/apps/game/logs/packets`
- Recommended host volume: `./data/game-logs:/data/game-logs`
- Set `PACKET_TRACE_PATH=/data/game-logs/packets` to persist across restarts.

