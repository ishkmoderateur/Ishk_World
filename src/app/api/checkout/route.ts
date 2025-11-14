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
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-10-29.clover",
    })
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

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    // Fetch product details
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Calculate totals
    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    items.forEach((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        const images = parseImages(product.images);
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
              images: images.slice(0, 1),
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        });
      }
    });

    const shipping = subtotal > 75 ? 0 : 5.9;
    const tax = subtotal * 0.2; // 20% VAT (adjust as needed)
    const total = subtotal + shipping + tax;

    // Add shipping as line item
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        orderData: JSON.stringify({
          items,
          shippingAddress,
          billingAddress,
          subtotal,
          shipping,
          tax,
          total,
        }),
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

