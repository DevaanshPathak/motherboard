FROM oven/bun:1.3.11-alpine AS base

WORKDIR /app

COPY package.json bun.lock turbo.json tsconfig.base.json tsconfig.json ./
COPY apps/web ./apps/web
COPY packages/ui ./packages/ui

RUN bun install --frozen-lockfile

FROM base AS builder

WORKDIR /app/apps/web

RUN bun run build

FROM oven/bun:1.3.11-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/bun.lock ./bun.lock
COPY --from=base /app/apps/web ./apps/web
COPY --from=base /app/packages/ui ./packages/ui
COPY --from=builder /app/apps/web/.next ./apps/web/.next

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["bun", "run", "start"]
