FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable
ENV CI=true
ENV NPM_CONFIG_MINIMUM_RELEASE_AGE=0
ENV DATABASE_URL=postgresql://openspell:openspell@postgres:5432/openspell?schema=public

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune openspell-api --docker

FROM base AS deps
WORKDIR /app

# Install dependencies (cached unless manifests change)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --no-frozen-lockfile

# Copy full pruned source code
COPY --from=builder /app/out/full/ .
COPY scripts/validate-env.js ./scripts/validate-env.js

FROM deps AS migrate
WORKDIR /app
# Run migrations only - seeding is done separately via: docker compose run --rm api node packages/db/prisma/seed.js
CMD ["sh", "-c", "node scripts/validate-env.js migrate && pnpm -C packages/db prisma:migrate"]

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app /app

EXPOSE 3002
CMD ["sh", "-c", "node scripts/validate-env.js api && node apps/api/api-server.js"]
