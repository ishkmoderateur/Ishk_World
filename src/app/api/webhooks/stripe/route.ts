import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Initialize Stripe only if secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
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

      console.log("✅ Webhook: checkout.session.completed received", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        paymentIntent: session.payment_intent,
      });

      if (session.metadata) {
        const orderData = JSON.parse(session.metadata.orderData || "{}");
        const userId = session.metadata.userId;

        if (userId && orderData.items) {
          // Check if order already exists (prevent duplicates)
          const existingOrder = await prisma.order.findFirst({
            where: {
              paymentIntentId: session.payment_intent as string,
            },
          });

          if (existingOrder) {
            console.log("⚠️ Order already exists, skipping creation", {
              orderId: existingOrder.id,
              orderNumber: existingOrder.orderNumber,
            });
            break;
          }

          // Fetch product prices to ensure we have correct prices
          const productIds = orderData.items.map((item: any) => item.productId);
          const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, price: true },
          });

          // Create order
          const orderNumber = `ISHK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

          const order = await prisma.order.create({
            data: {
              userId,
              orderNumber,
              status: "PROCESSING",
              total: orderData.total,
              subtotal: orderData.subtotal,
              shipping: orderData.shipping,
              tax: orderData.tax,
              shippingAddress: orderData.shippingAddress || {},
              billingAddress: orderData.billingAddress || {},
              paymentIntentId: session.payment_intent as string,
              orderItems: {
                create: orderData.items.map((item: any) => {
                  const product = products.find((p: { id: string }) => p.id === item.productId);
                  return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product?.price || item.price || 0,
                    size: item.size || null,
                    color: item.color || null,
                  };
                }),
              },
            },
          });

          console.log("✅ Order created via webhook", {
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId,
            total: order.total,
          });

          // Clear cart
          await prisma.cartItem.deleteMany({
            where: { userId },
          });

          console.log("✅ Cart cleared for user", userId);

          // TODO: Send order confirmation email
        } else {
          console.warn("⚠️ Missing userId or orderData.items in session metadata", {
            hasUserId: !!userId,
            hasItems: !!orderData.items,
          });
        }
      } else {
        console.warn("⚠️ No metadata in checkout session", { sessionId: session.id });
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

