#!/usr/bin/env tsx
/**
 * Quick check to verify .env was updated correctly
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

console.log("🔍 Checking .env Update\n");
console.log("=".repeat(70));

// Try to read .env file to show what's actually in it
try {
  const envContent = readFileSync(resolve(process.cwd(), ".env"), "utf-8");
  const googleClientIdLine = envContent.split("\n").find(line => line.startsWith("GOOGLE_CLIENT_ID"));
  const googleClientSecretLine = envContent.split("\n").find(line => line.startsWith("GOOGLE_CLIENT_SECRET"));
  
  console.log("\n📋 What's in your .env file:");
  console.log("-".repeat(70));
  if (googleClientIdLine) {
    const masked = googleClientIdLine.replace(/=(.+)/, (match, value) => {
      return `=${value.substring(0, 30)}...${value.substring(value.length - 20)}`;
    });
    console.log(`✓ ${masked}`);
  } else {
    console.log("❌ GOOGLE_CLIENT_ID not found in .env");
  }
  
  if (googleClientSecretLine) {
    const masked = googleClientSecretLine.replace(/=(.+)/, (match, value) => {
      return `=${value.substring(0, 15)}...${value.substring(value.length - 10)}`;
    });
    console.log(`✓ ${masked}`);
  } else {
    console.log("❌ GOOGLE_CLIENT_SECRET not found in .env");
  }
} catch (error) {
  console.log("⚠️  Could not read .env file (might be in .env.local)");
}

console.log("\n📋 Loaded Environment Variables:");
console.log("-".repeat(70));
console.log(`Client ID: ${clientId ? "✅ Set" : "❌ Missing"}`);
if (clientId) {
  console.log(`   ${clientId.substring(0, 40)}...${clientId.substring(clientId.length - 20)}`);
}
console.log(`Client Secret: ${clientSecret ? "✅ Set" : "❌ Missing"}`);
if (clientSecret) {
  console.log(`   ${clientSecret.substring(0, 15)}...${clientSecret.substring(clientSecret.length - 10)}`);
  console.log(`   Length: ${clientSecret.length} characters`);
}

// Check format
console.log("\n🔍 Format Check:");
console.log("-".repeat(70));
if (clientId) {
  if (clientId.endsWith('.apps.googleusercontent.com')) {
    console.log("✅ Client ID format: Correct");
  } else {
    console.log("❌ Client ID format: Incorrect (should end with .apps.googleusercontent.com)");
  }
} else {
  console.log("❌ Client ID: Not set");
}

if (clientSecret) {
  if (clientSecret.startsWith('GOCSPX-')) {
    console.log("✅ Client Secret format: Correct (starts with GOCSPX-)");
  } else {
    console.log("⚠️  Client Secret format: Doesn't start with GOCSPX- (might be older format)");
  }
  
  if (clientSecret.length >= 20) {
    console.log("✅ Client Secret length: Looks good");
  } else {
    console.log("⚠️  Client Secret length: Seems short");
  }
  
  // Check for spaces
  if (clientSecret.includes(' ')) {
    console.log("❌ ERROR: Client Secret contains spaces! Remove them.");
  }
  
  // Check for quotes
  if (clientSecret.includes('"') || clientSecret.includes("'")) {
    console.log("⚠️  WARNING: Client Secret contains quotes - make sure quotes aren't part of the value");
  }
} else {
  console.log("❌ Client Secret: Not set");
}

console.log("\n" + "=".repeat(70));
console.log("\n✅ Next Steps:");
console.log("-".repeat(70));
console.log("1. If you just updated .env, RESTART your server:");
console.log("   - PM2: pm2 restart all");
console.log("   - Next.js: Stop and restart your dev server");
console.log("\n2. Test Google sign-in again");
console.log("\n3. If still getting errors, check server logs for detailed error messages");
console.log("\n" + "=".repeat(70));







