// Simple Node.js script to test PayPal authentication
// Run with: node scripts/test-paypal-auth.js

require('dotenv').config();

const PAYPAL_API_BASE = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
};

async function testPayPalAuth() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  const mode = (process.env.PAYPAL_MODE?.trim() || "sandbox");

  console.log("\n🔍 Testing PayPal Authentication...\n");

  if (!clientId || !clientSecret) {
    console.error("❌ Missing credentials in .env file!");
    console.error("   Make sure you have:");
    console.error("   PAYPAL_CLIENT_ID=...");
    console.error("   PAYPAL_CLIENT_SECRET=...");
    console.error("   PAYPAL_MODE=sandbox (or live)");
    process.exit(1);
  }

  console.log("✅ Credentials found:");
  console.log(`   Mode: ${mode}`);
  console.log(`   Client ID length: ${clientId.length} chars`);
  console.log(`   Client ID preview: ${clientId.substring(0, 15)}...${clientId.substring(clientId.length - 10)}`);
  console.log(`   Secret length: ${clientSecret.length} chars`);
  console.log(`   Secret preview: ${clientSecret.substring(0, 15)}...${clientSecret.substring(clientSecret.length - 10)}`);

  const baseUrl = PAYPAL_API_BASE[mode];
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  console.log(`\n📡 Attempting authentication to: ${baseUrl}`);
  console.log("   Endpoint: /v1/oauth2/token\n");

  try {
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Authentication FAILED!");
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${JSON.stringify(data, null, 2)}\n`);

      if (data.error === "invalid_client") {
        console.error("💡 Troubleshooting Tips:");
        console.error("   1. Verify credentials match in PayPal Developer Dashboard:");
        console.error(`      - Sandbox: https://developer.paypal.com/dashboard/applications/sandbox`);
        console.error(`      - Live: https://developer.paypal.com/dashboard/applications/live`);
        console.error("   2. Make sure Client ID and Secret are from the SAME environment:");
        console.error(`      - If mode is "${mode}", use ${mode} credentials`);
        console.error("   3. Check for extra spaces or newlines in .env file");
        console.error("   4. Try copying credentials again from PayPal dashboard");
        console.error("   5. Make sure you're using REST API credentials (not SDK credentials)");
      }

      process.exit(1);
    }

    console.log("✅ Authentication SUCCESSFUL!");
    console.log(`   Access Token: ${data.access_token.substring(0, 20)}...`);
    console.log(`   Token Type: ${data.token_type}`);
    console.log(`   Expires in: ${data.expires_in} seconds\n`);
    console.log("🎉 Your PayPal credentials are working correctly!\n");

  } catch (error) {
    console.error("❌ Network Error:", error.message);
    console.error("   Check your internet connection and try again.");
    process.exit(1);
  }
}

testPayPalAuth();




