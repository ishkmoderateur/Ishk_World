import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch single credit bundle by ID
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
    const bundle = await prisma.creditBundle.findUnique({
      where: { id },
    });

    if (!bundle) {
      return NextResponse.json(
        { error: "Credit bundle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bundle);
  } catch (error) {
    console.error("Error fetching credit bundle:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit bundle" },
      { status: 500 }
    );
  }
}

// PUT - Update credit bundle
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
      name,
      slug,
      description,
      credits,
      price,
      currency,
      bonusCredits,
      isActive,
      featured,
      order,
    } = body;

    const updateData: Prisma.CreditBundleUpdateInput = {};
    
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
    if (credits !== undefined) {
      const validatedCredits = parseInt(String(credits));
      if (isNaN(validatedCredits) || validatedCredits <= 0) {
        return NextResponse.json(
          { error: "Credits must be a positive integer" },
          { status: 400 }
        );
      }
      updateData.credits = validatedCredits;
    }
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
    if (bonusCredits !== undefined) updateData.bonusCredits = parseInt(String(bonusCredits)) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (order !== undefined) updateData.order = parseInt(String(order)) || 0;

    const bundle = await prisma.creditBundle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(bundle);
  } catch (error: any) {
    console.error("Error updating credit bundle:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Credit bundle not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Credit bundle with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update credit bundle" },
      { status: 500 }
    );
  }
}

// DELETE - Delete credit bundle
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

    await prisma.creditBundle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting credit bundle:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Credit bundle not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete credit bundle" },
      { status: 500 }
    );
  }
}


