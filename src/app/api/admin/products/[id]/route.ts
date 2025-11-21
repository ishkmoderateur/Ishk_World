import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require boutique admin access
    const session = await requireSectionAccess("boutique");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Boutique admin access required" },
        { status: 401 }
      );
    }
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching product:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require boutique admin access
    const session = await requireSectionAccess("boutique");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Boutique admin access required" },
        { status: 401 }
      );
    }
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      comparePrice,
      category,
      isIshkOriginal,
      images,
      inStock,
      stockCount,
      badge,
      featured,
    } = body;

    const updateData: Prisma.ProductUpdateInput = {};
    
    if (name !== undefined) updateData.name = String(name).trim();
    if (slug !== undefined) {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(String(slug))) {
        return NextResponse.json(
          { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }
      updateData.slug = String(slug).trim().toLowerCase();
    }
    if (description !== undefined) updateData.description = String(description).trim();
    if (price !== undefined) {
      const validatedPrice = typeof price === "number" ? price : parseFloat(String(price));
      if (isNaN(validatedPrice) || validatedPrice < 0) {
        return NextResponse.json(
          { error: "Price must be a valid positive number" },
          { status: 400 }
        );
      }
      updateData.price = validatedPrice;
    }
    if (comparePrice !== undefined) {
      if (comparePrice === null) {
        updateData.comparePrice = null;
      } else {
        const validatedComparePrice = typeof comparePrice === "number" ? comparePrice : parseFloat(String(comparePrice));
        if (isNaN(validatedComparePrice) || validatedComparePrice < 0) {
          return NextResponse.json(
            { error: "Compare price must be a valid positive number" },
            { status: 400 }
          );
        }
        updateData.comparePrice = validatedComparePrice;
      }
    }
    if (category !== undefined) updateData.category = String(category).trim();
    if (isIshkOriginal !== undefined) updateData.isIshkOriginal = Boolean(isIshkOriginal);
    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return NextResponse.json(
          { error: "Images must be an array" },
          { status: 400 }
        );
      }
      // Ensure images array is properly typed for Prisma Json field
      // Use type assertion to satisfy TypeScript's strict type checking
      (updateData as any).images = images;
    }
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (stockCount !== undefined) {
      const validatedStockCount = typeof stockCount === "number" ? stockCount : parseInt(String(stockCount), 10);
      if (isNaN(validatedStockCount) || validatedStockCount < 0) {
        return NextResponse.json(
          { error: "Stock count must be a valid non-negative integer" },
          { status: 400 }
        );
      }
      updateData.stockCount = validatedStockCount;
    }
    if (badge !== undefined) updateData.badge = badge ? String(badge).trim() : null;
    if (featured !== undefined) updateData.featured = Boolean(featured);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating product:", error);
    }
    
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Product with this slug already exists" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require boutique admin access
    const session = await requireSectionAccess("boutique");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Boutique admin access required" },
        { status: 401 }
      );
    }
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting product:", error);
    }
    
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

