import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all products
export async function GET() {
  try {
    // Require boutique admin access
    const session = await requireSectionAccess("boutique");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Boutique admin access required" },
        { status: 401 }
      );
    }
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching products:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      comparePrice,
      category,
      isIshkOriginal,
      images,
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

    // Validate images array
    if (images && !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Images must be an array" },
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

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        slug: String(slug).trim().toLowerCase(),
        description: description ? String(description).trim() : "",
        price: validatedPrice,
        comparePrice: validatedComparePrice,
        category: String(category).trim(),
        isIshkOriginal: Boolean(isIshkOriginal),
        images: Array.isArray(images) ? images : [],
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        stockCount: validatedStockCount,
        badge: badge ? String(badge).trim() : null,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating product:", error);
    }
    
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Product with this slug already exists" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

