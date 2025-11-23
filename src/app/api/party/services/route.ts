import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public party services listing
export async function GET(request: NextRequest) {
  try {
    const services = await prisma.partyService.findMany({
      orderBy: [
        { featured: "desc" },
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


