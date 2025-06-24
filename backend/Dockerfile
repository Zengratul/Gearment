# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Create app user to avoid running as root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm globally and clean any existing node_modules
RUN npm install -g pnpm
RUN rm -rf node_modules

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Change ownership of the app directory to the nodejs user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

# Start the application
CMD ["pnpm", "run", "start:prod"] 