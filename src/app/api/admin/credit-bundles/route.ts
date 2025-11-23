import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch all credit bundles
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

    const bundles = await prisma.creditBundle.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { price: "asc" },
      ],
    });

    return NextResponse.json(bundles);
  } catch (error) {
    console.error("Error fetching credit bundles:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit bundles" },
      { status: 500 }
    );
  }
}

// POST - Create new credit bundle
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
      credits,
      price,
      currency,
      bonusCredits,
      isActive,
      featured,
      order,
    } = body;

    // Validate required fields
    if (!name || !slug || credits === undefined || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, credits, and price are required" },
        { status: 400 }
      );
    }

    // Validate and parse numeric values
    const validatedCredits = parseInt(String(credits));
    if (isNaN(validatedCredits) || validatedCredits <= 0) {
      return NextResponse.json(
        { error: "Credits must be a positive integer" },
        { status: 400 }
      );
    }

    const validatedPrice = typeof price === "number" ? price : parseFloat(String(price));
    if (isNaN(validatedPrice) || validatedPrice < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    const validatedBonusCredits = bonusCredits ? parseInt(String(bonusCredits)) : 0;

    const bundle = await prisma.creditBundle.create({
      data: {
        name: String(name).trim(),
        slug: String(slug).trim().toLowerCase(),
        description: description || "",
        credits: validatedCredits,
        price: validatedPrice,
        currency: currency || "EUR",
        bonusCredits: validatedBonusCredits,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        featured: Boolean(featured),
        order: order ? parseInt(String(order)) : 0,
      },
    });

    return NextResponse.json(bundle, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating credit bundle:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: `Credit bundle with this slug already exists: ${error.meta?.target}` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}`, code: error.code },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create credit bundle" },
      { status: 500 }
    );
  }
}


