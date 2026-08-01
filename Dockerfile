# Base Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application with environment variables for proper SSG
# Supports two modes:
# 1. Local: Uses .env.local if present (already copied with COPY . . above)
# 2. Jenkins/CI: Uses mounted secret from Docker secrets
# DOCKER_BUILD enables standalone output mode in next.config.js
RUN --mount=type=secret,id=env \
  sh -c 'if [ -f /run/secrets/env ]; then \
  echo "Using environment from Docker secret"; \
  cp /run/secrets/env .env && \
  DOCKER_BUILD=true bun run build:skip-lint; \
  else \
  echo "Using .env.local from build context"; \
  DOCKER_BUILD=true bun run build:skip-lint; \
  fi'

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs && \
  useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 4344
CMD ["node", "server.js"]
