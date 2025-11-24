import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder, getPayPalOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const paypalClientId = process.env.PAYPAL_CLIENT_ID?.trim();
    const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
    
    // Normalize mode: convert to lowercase and validate
    const modeRaw = process.env.PAYPAL_MODE?.trim().toLowerCase() || "sandbox";
    const paypalMode: "sandbox" | "live" = (modeRaw === "live" ? "live" : "sandbox");

    if (!paypalClientId || !paypalClientSecret) {
      return NextResponse.json(
        { error: "PayPal is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { orderId, orderMetadata } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Capture the PayPal payment
    const captureResult = await capturePayPalOrder(
      {
        clientId: paypalClientId,
        clientSecret: paypalClientSecret,
        mode: paypalMode,
      },
      orderId
    );

    // Check if payment was successful
    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment not completed", details: captureResult },
        { status: 400 }
      );
    }

    // Get the captured amount
    const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture) {
      return NextResponse.json(
        { error: "No capture found in PayPal response" },
        { status: 400 }
      );
    }

    // Check if order already exists (prevent duplicates)
    const existingOrder = await prisma.order.findFirst({
      where: {
        paymentIntentId: orderId, // Using PayPal order ID as payment intent ID
      },
    });

    if (existingOrder) {
      console.log("⚠️ Order already exists, returning existing order", {
        orderId: existingOrder.id,
        orderNumber: existingOrder.orderNumber,
      });
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        orderNumber: existingOrder.orderNumber,
        message: "Order already processed",
      });
    }

    // Create order in database
    if (!orderMetadata) {
      return NextResponse.json(
        { error: "Order metadata is required" },
        { status: 400 }
      );
    }

    const orderNumber = `ISHK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        status: "PROCESSING",
        total: orderMetadata.total,
        subtotal: orderMetadata.subtotal,
        shipping: orderMetadata.shipping,
        tax: orderMetadata.tax,
        shippingAddress: orderMetadata.shippingAddress || {},
        billingAddress: orderMetadata.billingAddress || {},
        paymentMethod: "paypal",
        paymentIntentId: orderId,
        orderItems: {
          create: orderMetadata.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price || 0,
            size: item.size || null,
            color: item.color || null,
          })),
        },
      },
    });

    console.log("✅ PayPal order created in database:", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paypalOrderId: orderId,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paypalOrderId: orderId,
    });
  } catch (error: unknown) {
    console.error("❌ Error capturing PayPal payment:", error);

    let errorMessage = "Failed to capture PayPal payment";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


