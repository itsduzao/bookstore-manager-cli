# syntax=docker/dockerfile:1

# ---------- deps ----------
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- build ----------
FROM deps AS build
COPY . .
RUN npm run build

# ---------- runtime ----------
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node

CMD ["node", "dist/main.js"]
