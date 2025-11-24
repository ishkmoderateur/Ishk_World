import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public photography services listing
export async function GET(request: NextRequest) {
  try {
    console.log("📸 Fetching photography services from database...");
    const services = await prisma.photographyService.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { featured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    console.log(`✅ Found ${services.length} active photography services`);
    return NextResponse.json(services);
  } catch (error) {
    console.error("❌ Error fetching photography services:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography services" },
      { status: 500 }
    );
  }
}


