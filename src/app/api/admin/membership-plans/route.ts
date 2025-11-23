import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch all membership plans
export async function GET(request: NextRequest) {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Super admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const featured = searchParams.get("featured");

    const where: any = {};
    if (isActive !== null) where.isActive = isActive === "true";
    if (featured === "true") where.featured = true;

    const plans = await prisma.membershipPlan.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { monthlyPrice: "asc" },
      ],
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch membership plans" },
      { status: 500 }
    );
  }
}

// POST - Create new membership plan
export async function POST(request: NextRequest) {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Super admin access required" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

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

    // Validate required fields
    if (!name || !slug || monthlyPrice === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, and monthlyPrice are required" },
        { status: 400 }
      );
    }

    // Validate and parse numeric values
    const validatedMonthlyPrice = typeof monthlyPrice === "number" ? monthlyPrice : parseFloat(String(monthlyPrice));
    if (isNaN(validatedMonthlyPrice) || validatedMonthlyPrice < 0) {
      return NextResponse.json(
        { error: "Monthly price must be a positive number" },
        { status: 400 }
      );
    }

    const validatedMaxBookings = maxBookings ? parseInt(String(maxBookings)) : 0;
    const validatedPriorityLevel = priorityLevel ? parseInt(String(priorityLevel)) : 0;

    // Validate features
    let validatedFeatures = [];
    if (features) {
      if (Array.isArray(features)) {
        validatedFeatures = features;
      } else {
        return NextResponse.json(
          { error: "Features must be an array" },
          { status: 400 }
        );
      }
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name: String(name).trim(),
        slug: String(slug).trim().toLowerCase(),
        description: description || "",
        monthlyPrice: validatedMonthlyPrice,
        currency: currency || "EUR",
        features: validatedFeatures,
        maxBookings: validatedMaxBookings,
        priorityLevel: validatedPriorityLevel,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        featured: Boolean(featured),
        order: order ? parseInt(String(order)) : 0,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating membership plan:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: `Membership plan with this slug already exists: ${error.meta?.target}` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}`, code: error.code },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create membership plan" },
      { status: 500 }
    );
  }
}


