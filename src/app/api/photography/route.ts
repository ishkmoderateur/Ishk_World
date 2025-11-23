import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public photography portfolio listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    
    const where: any = {};
    
    if (category && category !== "all") {
      where.category = category;
    }
    
    if (featured === "true") {
      where.featured = true;
    }

    const photos = await prisma.photography.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photography:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography portfolio" },
      { status: 500 }
    );
  }
}


