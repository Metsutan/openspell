FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV CI=true
ENV NPM_CONFIG_MINIMUM_RELEASE_AGE=0
ENV DATABASE_URL=postgresql://openspell:openspell@postgres:5432/openspell?schema=public

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune openspell-web --docker

FROM base AS deps
WORKDIR /app

# First install dependencies (fully cached unless package manifests change)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --no-frozen-lockfile

# Copy pruned source files
COPY --from=builder /app/out/full/ .
COPY scripts/validate-env.js ./scripts/validate-env.js

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app /app

EXPOSE 8887
CMD ["sh", "-c", "node scripts/validate-env.js web && node apps/web/web-server.js"]
