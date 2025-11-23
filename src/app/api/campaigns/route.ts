import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public campaigns listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const category = searchParams.get("category");
    
    const where: any = {};
    
    if (active === "true") {
      where.isActive = true;
    }
    
    if (category) {
      where.category = category;
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: [
        { isActive: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}


