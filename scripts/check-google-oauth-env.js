#!/usr/bin/env node

/**
 * Script to check Google OAuth environment variables
 * Run this on the VPS to verify configuration
 */

console.log("🔍 Checking Google OAuth Environment Variables...\n");

const requiredVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
];

const optionalVars = [
  "NODE_ENV",
];

let allGood = true;

console.log("Required Variables:");
console.log("==================");
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value.trim() === "") {
    console.log(`❌ ${varName}: NOT SET or EMPTY`);
    allGood = false;
  } else {
    const trimmed = value.trim();
    if (varName.includes("SECRET") || varName.includes("CLIENT_SECRET")) {
      console.log(`✅ ${varName}: SET (${trimmed.length} characters)`);
    } else if (varName === "GOOGLE_CLIENT_ID") {
      console.log(`✅ ${varName}: SET (${trimmed.substring(0, 20)}...)`);
    } else {
      console.log(`✅ ${varName}: ${trimmed}`);
    }
  }
});

console.log("\nOptional Variables:");
console.log("==================");
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: NOT SET (using default)`);
  }
});

console.log("\n" + "=".repeat(50));
if (allGood) {
  console.log("✅ All required environment variables are set!");
  console.log("\nNext steps:");
  console.log("1. Verify GOOGLE_CLIENT_ID matches your Google Cloud Console");
  console.log("2. Verify redirect URI in Google Cloud Console:");
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim() || "http://localhost:3000";
  console.log(`   ${nextAuthUrl}/api/auth/google/callback`);
} else {
  console.log("❌ Some required environment variables are missing!");
  console.log("\nPlease set the missing variables in your .env file:");
  console.log("1. Edit /var/www/ishk-platform/.env");
  console.log("2. Add the missing variables");
  console.log("3. Restart PM2: pm2 restart all");
}
console.log("=".repeat(50));

process.exit(allGood ? 0 : 1);

