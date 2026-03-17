# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm config set store-dir .pnpm-store && \
    pnpm config set frozen-lockfile false && \
    pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the application - set API URL at build time
ENV CI=true
ENV VITE_API_URL=/api
ENV BUILD_MODE=prod
RUN pnpm build:prod

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
