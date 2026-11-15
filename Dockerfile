# Base Bun image. Pinned to match "packageManager" in package.json — a bare
# `oven/bun:1` floats to whatever Bun ships next on every build.
FROM oven/bun:1.4.4 AS base
WORKDIR /app

# Resolve editor submodule (handles uninitialized submodule in CI)
FROM base AS editor
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
COPY .gitmodules ./
COPY scripts/resolve-submodules.sh ./scripts/
RUN --mount=type=bind,source=.git,target=/tmp/.git \
    --mount=type=secret,id=env,target=/tmp/.env \
    chmod +x scripts/resolve-submodules.sh && \
    sh scripts/resolve-submodules.sh

# Dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY --from=editor /app/src/app/editor/package.json src/app/editor/
RUN bun install --frozen-lockfile

# Build
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY --from=editor /app/src/app/editor/ src/app/editor/
# Ensure editor workspace deps are installed (handles stale cache from pre-editor builds)
RUN bun install --frozen-lockfile

# CI: Docker secret provides .env; Local: .env.local already copied via COPY . .
# DOCKER_BUILD enables standalone output in next.config.js
RUN --mount=type=secret,id=env \
  sh -c 'if [ -f /run/secrets/env ]; then \
    echo "Using environment from Docker secret"; \
    cp /run/secrets/env .env; \
  else \
    echo "Using .env.local from build context"; \
  fi && \
  DOCKER_BUILD=true bun run generate && bun run build:skip-lint'

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
# DIAGNOSTIC (revert after leak test): cap glibc malloc arenas. MEMMON shows
# idle off-heap RSS ratcheting (heapUsed/external flat); this tests whether it's
# glibc arena fragmentation. No effect if the runtime allocator isn't glibc.
ENV MALLOC_ARENA_MAX=2

RUN groupadd --system --gid 1001 nodejs && \
  useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Private browser source maps, read only by /api/obs (moved out of .next/static at build)
COPY --from=builder /app/.next/obs-sourcemaps ./.next/obs-sourcemaps

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 4344
CMD ["node", "server.js"]
