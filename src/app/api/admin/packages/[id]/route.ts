import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch single package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Super admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const packageData = await prisma.package.findUnique({
      where: { id },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(packageData);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

// PUT - Update package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Super admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      slug,
      description,
      price,
      currency,
      credits,
      bonusCredits,
      features,
      image,
      isVisible,
      isActive,
      featured,
      order,
    } = body;

    const updateData: Prisma.PackageUpdateInput = {};
    
    if (title !== undefined) updateData.title = String(title).trim();
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
          { error: "Price must be a positive number" },
          { status: 400 }
        );
      }
      updateData.price = validatedPrice;
    }
    if (currency !== undefined) updateData.currency = currency;
    if (credits !== undefined) updateData.credits = parseInt(String(credits)) || 0;
    if (bonusCredits !== undefined) updateData.bonusCredits = parseInt(String(bonusCredits)) || 0;
    if (features !== undefined) {
      if (Array.isArray(features)) {
        updateData.features = features;
      } else {
        return NextResponse.json(
          { error: "Features must be an array" },
          { status: 400 }
        );
      }
    }
    if (image !== undefined) updateData.image = image || null;
    if (isVisible !== undefined) updateData.isVisible = Boolean(isVisible);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (order !== undefined) updateData.order = parseInt(String(order)) || 0;

    const packageData = await prisma.package.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(packageData);
  } catch (error: any) {
    console.error("Error updating package:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Package with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

// DELETE - Delete package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Super admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting package:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}


