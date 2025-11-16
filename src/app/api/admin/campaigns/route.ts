import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all campaigns
export async function GET() {
  try {
    // Require association admin access
    const session = await requireSectionAccess("association");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Association admin access required" },
        { status: 401 }
      );
    }
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
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

// POST - Create new campaign
export async function POST(request: NextRequest) {
  try {
    // Require association admin access
    const session = await requireSectionAccess("association");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Association admin access required" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const {
      title,
      slug,
      description,
      category,
      goal,
      image,
      impact,
      isActive,
    } = body;

    if (!title || !slug || !category || !goal) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        slug,
        description: description || "",
        category,
        goal: parseFloat(goal),
        raised: 0,
        image: image || null,
        impact: impact || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Campaign with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}




