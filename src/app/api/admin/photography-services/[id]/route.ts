import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch single photography service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const service = await prisma.photographyService.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Photography service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching photography service:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography service" },
      { status: 500 }
    );
  }
}

// PUT - Update photography service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      duration,
      price,
      comparePrice,
      features,
      image,
      featured,
      order,
    } = body;

    const updateData: Prisma.PhotographyServiceUpdateInput = {};
    
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
    if (duration !== undefined) updateData.duration = String(duration).trim();
    if (price !== undefined) {
      if (price === null) {
        updateData.price = null;
      } else {
        const validatedPrice = typeof price === "number" ? price : parseFloat(String(price));
        if (isNaN(validatedPrice) || validatedPrice < 0) {
          return NextResponse.json(
            { error: "Price must be a positive number" },
            { status: 400 }
          );
        }
        updateData.price = validatedPrice;
      }
    }
    if (comparePrice !== undefined) {
      if (comparePrice === null) {
        updateData.comparePrice = null;
      } else {
        const validatedComparePrice = typeof comparePrice === "number" ? comparePrice : parseFloat(String(comparePrice));
        if (isNaN(validatedComparePrice) || validatedComparePrice < 0) {
          return NextResponse.json(
            { error: "Compare price must be a positive number" },
            { status: 400 }
          );
        }
        updateData.comparePrice = validatedComparePrice;
      }
    }
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
    if (order !== undefined) updateData.order = parseInt(String(order)) || 0;

    const service = await prisma.photographyService.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(service);
  } catch (error: any) {
    console.error("Error updating photography service:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Photography service not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Photography service with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update photography service" },
      { status: 500 }
    );
  }
}

// DELETE - Delete photography service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.photographyService.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting photography service:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Photography service not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete photography service" },
      { status: 500 }
    );
  }
}









