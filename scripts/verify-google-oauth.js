// Script to verify Google OAuth configuration
require('dotenv').config();

console.log("\n🔍 Google OAuth Configuration Check\n");
console.log("=".repeat(50));

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

console.log("\n1. GOOGLE_CLIENT_ID:");
if (!clientId) {
  console.log("   ❌ NOT SET");
} else {
  const trimmed = clientId.trim();
  console.log(`   ✅ Set (${trimmed.length} chars)`);
  console.log(`   Preview: ${trimmed.substring(0, 20)}...${trimmed.substring(trimmed.length - 10)}`);
  if (trimmed !== clientId) {
    console.log("   ⚠️  WARNING: Has leading/trailing whitespace!");
  }
  if (trimmed.length < 20) {
    console.log("   ⚠️  WARNING: Client ID seems too short!");
  }
}

console.log("\n2. GOOGLE_CLIENT_SECRET:");
if (!clientSecret) {
  console.log("   ❌ NOT SET");
} else {
  const trimmed = clientSecret.trim();
  console.log(`   ✅ Set (${trimmed.length} chars)`);
  console.log(`   Preview: ${trimmed.substring(0, 20)}...${trimmed.substring(trimmed.length - 10)}`);
  if (trimmed !== clientSecret) {
    console.log("   ⚠️  WARNING: Has leading/trailing whitespace!");
  }
  if (trimmed.length < 20) {
    console.log("   ⚠️  WARNING: Client Secret seems too short!");
  }
}

console.log("\n" + "=".repeat(50));

if (clientId && clientSecret) {
  const trimmedId = clientId.trim();
  const trimmedSecret = clientSecret.trim();
  
  if (trimmedId && trimmedSecret && trimmedId.length > 20 && trimmedSecret.length > 20) {
    console.log("\n✅ Google OAuth is configured correctly!");
    console.log("\n📝 Next steps:");
    console.log("1. Make sure your dev server is restarted");
    console.log("2. Go to http://localhost:3000/auth/signin");
    console.log("3. Click 'Continue with Google'");
  } else {
    console.log("\n⚠️  Google OAuth configuration has issues!");
    console.log("   Please check your .env file and ensure:");
    console.log("   - No quotes around values");
    console.log("   - No spaces before/after the = sign");
    console.log("   - Values are complete (not truncated)");
  }
} else {
  console.log("\n❌ Google OAuth is not configured!");
  console.log("\n📝 To set up Google OAuth:");
  console.log("1. Go to https://console.cloud.google.com/");
  console.log("2. Create OAuth 2.0 Client ID");
  console.log("3. Add to your .env file:");
  console.log("   GOOGLE_CLIENT_ID=your_client_id_here");
  console.log("   GOOGLE_CLIENT_SECRET=your_client_secret_here");
  console.log("4. Restart your server");
}

console.log("\n");



