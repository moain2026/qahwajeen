# qahwajeen.com — container image for Spaceship Hyperlift (or any Docker host)
# Stage 1: bundle the Hono app into one file
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY tsconfig.json ./
COPY src ./src
RUN npm run build:node

# Stage 2: tiny runtime — bundled server + static assets only
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    STATIC_ROOT=./public
COPY --from=build /app/dist-node/server.mjs ./server.mjs
COPY public ./public
USER node
# Hyperlift injects PORT (default 8080) — do not EXPOSE a fixed port
CMD ["node", "server.mjs"]
