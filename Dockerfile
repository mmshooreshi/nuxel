FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
# RUN pnpm fetch

COPY . .

RUN pnpm install && \
# RUN pnpm install -r --offline && \
    pnpm run build

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm 
    # addgroup -S nuxtgroup && \
    # adduser -S nuxtuser -G nuxtgroup

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml ./

# USER nuxtuser

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
