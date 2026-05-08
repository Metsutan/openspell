FROM node:22-slim AS deps
WORKDIR /app
RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV CI=true
ENV DATABASE_URL=postgresql://openspell:openspell@postgres:5432/openspell?schema=public

COPY . .
RUN pnpm install --frozen-lockfile

FROM deps AS migrate
WORKDIR /app
# Run migrations only - seeding is done separately via: docker compose run --rm api node packages/db/prisma/seed.js
CMD ["sh", "-c", "node scripts/validate-env.js migrate && pnpm -C packages/db prisma:migrate"]

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app /app

EXPOSE 3002
CMD ["sh", "-c", "node scripts/validate-env.js api && node apps/api/api-server.js"]
