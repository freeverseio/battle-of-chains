# Stage 1
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base as deps
WORKDIR /app

# Install required packages for building native dependencies
RUN apk add --no-cache libc6-compat g++ make python3
COPY package.json package-lock.json* ./
RUN npm ci

# Build the project
FROM base as builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh
COPY .env.template .env.production

# Export environment variables from .env.template into the build context
RUN export $(grep -v '^#' .env.template | xargs) && \
    npm run build

# Production stage
FROM base AS runner
WORKDIR /app
RUN apk update && apk add --no-cache gettext grep bash

ENV NODE_ENV=production

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy the built application and other necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/types ./.next/types
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Remove the production environment template and adjust ownership
RUN rm .env.production && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Set the port environment variable
ENV PORT 3000

# Define the entry point script
ENTRYPOINT ["./entrypoint.sh"]
