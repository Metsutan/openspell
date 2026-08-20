FROM node:22-slim AS deps
WORKDIR /app
RUN corepack enable
ENV CI=true
ENV NPM_CONFIG_MINIMUM_RELEASE_AGE=0
ENV DATABASE_URL=postgresql://openspell:openspell@postgres:5432/openspell?schema=public

COPY . .
RUN pnpm install --frozen-lockfile

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app /app

EXPOSE 8887
CMD ["sh", "-c", "node scripts/validate-env.js web && node apps/web/web-server.js"]
