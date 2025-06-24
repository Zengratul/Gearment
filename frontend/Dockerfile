# syntax=docker/dockerfile:1.7

# ---- Builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using cache mount (works for both first and subsequent builds)
RUN --mount=type=cache,target=/pnpm-store \
    pnpm config set store-dir /pnpm-store && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . ./

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://gearment-be.minhviet.xyz/api}
ENV NODE_ENV=${NODE_ENV}

# Build the application
RUN pnpm build

# ---- Runtime stage (standalone) ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy standalone output with proper ownership (no chown -R needed)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy start script if it exists (using conditional copy)
RUN --mount=from=builder,source=/app,target=/builder-app \
    if [ -f /builder-app/start.sh ]; then \
        cp /builder-app/start.sh ./start.sh && \
        chown nextjs:nodejs ./start.sh && \
        chmod +x ./start.sh; \
    else \
        echo "No start.sh found, using default"; \
    fi

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Use start script if available, otherwise default server.js
CMD [ -f start.sh ] && exec ./start.sh || exec node server.js