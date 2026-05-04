FROM node:20-slim AS deps
WORKDIR /app
RUN corepack enable
ENV CI=true
ENV DATABASE_URL=postgresql://openspell:openspell@postgres:5432/openspell?schema=public

COPY . .
# postinstall generates protocol files before build
RUN pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm -C apps/game build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app /app
COPY --from=build /app/apps/game/dist /app/apps/game/dist

EXPOSE 8888
CMD ["sh", "-c", "node scripts/validate-env.js game && exec node apps/game/dist/index.js"]
