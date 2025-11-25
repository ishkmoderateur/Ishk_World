// Test PayPal credentials against both sandbox and live environments
require('dotenv').config();

const PAYPAL_API_BASE = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
};

async function testPayPalAuth(mode) {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  const baseUrl = PAYPAL_API_BASE[mode];
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

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
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testBoth() {
  console.log("\n🧪 Testing PayPal credentials against both environments...\n");

  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    console.error("❌ PayPal credentials not found in .env file");
    process.exit(1);
  }

  console.log("Testing Sandbox environment...");
  const sandboxResult = await testPayPalAuth("sandbox");
  
  console.log("Testing Live environment...");
  const liveResult = await testPayPalAuth("live");

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Results:\n");

  console.log("Sandbox Environment:");
  if (sandboxResult.success) {
    console.log("   ✅ SUCCESS - Your credentials work with Sandbox!");
    console.log(`   Token: ${sandboxResult.data.access_token.substring(0, 20)}...`);
  } else {
    console.log("   ❌ FAILED");
    if (sandboxResult.data?.error === "invalid_client") {
      console.log("   Error: Invalid client credentials");
    } else {
      console.log(`   Error: ${JSON.stringify(sandboxResult.data || sandboxResult.error)}`);
    }
  }

  console.log("\nLive Environment:");
  if (liveResult.success) {
    console.log("   ✅ SUCCESS - Your credentials work with Live!");
    console.log(`   Token: ${liveResult.data.access_token.substring(0, 20)}...`);
  } else {
    console.log("   ❌ FAILED");
    if (liveResult.data?.error === "invalid_client") {
      console.log("   Error: Invalid client credentials");
    } else {
      console.log(`   Error: ${JSON.stringify(liveResult.data || liveResult.error)}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Recommendation:\n");

  if (sandboxResult.success && !liveResult.success) {
    console.log("✅ Your credentials are from SANDBOX environment.");
    console.log("   Set PAYPAL_MODE=sandbox in your .env file");
  } else if (liveResult.success && !sandboxResult.success) {
    console.log("✅ Your credentials are from LIVE environment.");
    console.log("   Set PAYPAL_MODE=live in your .env file");
  } else if (sandboxResult.success && liveResult.success) {
    console.log("⚠️  Your credentials work with BOTH environments (unusual).");
    console.log("   Use sandbox for testing, live for production.");
  } else {
    console.log("❌ Your credentials don't work with either environment.");
    console.log("   Please verify your credentials in PayPal Developer Dashboard:");
    console.log("   - Sandbox: https://developer.paypal.com/dashboard/applications/sandbox");
    console.log("   - Live: https://developer.paypal.com/dashboard/applications/live");
    console.log("   - Make sure you're copying from 'REST API apps' section");
  }

  console.log("\n");
}

testBoth();




