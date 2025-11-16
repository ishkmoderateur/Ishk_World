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
  } catch (error) {
    console.error("Error fetching products:", error);
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
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || "",
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        category,
        isIshkOriginal: isIshkOriginal || false,
        images: images || [],
        inStock: inStock !== undefined ? inStock : true,
        stockCount: stockCount ? parseInt(stockCount) : 0,
        badge: badge || null,
        featured: featured || false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

