import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

// Validate mandatory environment variables in production
if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_ACCESS_SECRET && !process.env.JWT_SECRET) {
    throw new Error("FATAL: JWT_ACCESS_SECRET is required in production");
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("FATAL: JWT_REFRESH_SECRET is required in production");
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.use(cookieParser());

  // Apply documented /api/v1 prefix
  app.setGlobalPrefix("api/v1");

  // Configure CORS with dynamic origin matching for Vercel, localhost, and custom domains
  const configuredOrigins = (
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000"
  )
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // 1. Allow non-browser requests (no origin header, e.g. curl, health checks, SSR)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");

      // 2. Allow configured origins or wildcard
      if (
        configuredOrigins.includes(normalizedOrigin) ||
        configuredOrigins.includes("*")
      ) {
        return callback(null, true);
      }

      // 3. Automatically allow all Vercel deployment origins (*.vercel.app)
      if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(normalizedOrigin)) {
        return callback(null, true);
      }

      // 4. Automatically allow local development origins (localhost & 127.0.0.1 on any port)
      if (
        /^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // Origin not permitted
      callback(null, false);
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

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port, "0.0.0.0");
}
bootstrap();
