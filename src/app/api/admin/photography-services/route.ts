import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch all photography services
export async function GET(request: NextRequest) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

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

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching photography services:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography services" },
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


