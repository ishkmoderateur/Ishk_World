import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { validateInteger, validateRequired } from "@/lib/validation";

// POST - Add item to cart
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
    const { productId, quantity = 1, size, color } = body;

    // Validate required fields
    const requiredValidation = validateRequired(body, ["productId"]);
    if (!requiredValidation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredValidation.missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, inStock: true, stockCount: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.inStock) {
      return NextResponse.json(
        { error: "Product is out of stock" },
        { status: 400 }
      );
    }

    // Validate quantity
    const validatedQuantity = validateInteger(quantity, { min: 1, max: 100, required: true });
    if (validatedQuantity === null) {
      return NextResponse.json(
        { error: "Quantity must be a valid number between 1 and 100" },
        { status: 400 }
      );
    }

    // Check stock availability
    if (product.stockCount > 0 && validatedQuantity > product.stockCount) {
      return NextResponse.json(
        { error: `Only ${product.stockCount} items available in stock` },
        { status: 400 }
      );
    }

    // Check if item already exists
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId_size_color: {
          userId: session.user.id,
          productId,
          size: size || "",
          color: color || "",
        },
      },
    });

    let cartItem;
    if (existing) {
      // Calculate new quantity
      const newQuantity = existing.quantity + validatedQuantity;
      
      // Check stock for updated quantity
      if (product.stockCount > 0 && newQuantity > product.stockCount) {
        return NextResponse.json(
          { error: `Cannot add more items. Only ${product.stockCount} available in stock` },
          { status: 400 }
        );
      }

      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity: validatedQuantity,
          size: size || null,
          color: color || null,
        },
      });
    }

    return NextResponse.json({ success: true, item: cartItem });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error adding to cart:", error);
    }
    
    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Item already in cart" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // Verify item exists and belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      select: { userId: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error removing from cart:", error);
    }
    
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

// PATCH - Update item quantity
export async function PATCH(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    // Validate required fields
    const requiredValidation = validateRequired(body, ["itemId", "quantity"]);
    if (!requiredValidation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredValidation.missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate quantity
    const validatedQuantity = validateInteger(quantity, { min: 0, max: 100 });
    if (validatedQuantity === null) {
      return NextResponse.json(
        { error: "Quantity must be a valid number between 0 and 100" },
        { status: 400 }
      );
    }

    // Verify item exists and belongs to user
    const existingItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        product: {
          select: {
            inStock: true,
            stockCount: true,
          },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (existingItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (validatedQuantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ success: true });
    }

    // Check stock availability
    if (existingItem.product.stockCount > 0 && validatedQuantity > existingItem.product.stockCount) {
      return NextResponse.json(
        { error: `Only ${existingItem.product.stockCount} items available in stock` },
        { status: 400 }
      );
    }

    if (!existingItem.product.inStock) {
      return NextResponse.json(
        { error: "Product is out of stock" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: validatedQuantity },
    });

    return NextResponse.json({ success: true, item: cartItem });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating cart item:", error);
    }
    
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Cart item not found" },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

