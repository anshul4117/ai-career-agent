
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

FROM node:20-alpine

WORKDIR /app

EXPOSE 3000

COPY --from=builder /app/package.json /app/package.json

COPY --from=builder /app/package-lock.json /app/package-lock.json

COPY --from=builder /app/apps/web/package.json /app/apps/web/package.json

COPY --from=builder /app/apps/web/public /app/apps/web/public
# output of builder stage 
COPY --from=builder /app/apps/web/.next /app/apps/web/.next

RUN npm ci --omit=dev

CMD ["npm","run","start","--workspace=@ai-career-agent/web"]