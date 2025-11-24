// PayPal REST API Client
// Using direct REST API calls (simpler and more flexible than SDK)

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  mode: "sandbox" | "live";
}

const PAYPAL_API_BASE = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
};

let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get PayPal access token
 */
export async function getPayPalAccessToken(
  clientId: string,
  clientSecret: string,
  mode: "sandbox" | "live" | string = "sandbox"
): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (accessToken && Date.now() < tokenExpiry - 300000) {
    return accessToken;
  }

  // Normalize mode to ensure it's valid
  const normalizedMode = mode?.toLowerCase().trim() === "live" ? "live" : "sandbox";
  const baseUrl = PAYPAL_API_BASE[normalizedMode];

  if (!baseUrl) {
    throw new Error(`Invalid PayPal mode: "${mode}". Must be "sandbox" or "live".`);
  }

  try {
    // Trim credentials to remove any whitespace
    const trimmedClientId = clientId.trim();
    const trimmedClientSecret = clientSecret.trim();
    
    // Validate credentials format
    if (!trimmedClientId || trimmedClientId.length < 20) {
      throw new Error("Invalid PayPal Client ID: too short or empty");
    }
    if (!trimmedClientSecret || trimmedClientSecret.length < 20) {
      throw new Error("Invalid PayPal Client Secret: too short or empty");
    }
    
    // Debug logging (only show first/last few chars for security)
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 PayPal Auth Debug:", {
        mode,
        clientIdLength: trimmedClientId.length,
        clientIdPreview: `${trimmedClientId.substring(0, 10)}...${trimmedClientId.substring(trimmedClientId.length - 10)}`,
        secretLength: trimmedClientSecret.length,
        baseUrl,
      });
    }

    const auth = Buffer.from(`${trimmedClientId}:${trimmedClientSecret}`).toString("base64");
    
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMessage = `PayPal auth failed: ${JSON.stringify(error)}`;
      
      // Provide helpful hints for common errors
      if (error.error === "invalid_client") {
        console.error("❌ PayPal Authentication Error:");
        console.error("   - Check that Client ID and Secret match");
        console.error("   - Verify they're from the same environment (sandbox/live)");
        console.error("   - Make sure there are no extra spaces in .env file");
        console.error("   - Client ID should start with 'A' for sandbox or 'A' for live");
        console.error(`   - Mode being used: ${mode}`);
        console.error(`   - Client ID length: ${trimmedClientId.length} (should be ~80 chars)`);
        console.error(`   - Client Secret length: ${trimmedClientSecret.length} (should be ~80 chars)`);
        console.error("   - Double-check credentials in PayPal Developer Dashboard:");
        console.error("     Sandbox: https://developer.paypal.com/dashboard/applications/sandbox");
        console.error("     Live: https://developer.paypal.com/dashboard/applications/live");
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiry (usually 32400 seconds = 9 hours)
    tokenExpiry = Date.now() + (data.expires_in * 1000);

    return accessToken;
  } catch (error) {
    console.error("PayPal access token error:", error);
    throw error;
  }
}

/**
 * Create PayPal order
 */
export async function createPayPalOrder(
  config: PayPalConfig,
  orderData: {
    amount: number;
    currency: string;
    items: Array<{
      name: string;
      quantity: number;
      unit_amount: number;
      description?: string;
    }>;
    description?: string;
    returnUrl: string;
    cancelUrl: string;
  }
) {
  // Normalize mode to ensure it's valid
  const normalizedMode = config.mode?.toLowerCase().trim() === "live" ? "live" : "sandbox";
  const baseUrl = PAYPAL_API_BASE[normalizedMode];
  
  if (!baseUrl) {
    throw new Error(`Invalid PayPal mode: "${config.mode}". Must be "sandbox" or "live".`);
  }
  
  const token = await getPayPalAccessToken(config.clientId, config.clientSecret, normalizedMode);

  const purchaseUnits = [
    {
      amount: {
        currency_code: orderData.currency.toUpperCase(),
        value: orderData.amount.toFixed(2),
        breakdown: {
          item_total: {
            currency_code: orderData.currency.toUpperCase(),
            value: orderData.items
              .reduce((sum, item) => sum + item.unit_amount * item.quantity, 0)
              .toFixed(2),
          },
        },
      },
      items: orderData.items.map((item) => ({
        name: item.name,
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: orderData.currency.toUpperCase(),
          value: item.unit_amount.toFixed(2),
        },
        description: item.description,
      })),
      description: orderData.description,
    },
  ];

  const payload = {
    intent: "CAPTURE",
    purchase_units: purchaseUnits,
    application_context: {
      brand_name: "Ishk Platform",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: orderData.returnUrl,
      cancel_url: orderData.cancelUrl,
    },
  };

  try {
    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "PayPal-Request-Id": `ishk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`PayPal order creation failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("PayPal order creation error:", error);
    throw error;
  }
}

/**
 * Capture PayPal payment
 */
export async function capturePayPalOrder(
  config: PayPalConfig,
  orderId: string
) {
  // Normalize mode to ensure it's valid
  const normalizedMode = config.mode?.toLowerCase().trim() === "live" ? "live" : "sandbox";
  const baseUrl = PAYPAL_API_BASE[normalizedMode];
  
  if (!baseUrl) {
    throw new Error(`Invalid PayPal mode: "${config.mode}". Must be "sandbox" or "live".`);
  }
  
  const token = await getPayPalAccessToken(config.clientId, config.clientSecret, normalizedMode);

  try {
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`PayPal capture failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("PayPal capture error:", error);
    throw error;
  }
}

/**
 * Get PayPal order details
 */
export async function getPayPalOrder(
  config: PayPalConfig,
  orderId: string
) {
  // Normalize mode to ensure it's valid
  const normalizedMode = config.mode?.toLowerCase().trim() === "live" ? "live" : "sandbox";
  const baseUrl = PAYPAL_API_BASE[normalizedMode];
  
  if (!baseUrl) {
    throw new Error(`Invalid PayPal mode: "${config.mode}". Must be "sandbox" or "live".`);
  }
  
  const token = await getPayPalAccessToken(config.clientId, config.clientSecret, normalizedMode);

  try {
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`PayPal get order failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("PayPal get order error:", error);
    throw error;
  }
}


