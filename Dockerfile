# Use the same base image in both stages for consistency
FROM node:18-alpine AS base

# Install dependencies
RUN apk add --no-cache libc6-compat

# Use a separate stage for the build process
FROM base AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy and install dependencies
COPY pnpm-lock.yaml package.json ./
# RUN pnpm fetch

# Copy application code and install dependencies offline
COPY . .
RUN pnpm install


# Build the application
RUN pnpm run build

# Final stage: Create the production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy built application and dependencies from the builder stage
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml ./

# Expose port 3000
EXPOSE 3000

# Use non-root user for better security
RUN addgroup -S nuxtgroup && adduser -S nuxtuser -G nuxtgroup
USER nuxtuser

# Define the command to run the application
CMD ["node", ".output/server/index.mjs"]
