/**
 * Environment Configuration
 * Centralized configuration management for all environment variables
 */

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || "sqlite:./dev.db",
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || "7d") as string,
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

// Validate required env vars
const requiredEnvVars = ["JWT_SECRET"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] && env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
