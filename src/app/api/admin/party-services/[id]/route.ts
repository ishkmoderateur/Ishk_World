import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch single party service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const service = await prisma.partyService.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Party service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching party service:", error);
    return NextResponse.json(
      { error: "Failed to fetch party service" },
      { status: 500 }
    );
  }
}

// PUT - Update party service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
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
      currency,
      features,
      image,
      featured,
      isActive,
      order,
    } = body;

    const updateData: Prisma.PartyServiceUpdateInput = {};
    
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
          { error: "Price must be a positive number" },
          { status: 400 }
        );
      }
      updateData.price = validatedPrice;
    }
    if (currency !== undefined) updateData.currency = currency;
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
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (order !== undefined) updateData.order = parseInt(String(order)) || 0;

    const service = await prisma.partyService.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(service);
  } catch (error: any) {
    console.error("Error updating party service:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Party service not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Party service with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update party service" },
      { status: 500 }
    );
  }
}

// DELETE - Delete party service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.partyService.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting party service:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Party service not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete party service" },
      { status: 500 }
    );
  }
}













