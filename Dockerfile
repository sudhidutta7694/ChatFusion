# Build stage
FROM node:alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage  
FROM node:alpine AS production
WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Generate Prisma client for production
RUN npx prisma generate

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]
