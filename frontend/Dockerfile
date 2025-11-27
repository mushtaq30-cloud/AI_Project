FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml* ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm ci --only=production --silent
EXPOSE 3000
CMD ["npm", "start"]
