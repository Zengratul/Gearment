# syntax=docker/dockerfile:1.7

########################
# build: install + build Nest
########################
FROM node:20-alpine AS build
WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# Enable build scripts for native modules (bcrypt, etc)
RUN pnpm config set enable-pre-post-scripts true

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using cache mount (works for both first and subsequent builds)
RUN --mount=type=cache,target=/pnpm-store \
    pnpm config set store-dir /pnpm-store && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . ./

# Build the NestJS application
RUN pnpm build

# Prune to production dependencies only
RUN pnpm prune --prod

########################
# runtime: minimal production image
########################
FROM node:20-alpine AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built application and production dependencies with proper ownership
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/package.json ./

USER nestjs

EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

# Start the application using node directly (faster than pnpm)
CMD ["node", "dist/main.js"]