import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import express from "express";
import type { Express, Request, Response } from "express";
import { AppModule } from "./app.module";

// Validate mandatory environment variables in production
if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_ACCESS_SECRET && !process.env.JWT_SECRET) {
    throw new Error("FATAL: JWT_ACCESS_SECRET is required in production");
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("FATAL: JWT_REFRESH_SECRET is required in production");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("FATAL: DATABASE_URL is required in production");
  }
}

let cachedExpressApp: Express | null = null;

export async function createNestServer(): Promise<Express> {
  if (cachedExpressApp) {
    return cachedExpressApp;
  }

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableShutdownHooks();
  app.use(cookieParser());

  // Apply documented /api/v1 prefix
  app.setGlobalPrefix("api/v1");

  // Configure CORS for frontend development and production origins
  const configuredOrigins = (
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    ""
  )
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const allowedOrigins = [
    ...configuredOrigins,
    "http://localhost:3000",
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : ["https://ai-career-agent-web.vercel.app"]),
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  cachedExpressApp = server;
  return server;
}

// Default export for Vercel Serverless Function invocations
export default async function handler(req: Request, res: Response) {
  const server = await createNestServer();
  return server(req, res);
}

// Standalone execution for local development and containerized environments
async function bootstrap() {
  const server = await createNestServer();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  server.listen(port, () => {
    console.log(`NestJS server listening on http://localhost:${port}/api/v1`);
  });
}

if (!process.env.VERCEL) {
  bootstrap();
}
