#!/usr/bin/env tsx
/**
 * Diagnostic script to check Google OAuth configuration
 * Run with: npx tsx scripts/diagnose-google-oauth.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

console.log("🔍 Google OAuth Configuration Diagnostic\n");
console.log("=" .repeat(60));

// Check environment variables
const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
const nodeEnv = process.env.NODE_ENV;

console.log("\n📋 Environment Variables:");
console.log("-".repeat(60));
console.log(`NODE_ENV: ${nodeEnv || "NOT SET"}`);
console.log(`NEXTAUTH_URL: ${nextAuthUrl || "NOT SET"}`);

// Check Client ID
console.log("\n🔑 GOOGLE_CLIENT_ID:");
console.log("-".repeat(60));
if (!clientId) {
  console.log("❌ NOT SET");
} else {
  console.log(`✅ Set (length: ${clientId.length} chars)`);
  console.log(`   First 30 chars: ${clientId.substring(0, 30)}...`);
  console.log(`   Last 20 chars: ...${clientId.substring(clientId.length - 20)}`);
  
  // Check format
  if (!clientId.endsWith('.apps.googleusercontent.com')) {
    console.log("⚠️  WARNING: Does not end with .apps.googleusercontent.com");
    console.log(`   Actual ending: ...${clientId.substring(clientId.length - 30)}`);
  } else {
    console.log("✅ Format looks correct (ends with .apps.googleusercontent.com)");
  }
  
  // Check for common typos
  const suspiciousChars = clientId.match(/[0O1Il]/g);
  if (suspiciousChars) {
    console.log(`⚠️  Contains potentially confusing characters: ${suspiciousChars.join(', ')}`);
    console.log("   (0 vs O, 1 vs I vs l) - double-check for typos");
  }
}

// Check Client Secret
console.log("\n🔐 GOOGLE_CLIENT_SECRET:");
console.log("-".repeat(60));
if (!clientSecret) {
  console.log("❌ NOT SET");
} else {
  console.log(`✅ Set (length: ${clientSecret.length} chars)`);
  console.log(`   First 15 chars: ${clientSecret.substring(0, 15)}...`);
  console.log(`   Last 10 chars: ...${clientSecret.substring(clientSecret.length - 10)}`);
  
  // Check format
  if (!clientSecret.startsWith('GOCSPX-')) {
    console.log("⚠️  WARNING: Does not start with GOCSPX-");
    console.log(`   Actual start: ${clientSecret.substring(0, 10)}...`);
    console.log("   Note: Older secrets might not start with GOCSPX-");
  } else {
    console.log("✅ Format looks correct (starts with GOCSPX-)");
  }
  
  if (clientSecret.length < 20) {
    console.log("⚠️  WARNING: Secret seems too short (should be longer)");
  }
  
  // Check for common typos
  const suspiciousChars = clientSecret.match(/[0O1Il]/g);
  if (suspiciousChars) {
    console.log(`⚠️  Contains potentially confusing characters: ${suspiciousChars.join(', ')}`);
    console.log("   (0 vs O, 1 vs I vs l) - double-check for typos");
  }
  
  // Check for spaces or special characters that might cause issues
  if (clientSecret.includes(' ')) {
    console.log("❌ ERROR: Contains spaces! Remove any spaces.");
  }
  if (clientSecret.includes('\n') || clientSecret.includes('\r')) {
    console.log("❌ ERROR: Contains newlines! Remove any line breaks.");
  }
  if (clientSecret.includes('"') || clientSecret.includes("'")) {
    console.log("⚠️  WARNING: Contains quotes - make sure quotes are not part of the value");
  }
}

// Check NEXTAUTH_URL
console.log("\n🌐 NEXTAUTH_URL:");
console.log("-".repeat(60));
if (!nextAuthUrl) {
  console.log("⚠️  NOT SET - will use request headers or defaults");
} else {
  console.log(`✅ Set: ${nextAuthUrl}`);
  
  if (nodeEnv === 'production') {
    if (nextAuthUrl.startsWith('http://')) {
      console.log("❌ ERROR: Using HTTP in production! Should be HTTPS");
      console.log("   Fix: Change to https://ishk-world.com");
    } else if (nextAuthUrl.startsWith('https://')) {
      console.log("✅ Using HTTPS (correct for production)");
    }
    
    if (!nextAuthUrl.includes('ishk-world.com')) {
      console.log("⚠️  WARNING: URL doesn't contain ishk-world.com");
    }
  }
}

// Calculate expected redirect URI
console.log("\n🔗 Expected Redirect URI:");
console.log("-".repeat(60));
let baseUrl = nextAuthUrl;
if (!baseUrl) {
  baseUrl = nodeEnv === 'production' 
    ? "https://ishk-world.com" 
    : "http://localhost:3000";
}

// Force HTTPS in production
if (nodeEnv === 'production' && baseUrl.startsWith('http://')) {
  baseUrl = baseUrl.replace('http://', 'https://');
}

// Normalize www
if (baseUrl.includes('www.ishk-world.com')) {
  baseUrl = baseUrl.replace('www.ishk-world.com', 'ishk-world.com');
}

const redirectUri = `${baseUrl}/api/auth/google/callback`;
console.log(`Expected redirect URI: ${redirectUri}`);
console.log("\n📝 This EXACT URI must be in Google Cloud Console:");
console.log(`   ${redirectUri}`);

// Overall status
console.log("\n" + "=".repeat(60));
console.log("\n📊 Overall Status:");
console.log("-".repeat(60));

const issues: string[] = [];
const warnings: string[] = [];

if (!clientId) {
  issues.push("GOOGLE_CLIENT_ID is not set");
} else if (!clientId.endsWith('.apps.googleusercontent.com')) {
  warnings.push("GOOGLE_CLIENT_ID format may be incorrect");
}

if (!clientSecret) {
  issues.push("GOOGLE_CLIENT_SECRET is not set");
} else if (!clientSecret.startsWith('GOCSPX-') && clientSecret.length < 20) {
  warnings.push("GOOGLE_CLIENT_SECRET format may be incorrect");
}

if (nodeEnv === 'production' && nextAuthUrl && nextAuthUrl.startsWith('http://')) {
  issues.push("NEXTAUTH_URL uses HTTP in production (should be HTTPS)");
}

if (issues.length === 0 && warnings.length === 0) {
  console.log("✅ Configuration looks good!");
  console.log("\n✅ Next steps:");
  console.log("   1. Make sure the redirect URI above is in Google Cloud Console");
  console.log("   2. Test the OAuth flow at /auth/signin");
  console.log("   3. Check server logs if you encounter errors");
} else {
  if (issues.length > 0) {
    console.log("\n❌ CRITICAL ISSUES:");
    issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log("\n⚠️  WARNINGS:");
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }
}

console.log("\n" + "=".repeat(60));







