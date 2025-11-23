import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public photography services listing
export async function GET(request: NextRequest) {
  try {
    const services = await prisma.photographyService.findMany({
      orderBy: [
        { featured: "desc" },
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


