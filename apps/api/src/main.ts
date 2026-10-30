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

  // Configure CORS for frontend development origin
  const allowedOrigins = (
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000"
  )
    .split(",")
    .map((origin) => origin.trim());

  app.enableCors({
    origin: allowedOrigins,
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
  await app.listen(port);
}
bootstrap();
