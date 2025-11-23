import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

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

// Initialize Stripe only if secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isTestMode = stripeSecretKey?.startsWith("sk_test_");
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

// POST - Create Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shippingAddress, billingAddress } = body;

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

    if (!stripe) {
      return NextResponse.json(
        { 
          error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in your .env file.",
          hint: "For test mode, use a key starting with 'sk_test_' from your Stripe Dashboard > Developers > API keys"
        },
        { status: 500 }
      );
    }

    // Log test mode status for debugging
    if (isTestMode && process.env.NODE_ENV === "development") {
      console.log("🧪 Stripe Test Mode: Using test API key");
    }

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
      // Validate product price
      if (!product.price || product.price <= 0) {
        return NextResponse.json(
          { error: `Product ${product.name} has an invalid price` },
          { status: 400 }
        );
      }
      // Validate quantity
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for product ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    items.forEach((item: {
      productId: string;
      quantity: number;
    }) => {
      const product = products.find((p: { id: string }) => p.id === item.productId);
      if (product && item.quantity > 0) {
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        const images = parseImages(product.images);
        // Filter images to only include valid URLs (Stripe requires full URLs)
        const validImages = images
          .filter((img: string) => {
            try {
              const url = new URL(img);
              return url.protocol === "http:" || url.protocol === "https:";
            } catch {
              return false;
            }
          })
          .slice(0, 1); // Stripe allows max 1 image in product_data

        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
              images: validImages.length > 0 ? validImages : undefined,
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        });
      }
    });

    if (lineItems.length === 0) {
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

    // Validate unit amounts are positive
    for (const item of lineItems) {
      if (item.price_data && item.price_data.unit_amount && item.price_data.unit_amount <= 0) {
        return NextResponse.json(
          { error: "Invalid product price" },
          { status: 400 }
        );
      }
    }

    // Add shipping as line item
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Shipping",
            description: "Shipping fee",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Tax (VAT)",
            description: "20% VAT",
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    // Ensure NEXTAUTH_URL is set
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        testMode: isTestMode ? "true" : "false",
        orderData: JSON.stringify({
          items: items.map((item: any) => {
            const product = products.find((p: { id: string }) => p.id === item.productId);
            return {
              ...item,
              price: product?.price || 0, // Include price in order data
            };
          }),
          shippingAddress: finalShippingAddress,
          billingAddress: finalBillingAddress,
          subtotal,
          shipping,
          tax,
          total,
        }),
      },
    });

    // Log session creation in test mode
    if (isTestMode && process.env.NODE_ENV === "development") {
      console.log("✅ Stripe Checkout Session created:", {
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
        amount: total,
        currency: "EUR",
      });
    }

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: unknown) {
    console.error("❌ Error creating checkout session:", error);
    
    let errorMessage = "Failed to create checkout session";
    let errorDetails: any = {};
    
    if (error instanceof Stripe.errors.StripeError) {
      errorMessage = error.message;
      errorDetails = {
        type: error.type,
        code: error.code,
        statusCode: error.statusCode,
      };
      
      // Provide helpful hints for common errors
      if (error.type === "StripeAuthenticationError") {
        errorDetails.hint = "Check your STRIPE_SECRET_KEY. For test mode, use a key starting with 'sk_test_'";
      } else if (error.type === "StripeInvalidRequestError") {
        errorDetails.hint = "Invalid request parameters. Check line items and amounts.";
      } else if (error.type === "StripeAPIError") {
        errorDetails.hint = "Stripe API error. Check your internet connection and Stripe status.";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails.stack = error.stack;
    }
    
    // Return more detailed error in development
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        { 
          error: errorMessage,
          ...errorDetails,
          testMode: isTestMode,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(isTestMode && errorDetails.hint ? { hint: errorDetails.hint } : {})
      },
      { status: 500 }
    );
  }
}

