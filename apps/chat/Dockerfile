FROM node:22-slim AS deps
WORKDIR /app
RUN corepack enable
ENV CI=true
ENV NPM_CONFIG_MINIMUM_RELEASE_AGE=0
ENV DATABASE_URL=postgresql://openspell:openspell@postgres:5432/openspell?schema=public

COPY . .
# postinstall generates protocol files before build
RUN pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm -C apps/chat build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app /app
COPY --from=build /app/apps/chat/dist /app/apps/chat/dist

EXPOSE 8765
CMD ["sh", "-c", "node scripts/validate-env.js chat && node apps/chat/dist/index.js"]
