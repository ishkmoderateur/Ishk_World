// Quick script to verify PayPal configuration
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, "..", ".env") });

const paypalClientId = process.env.PAYPAL_CLIENT_ID;
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
const paypalMode = process.env.PAYPAL_MODE || "sandbox";

console.log("\n🔍 PayPal Configuration Check:\n");

if (!paypalClientId) {
  console.error("❌ PAYPAL_CLIENT_ID is missing!");
} else {
  console.log("✅ PAYPAL_CLIENT_ID:", paypalClientId.substring(0, 20) + "...");
}

if (!paypalClientSecret) {
  console.error("❌ PAYPAL_CLIENT_SECRET is missing!");
} else {
  console.log("✅ PAYPAL_CLIENT_SECRET:", paypalClientSecret.substring(0, 20) + "...");
}

console.log("✅ PAYPAL_MODE:", paypalMode);

if (paypalClientId && paypalClientSecret) {
  console.log("\n✅ PayPal is configured correctly!");
  console.log("\n📝 Next steps:");
  console.log("1. Make sure your dev server is running");
  console.log("2. Go to http://localhost:3000/boutique");
  console.log("3. Add items to cart");
  console.log("4. Select PayPal as payment method");
  console.log("5. Click 'Pay with PayPal'");
} else {
  console.log("\n❌ PayPal configuration is incomplete!");
  console.log("Make sure your .env file has:");
  console.log("PAYPAL_CLIENT_ID=your_client_id");
  console.log("PAYPAL_CLIENT_SECRET=your_client_secret");
  console.log("PAYPAL_MODE=sandbox");
}




