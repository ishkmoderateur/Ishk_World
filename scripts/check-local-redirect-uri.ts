#!/usr/bin/env tsx
/**
 * Check what redirect URI will be used in local development
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
const nodeEnv = process.env.NODE_ENV;

console.log("🔍 Local Development Redirect URI Check\n");
console.log("=".repeat(70));

// Simulate the getBaseUrl logic from the route
const getBaseUrl = () => {
  const isDevelopment = nodeEnv !== 'production';
  let baseUrl = nextAuthUrl;
  
  // If NEXTAUTH_URL is set to production URL but we're in development, ignore it
  if (isDevelopment && baseUrl && baseUrl.includes('ishk-world.com')) {
    console.log("⚠️  Development mode: Will ignore production NEXTAUTH_URL");
    baseUrl = undefined;
  }
  
  // Simulate request from localhost:3000
  if (!baseUrl) {
    const host = "localhost:3000"; // Default Next.js dev server
    const protocol = "http";
    baseUrl = `${protocol}://${host}`;
  }
  
  baseUrl = baseUrl.replace(/\/$/, '');
  
  // Don't force HTTPS in development
  if (nodeEnv === 'production' && baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'https://');
  }
  
  if (baseUrl.includes('www.ishk-world.com')) {
    baseUrl = baseUrl.replace('www.ishk-world.com', 'ishk-world.com');
  }
  
  return baseUrl;
};

const baseUrl = getBaseUrl();
const redirectUri = `${baseUrl}/api/auth/google/callback`;

console.log("\n📋 Environment:");
console.log("-".repeat(70));
console.log(`NODE_ENV: ${nodeEnv || "development"}`);
console.log(`NEXTAUTH_URL: ${nextAuthUrl || "NOT SET"}`);

console.log("\n🔗 Calculated Redirect URI:");
console.log("-".repeat(70));
console.log(`Base URL: ${baseUrl}`);
console.log(`Redirect URI: ${redirectUri}`);

console.log("\n📝 This EXACT URI must be in Google Cloud Console:");
console.log("-".repeat(70));
console.log(`   ${redirectUri}`);

console.log("\n✅ Check Google Cloud Console:");
console.log("-".repeat(70));
console.log("1. Go to: https://console.cloud.google.com/apis/credentials");
console.log("2. Click on your OAuth Client ID");
console.log("3. Scroll to 'Authorized redirect URIs'");
console.log("4. Make sure this URI is listed:");
console.log(`   ${redirectUri}`);
console.log("\n5. If not listed, click '+ Add URI' and add it");
console.log("6. Click 'Save'");
console.log("7. Wait 2-3 minutes for changes to propagate");

console.log("\n" + "=".repeat(70));





