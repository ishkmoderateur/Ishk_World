import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch single membership plan by ID
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
    const plan = await prisma.membershipPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Membership plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching membership plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch membership plan" },
      { status: 500 }
    );
  }
}

// PUT - Update membership plan
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
      monthlyPrice,
      currency,
      features,
      maxBookings,
      priorityLevel,
      isActive,
      featured,
      order,
    } = body;

    const updateData: Prisma.MembershipPlanUpdateInput = {};
    
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
    if (monthlyPrice !== undefined) {
      const validatedMonthlyPrice = typeof monthlyPrice === "number" ? monthlyPrice : parseFloat(String(monthlyPrice));
      if (isNaN(validatedMonthlyPrice) || validatedMonthlyPrice < 0) {
        return NextResponse.json(
          { error: "Monthly price must be a positive number" },
          { status: 400 }
        );
      }
      updateData.monthlyPrice = validatedMonthlyPrice;
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
    if (maxBookings !== undefined) updateData.maxBookings = parseInt(String(maxBookings)) || 0;
    if (priorityLevel !== undefined) updateData.priorityLevel = parseInt(String(priorityLevel)) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (order !== undefined) updateData.order = parseInt(String(order)) || 0;

    const plan = await prisma.membershipPlan.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("Error updating membership plan:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Membership plan not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Membership plan with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update membership plan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete membership plan
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

    await prisma.membershipPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting membership plan:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Membership plan not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete membership plan" },
      { status: 500 }
    );
  }
}


