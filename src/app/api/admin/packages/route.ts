import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch all packages
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
    const isVisible = searchParams.get("isVisible");
    const isActive = searchParams.get("isActive");
    const featured = searchParams.get("featured");

    const where: any = {};
    if (isVisible !== null) where.isVisible = isVisible === "true";
    if (isActive !== null) where.isActive = isActive === "true";
    if (featured === "true") where.featured = true;

    const packages = await prisma.package.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// POST - Create new package
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

    // Validate required fields
    if (!title || !slug || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, and price are required" },
        { status: 400 }
      );
    }

    // Validate and parse numeric values
    const validatedPrice = typeof price === "number" ? price : parseFloat(String(price));
    if (isNaN(validatedPrice) || validatedPrice < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    const validatedCredits = credits ? parseInt(String(credits)) : 0;
    const validatedBonusCredits = bonusCredits ? parseInt(String(bonusCredits)) : 0;

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

    const packageData = await prisma.package.create({
      data: {
        title: String(title).trim(),
        slug: String(slug).trim().toLowerCase(),
        description: description || "",
        price: validatedPrice,
        currency: currency || "EUR",
        credits: validatedCredits,
        bonusCredits: validatedBonusCredits,
        features: validatedFeatures,
        image: image || null,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        featured: Boolean(featured),
        order: order ? parseInt(String(order)) : 0,
      },
    });

    return NextResponse.json(packageData, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating package:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: `Package with this slug already exists: ${error.meta?.target}` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}`, code: error.code },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}


