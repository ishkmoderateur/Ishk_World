/**
 * Environment variable validation and typing
 * This ensures all required environment variables are present and properly typed
 */

// Validate required environment variables at build/runtime
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value || "";
}

// NextAuth configuration
export const env = {
  // NextAuth
  NEXTAUTH_SECRET: getEnvVar("NEXTAUTH_SECRET", process.env.NODE_ENV === "development" ? "development-secret-change-in-production" : undefined),
  NEXTAUTH_URL: getEnvVar("NEXTAUTH_URL", process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined),
  
  // Database
  DATABASE_URL: getEnvVar("DATABASE_URL", "file:./prisma/dev.db"),
  
  // OAuth Providers (optional)
  GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID", ""),
  GOOGLE_CLIENT_SECRET: getEnvVar("GOOGLE_CLIENT_SECRET", ""),
  
  // Payment Processing (optional)
  STRIPE_SECRET_KEY: getEnvVar("STRIPE_SECRET_KEY", ""),
  STRIPE_WEBHOOK_SECRET: getEnvVar("STRIPE_WEBHOOK_SECRET", ""),
  
  // Email Service (optional)
  RESEND_API_KEY: getEnvVar("RESEND_API_KEY", ""),
  ADMIN_EMAIL: getEnvVar("ADMIN_EMAIL", ""),
  
  // Translation Service (optional)
  GOOGLE_TRANSLATE_API_KEY: getEnvVar("GOOGLE_TRANSLATE_API_KEY", ""),
  
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// Type-safe environment variable access
export type Env = typeof env;





