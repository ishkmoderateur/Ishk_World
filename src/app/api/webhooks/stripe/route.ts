import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Initialize Stripe only if secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-10-29.clover",
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata) {
        const orderData = JSON.parse(session.metadata.orderData || "{}");
        const userId = session.metadata.userId;

        if (userId && orderData.items) {
          // Create order
          const orderNumber = `ISHK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

          await prisma.order.create({
            data: {
              userId,
              orderNumber,
              status: "PROCESSING",
              total: orderData.total,
              subtotal: orderData.subtotal,
              shipping: orderData.shipping,
              tax: orderData.tax,
              shippingAddress: orderData.shippingAddress,
              billingAddress: orderData.billingAddress,
              paymentIntentId: session.payment_intent as string,
              orderItems: {
                create: orderData.items.map((item: any) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  size: item.size,
                  color: item.color,
                })),
              },
            },
          });

          // Clear cart
          await prisma.cartItem.deleteMany({
            where: { userId },
          });

          // TODO: Send order confirmation email
        }
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Update order status if needed
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

