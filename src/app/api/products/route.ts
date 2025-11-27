import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public product listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const isIshkOriginal = searchParams.get("isIshkOriginal");
    
    const where: {
      category?: string;
      featured?: boolean;
      isIshkOriginal?: boolean;
    } = {};
    
    // Sanitize and validate category input
    if (category && category !== "all") {
      // Only allow alphanumeric, spaces, hyphens, and ampersands
      const sanitizedCategory = category.trim().replace(/[^a-zA-Z0-9\s\-&]/g, "");
      if (sanitizedCategory.length > 0 && sanitizedCategory.length <= 100) {
        where.category = sanitizedCategory;
      }
    }
    
    // Validate featured parameter
    if (featured === "true") {
      where.featured = true;
    } else if (featured === "false") {
      where.featured = false;
    }
    
    // Handle isIshkOriginal parameter
    if (isIshkOriginal === "true") {
      where.isIshkOriginal = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch products",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

