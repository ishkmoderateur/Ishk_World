// Script to verify PayPal environment variables
// Run with: node scripts/verify-paypal-env.js

require('dotenv').config();

console.log("\n🔍 PayPal Environment Variables Check\n");
console.log("=" .repeat(50));

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const mode = process.env.PAYPAL_MODE;

console.log("\n1. PAYPAL_CLIENT_ID:");
if (!clientId) {
  console.log("   ❌ NOT SET");
} else {
  const trimmed = clientId.trim();
  console.log(`   ✅ Set (${trimmed.length} chars)`);
  console.log(`   Preview: ${trimmed.substring(0, 15)}...${trimmed.substring(trimmed.length - 10)}`);
  if (trimmed !== clientId) {
    console.log("   ⚠️  WARNING: Has leading/trailing whitespace!");
  }
}

console.log("\n2. PAYPAL_CLIENT_SECRET:");
if (!clientSecret) {
  console.log("   ❌ NOT SET");
} else {
  const trimmed = clientSecret.trim();
  console.log(`   ✅ Set (${trimmed.length} chars)`);
  console.log(`   Preview: ${trimmed.substring(0, 15)}...${trimmed.substring(trimmed.length - 10)}`);
  if (trimmed !== clientSecret) {
    console.log("   ⚠️  WARNING: Has leading/trailing whitespace!");
  }
}

console.log("\n3. PAYPAL_MODE:");
if (!mode) {
  console.log("   ⚠️  NOT SET (will default to 'sandbox')");
} else {
  const trimmed = mode.trim().toLowerCase();
  if (trimmed === 'sandbox' || trimmed === 'live') {
    console.log(`   ✅ Set to: ${trimmed}`);
  } else {
    console.log(`   ❌ INVALID: "${mode}" (must be 'sandbox' or 'live')`);
  }
}

console.log("\n" + "=".repeat(50));
console.log("\n📝 Checklist:");
console.log("   □ Client ID and Secret are from the SAME environment");
console.log("   □ PAYPAL_MODE matches where you got the credentials");
console.log("   □ No quotes around values in .env file");
console.log("   □ No spaces before/after the = sign");
console.log("   □ No trailing spaces at end of lines");

console.log("\n🔗 PayPal Developer Dashboard:");
console.log("   Sandbox: https://developer.paypal.com/dashboard/applications/sandbox");
console.log("   Live: https://developer.paypal.com/dashboard/applications/live");

console.log("\n");




