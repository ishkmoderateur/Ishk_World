import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch all party services
export async function GET(request: NextRequest) {
  try {
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const isActive = searchParams.get("isActive");

    const where: any = {};
    if (featured === "true") where.featured = true;
    if (isActive !== null) where.isActive = isActive === "true";

    const services = await prisma.partyService.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching party services:", error);
    return NextResponse.json(
      { error: "Failed to fetch party services" },
      { status: 500 }
    );
  }
}

// POST - Create new party service
export async function POST(request: NextRequest) {
  try {
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
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
      price,
      currency,
      features,
      image,
      featured,
      isActive,
      order,
    } = body;

    // Validate required fields
    if (!name || !slug || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, and price are required" },
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

    const service = await prisma.partyService.create({
      data: {
        name: String(name).trim(),
        slug: String(slug).trim().toLowerCase(),
        description: description ? String(description).trim() : "",
        price: validatedPrice,
        currency: currency || "EUR",
        features: validatedFeatures,
        image: image || null,
        featured: Boolean(featured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        order: order ? parseInt(String(order)) : 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating party service:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: `Party service with this slug already exists: ${error.meta?.target}` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}`, code: error.code },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create party service" },
      { status: 500 }
    );
  }
}









