import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";
import { getPayPalCurrency, type Currency } from "@/lib/currency";

// Helper to safely parse images JSON field
function parseImages(images: any): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter((img): img is string => typeof img === "string");
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter((img): img is string => typeof img === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check PayPal configuration (trim to remove any whitespace)
    const paypalClientId = process.env.PAYPAL_CLIENT_ID?.trim();
    const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
    
    // Normalize mode: convert to lowercase and validate
    const modeRaw = process.env.PAYPAL_MODE?.trim().toLowerCase() || "sandbox";
    const paypalMode: "sandbox" | "live" = (modeRaw === "live" ? "live" : "sandbox");
    
    // Validate mode
    if (paypalMode !== "sandbox" && paypalMode !== "live") {
      return NextResponse.json(
        {
          error: `Invalid PAYPAL_MODE: "${process.env.PAYPAL_MODE}". Must be "sandbox" or "live".`,
          hint: "Please set PAYPAL_MODE to either 'sandbox' or 'live' in your .env file"
        },
        { status: 500 }
      );
    }

    if (!paypalClientId || !paypalClientSecret) {
      return NextResponse.json(
        {
          error: "PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.",
          hint: "Get your credentials from PayPal Developer Dashboard: https://developer.paypal.com/dashboard"
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { items, shippingAddress, billingAddress, currency = "USD" } = body;

    // Set default addresses if not provided
    const defaultAddress = {
      name: session.user.name || "",
      email: session.user.email || "",
      phone: "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
    };

    const finalShippingAddress = shippingAddress || defaultAddress;
    const finalBillingAddress = billingAddress || defaultAddress;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    // Fetch product details
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Validate all products exist and are in stock
    for (const item of items) {
      const product = products.find((p: { id: string }) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 404 }
        );
      }
      if (!product.inStock) {
        return NextResponse.json(
          { error: `Product ${product.name} is out of stock` },
          { status: 400 }
        );
      }
      if (product.stockCount > 0 && item.quantity > product.stockCount) {
        return NextResponse.json(
          { error: `Only ${product.stockCount} units available for ${product.name}` },
          { status: 400 }
        );
      }
      if (!product.price || product.price <= 0) {
        return NextResponse.json(
          { error: `Product ${product.name} has an invalid price` },
          { status: 400 }
        );
      }
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for product ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals (prices are in USD in database)
    let subtotal = 0;
    const paypalItems: Array<{
      name: string;
      quantity: number;
      unit_amount: number;
      description?: string;
    }> = [];

    items.forEach((item: {
      productId: string;
      quantity: number;
    }) => {
      const product = products.find((p: { id: string }) => p.id === item.productId);
      if (product && item.quantity > 0) {
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        paypalItems.push({
          name: product.name,
          quantity: item.quantity,
          unit_amount: product.price, // Price per unit
          description: product.description?.substring(0, 127) || undefined, // PayPal limit
        });
      }
    });

    if (paypalItems.length === 0) {
      return NextResponse.json(
        { error: "No valid items to checkout" },
        { status: 400 }
      );
    }

    const shipping = subtotal > 75 ? 0 : 5.9;
    const tax = subtotal * 0.2; // 20% VAT (adjust as needed)
    const total = subtotal + shipping + tax;

    // Validate total is positive
    if (total <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    // Convert currency to PayPal-supported currency (e.g., MAD -> EUR)
    const userCurrency = (currency.toUpperCase() || "USD") as Currency;
    const paypalCurrencyInfo = getPayPalCurrency(userCurrency);
    const conversionRate = paypalCurrencyInfo.conversionRate;
    
    // Convert all amounts to PayPal currency using the conversion rate
    const paypalSubtotal = subtotal * conversionRate;
    const paypalShipping = shipping * conversionRate;
    const paypalTax = tax * conversionRate;
    const paypalTotal = total * conversionRate;

    // Convert item prices to PayPal currency
    const paypalItemsConverted = paypalItems.map(item => ({
      ...item,
      unit_amount: item.unit_amount * conversionRate,
    }));

    // Add shipping as item if applicable
    if (paypalShipping > 0) {
      paypalItemsConverted.push({
        name: "Shipping",
        quantity: 1,
        unit_amount: paypalShipping,
        description: "Shipping fee",
      });
    }

    // Add tax as item if applicable
    if (paypalTax > 0) {
      paypalItemsConverted.push({
        name: "Tax (VAT)",
        quantity: 1,
        unit_amount: paypalTax,
        description: "20% VAT",
      });
    }

    // Ensure NEXTAUTH_URL is set
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Create PayPal order with converted currency
    const paypalOrder = await createPayPalOrder(
      {
        clientId: paypalClientId,
        clientSecret: paypalClientSecret,
        mode: paypalMode,
      },
      {
        amount: paypalTotal,
        currency: paypalCurrencyInfo.currency,
        items: paypalItemsConverted,
        description: `Order from Ishk Platform - ${items.length} item(s)`,
        returnUrl: `${baseUrl}/orders/success?paymentMethod=paypal`,
        cancelUrl: `${baseUrl}/cart?canceled=true&paymentMethod=paypal`,
      }
    );

    // Store order data in metadata for webhook processing
    // We'll use the PayPal order ID as reference
    const orderMetadata = {
      userId: session.user.id,
      items: items.map((item: any) => {
        const product = products.find((p: { id: string }) => p.id === item.productId);
        return {
          ...item,
          price: product?.price || 0,
        };
      }),
      shippingAddress: finalShippingAddress,
      billingAddress: finalBillingAddress,
      subtotal,
      shipping,
      tax,
      total,
      currency: userCurrency, // Original user currency
      paypalCurrency: paypalCurrencyInfo.currency, // Currency used for PayPal
      paypalAmount: paypalTotal, // Amount in PayPal currency
      currencyConversionRate: conversionRate, // Conversion rate used
    };

    // Log order creation in development
    if (process.env.NODE_ENV === "development") {
      console.log("✅ PayPal Order created:", {
        orderId: paypalOrder.id,
        amount: total,
        currency: currency.toUpperCase(),
        mode: paypalMode,
      });
    }

    return NextResponse.json({
      orderId: paypalOrder.id,
      approvalUrl: paypalOrder.links?.find((link: any) => link.rel === "approve")?.href,
      metadata: orderMetadata, // Store this client-side temporarily
    });
  } catch (error: unknown) {
    console.error("❌ Error creating PayPal order:", error);

    let errorMessage = "Failed to create PayPal order";
    let hint = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Provide helpful hints for common errors
      if (errorMessage.includes("invalid_client")) {
        hint = "PayPal credentials are incorrect or don't match the environment. Please verify:\n" +
               "1. Your Client ID and Secret are from the SAME environment (both Sandbox OR both Live)\n" +
               "2. PAYPAL_MODE in .env matches where you got the credentials\n" +
               "3. Credentials are copied correctly (no extra spaces)\n" +
               "4. If using Sandbox, get credentials from: https://developer.paypal.com/dashboard/applications/sandbox\n" +
               "5. If using Live, get credentials from: https://developer.paypal.com/dashboard/applications/live";
      } else if (errorMessage.includes("PayPal is not configured")) {
        hint = "Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file";
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        hint: hint || undefined,
      },
      { status: 500 }
    );
  }
}


