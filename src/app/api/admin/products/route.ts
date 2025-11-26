import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch all products
export async function GET() {
  try {
    // Require boutique admin access
    const session = await requireSectionAccess("boutique");
    if (!session) {
      console.error("❌ Products API: Unauthorized - No session or insufficient permissions");
      return NextResponse.json(
        { error: "Unauthorized: Boutique admin access required" },
        { status: 401 }
      );
    }
    
    console.log("✅ Products API: Authorized, fetching products...");
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Products API: Found ${products.length} products`);
    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error("❌ Products API Error:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return NextResponse.json(
      { 
        error: "Failed to fetch products",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    // Require boutique admin access
    const session = await requireSectionAccess("boutique");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Boutique admin access required" },
        { status: 401 }
      );
    }
    
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
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
      comparePrice,
      category,
      isIshkOriginal,
      images,
      videos,
      inStock,
      stockCount,
      badge,
      featured,
    } = body;

    // Validate required fields
    if (!name || !slug || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, price, and category are required" },
        { status: 400 }
      );
    }

    // Validate and parse numeric values
    const validatedPrice = typeof price === "number" ? price : parseFloat(String(price));
    if (isNaN(validatedPrice) || validatedPrice < 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }

    const validatedComparePrice = comparePrice 
      ? (typeof comparePrice === "number" ? comparePrice : parseFloat(String(comparePrice)))
      : null;
    if (validatedComparePrice !== null && (isNaN(validatedComparePrice) || validatedComparePrice < 0)) {
      return NextResponse.json(
        { error: "Compare price must be a valid positive number" },
        { status: 400 }
      );
    }

    const validatedStockCount = stockCount 
      ? (typeof stockCount === "number" ? stockCount : parseInt(String(stockCount), 10))
      : 0;
    if (isNaN(validatedStockCount) || validatedStockCount < 0) {
      return NextResponse.json(
        { error: "Stock count must be a valid non-negative integer" },
        { status: 400 }
      );
    }

    // Validate images array (min 1, max 10)
    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Images must be an array" },
        { status: 400 }
      );
    }
    if (images.length < 1) {
      return NextResponse.json(
        { error: "At least 1 image is required" },
        { status: 400 }
      );
    }
    if (images.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    // Validate videos array (max 2)
    if (videos && !Array.isArray(videos)) {
      return NextResponse.json(
        { error: "Videos must be an array" },
        { status: 400 }
      );
    }
    if (videos && videos.length > 2) {
      return NextResponse.json(
        { error: "Maximum 2 videos allowed" },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric, hyphens, underscores)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    console.log("Creating product with data:", {
      name: String(name).trim(),
      slug: String(slug).trim().toLowerCase(),
      imagesCount: Array.isArray(images) ? images.length : 0,
      videosCount: videos && Array.isArray(videos) ? videos.length : 0,
      price: validatedPrice,
      comparePrice: validatedComparePrice,
    });

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        slug: String(slug).trim().toLowerCase(),
        description: description ? String(description).trim() : "",
        price: validatedPrice,
        comparePrice: validatedComparePrice,
        category: String(category).trim(),
        isIshkOriginal: Boolean(isIshkOriginal),
        images: images,
        videos: videos && videos.length > 0 ? videos : null,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        stockCount: validatedStockCount,
        badge: badge ? String(badge).trim() : null,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[]) || [];
        const field = target[0] || "field";
        return NextResponse.json(
          { error: `Product with this ${field} already exists` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}`, code: error.code },
        { status: 400 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: "Validation error: Invalid data provided" },
        { status: 400 }
      );
    }
    
    // Extract error message
    let errorMessage = "Failed to create product";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }
    
    // Return error with details (but don't expose sensitive info in production)
    const errorResponse: any = { error: errorMessage };
    if (process.env.NODE_ENV === "development") {
      errorResponse.details = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : String(error);
    }
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

