# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Create app user to avoid running as root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

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

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://gearment-be.minhviet.xyz/api}

# Build the application for production
RUN pnpm run build

# Copy standalone directory to a new location
RUN cp -r .next/standalone ./
RUN cp -r .next/static ./.next/standalone/.next/
RUN cp -r public ./.next/standalone/

# Copy start script to standalone directory
COPY start.sh ./.next/standalone/
RUN chmod +x ./.next/standalone/start.sh

# Change ownership of the app directory to the nodejs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Change to standalone directory
WORKDIR /app/.next/standalone

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the application using the start script
CMD ["./start.sh"] 