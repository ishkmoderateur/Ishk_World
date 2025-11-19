import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

// GET - Fetch user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching orders:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create new order
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
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentIntentId,
      total,
      subtotal,
      shipping,
      tax = 0,
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: "Shipping and billing addresses are required" },
        { status: 400 }
      );
    }

    // Validate numeric values
    const validatedTotal = typeof total === "number" ? total : parseFloat(String(total));
    const validatedSubtotal = typeof subtotal === "number" ? subtotal : parseFloat(String(subtotal));
    const validatedShipping = typeof shipping === "number" ? shipping : parseFloat(String(shipping));
    const validatedTax = typeof tax === "number" ? tax : parseFloat(String(tax));

    if (isNaN(validatedTotal) || isNaN(validatedSubtotal) || isNaN(validatedShipping) || isNaN(validatedTax)) {
      return NextResponse.json(
        { error: "Invalid numeric values in order data" },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: "Invalid item structure: productId, quantity, and price are required" },
          { status: 400 }
        );
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Item quantity must be a positive number" },
          { status: 400 }
        );
      }
      if (typeof item.price !== "number" || item.price < 0) {
        return NextResponse.json(
          { error: "Item price must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    // Generate order number
    const orderNumber = `ISHK-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        status: "PENDING",
        total: validatedTotal,
        subtotal: validatedSubtotal,
        shipping: validatedShipping,
        tax: validatedTax,
        shippingAddress: shippingAddress as Record<string, unknown>,
        billingAddress: billingAddress as Record<string, unknown>,
        paymentIntentId: paymentIntentId || null,
        orderItems: {
          create: items.map((item: {
            productId: string;
            quantity: number;
            price: number;
            size?: string;
            color?: string;
          }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            color: item.color || null,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear cart after order creation
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ order });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating order:", error);
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

