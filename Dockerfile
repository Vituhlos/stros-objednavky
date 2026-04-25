# ── Build stage ───────────────────────────────────────────────
FROM node:24-bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends fonts-dejavu-core && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runtime stage (minimální image) ───────────────────────────
FROM node:24-bookworm-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends fonts-dejavu-core && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Standalone output + statické assety + public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

VOLUME ["/app/data"]

EXPOSE 3000

CMD ["node", "server.js"]
