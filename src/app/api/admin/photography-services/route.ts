import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch all photography services
export async function GET(request: NextRequest) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      console.error("❌ Photography Services API: Unauthorized - No session or insufficient permissions");
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

    console.log("✅ Photography Services API: Authorized, fetching services...");
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const where: any = {};
    if (featured === "true") where.featured = true;

    const services = await prisma.photographyService.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    console.log(`✅ Photography Services API: Found ${services.length} services`);
    return NextResponse.json(services);
  } catch (error) {
    console.error("❌ Photography Services API Error:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return NextResponse.json(
      { 
        error: "Failed to fetch photography services",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new photography service
export async function POST(request: NextRequest) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
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
      duration,
      price,
      comparePrice,
      features,
      image,
      featured,
      order,
    } = body;

    // Validate required fields
    if (!name || !slug || !description || !duration) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, description, and duration are required" },
        { status: 400 }
      );
    }

    // Validate and parse numeric values
    let validatedPrice = null;
    if (price !== undefined && price !== null) {
      validatedPrice = typeof price === "number" ? price : parseFloat(String(price));
      if (isNaN(validatedPrice) || validatedPrice < 0) {
        return NextResponse.json(
          { error: "Price must be a positive number" },
          { status: 400 }
        );
      }
    }

    let validatedComparePrice = null;
    if (comparePrice !== undefined && comparePrice !== null) {
      validatedComparePrice = typeof comparePrice === "number" ? comparePrice : parseFloat(String(comparePrice));
      if (isNaN(validatedComparePrice) || validatedComparePrice < 0) {
        return NextResponse.json(
          { error: "Compare price must be a positive number" },
          { status: 400 }
        );
      }
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

    const service = await prisma.photographyService.create({
      data: {
        name: String(name).trim(),
        slug: String(slug).trim().toLowerCase(),
        description: String(description).trim(),
        duration: String(duration).trim(),
        price: validatedPrice,
        comparePrice: validatedComparePrice,
        features: validatedFeatures,
        image: image || null,
        featured: Boolean(featured),
        order: order ? parseInt(String(order)) : 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating photography service:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: `Photography service with this slug already exists: ${error.meta?.target}` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}`, code: error.code },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create photography service" },
      { status: 500 }
    );
  }
}













