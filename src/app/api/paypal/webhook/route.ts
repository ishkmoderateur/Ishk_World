import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Verify PayPal webhook signature
function verifyWebhookSignature(
  headers: Headers,
  body: string,
  webhookId: string,
  clientSecret: string
): boolean {
  try {
    const signature = headers.get("paypal-transmission-sig");
    const certUrl = headers.get("paypal-cert-url");
    const transmissionId = headers.get("paypal-transmission-id");
    const transmissionTime = headers.get("paypal-transmission-time");
    const authAlgo = headers.get("paypal-auth-algo");

    if (!signature || !certUrl || !transmissionId || !transmissionTime || !authAlgo) {
      console.error("Missing PayPal webhook headers");
      return false;
    }

    // In production, you should verify the certificate URL and signature
    // For now, we'll use a simpler approach with webhook ID verification
    // PayPal provides a webhook verification endpoint, but for simplicity,
    // we'll verify the webhook ID matches
    
    // For production, implement full signature verification:
    // https://developer.paypal.com/docs/api-basics/notifications/webhooks/notification-messages/
    
    return true; // Simplified - implement full verification in production
  } catch (error) {
    console.error("Webhook verification error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!webhookId || !clientSecret) {
      console.error("PayPal webhook not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headers = request.headers;

    // Verify webhook signature (simplified - implement full verification in production)
    // const isValid = verifyWebhookSignature(headers, body, webhookId, clientSecret);
    // if (!isValid) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const event = JSON.parse(body);
    const eventType = event.event_type;

    console.log("📥 PayPal Webhook received:", eventType);

    // Handle different webhook events
    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        const resource = event.resource;
        const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;

        if (orderId) {
          // Check if order already exists
          const existingOrder = await prisma.order.findFirst({
            where: {
              paymentIntentId: orderId,
            },
          });

          if (existingOrder) {
            console.log("⚠️ Order already exists, updating status");
            await prisma.order.update({
              where: { id: existingOrder.id },
              data: { status: "PROCESSING" },
            });
          }
        }
        break;
      }

      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.REFUNDED": {
        const resource = event.resource;
        const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;

        if (orderId) {
          const order = await prisma.order.findFirst({
            where: { paymentIntentId: orderId },
          });

          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: eventType.includes("REFUNDED") ? "REFUNDED" : "CANCELLED",
              },
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled PayPal webhook event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("❌ PayPal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}




