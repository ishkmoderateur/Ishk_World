import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

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
  } catch (error) {
    console.error("Error fetching product:", error);
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

    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
    if (category) updateData.category = category;
    if (isIshkOriginal !== undefined) updateData.isIshkOriginal = isIshkOriginal;
    if (images !== undefined) updateData.images = images;
    if (inStock !== undefined) updateData.inStock = inStock;
    if (stockCount !== undefined) updateData.stockCount = parseInt(stockCount);
    if (badge !== undefined) updateData.badge = badge || null;
    if (featured !== undefined) updateData.featured = featured;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
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
  } catch (error: any) {
    console.error("Error deleting product:", error);
    if (error.code === "P2025") {
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

