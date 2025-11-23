import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all donations
export async function GET(request: NextRequest) {
  try {
    // Require association admin access
    const session = await requireSectionAccess("association");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Association admin access required" },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (campaignId) {
      where.campaignId = campaignId;
    }
    if (userId) {
      where.userId = userId;
    }

    const donations = await prisma.donation.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

// POST - Create new donation (admin can create donations manually)
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
      userId,
      campaignId,
      amount,
      currency,
      anonymous,
      message,
      images,
      videos,
    } = body;

    // Validate required fields
    if (!campaignId || !amount) {
      return NextResponse.json(
        { error: "Campaign ID and amount are required" },
        { status: 400 }
      );
    }

    // Validate campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Validate user exists if provided
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
    }

    // Validate amount
    const validatedAmount = parseFloat(String(amount));
    if (isNaN(validatedAmount) || validatedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Validate images and videos
    if (images && Array.isArray(images)) {
      if (images.length > 10) {
        return NextResponse.json(
          { error: "Maximum 10 images allowed" },
          { status: 400 }
        );
      }
    }
    if (videos && Array.isArray(videos)) {
      if (videos.length > 2) {
        return NextResponse.json(
          { error: "Maximum 2 videos allowed" },
          { status: 400 }
        );
      }
    }

    // Create donation
    const donation = await prisma.donation.create({
      data: {
        userId: userId || null,
        campaignId,
        amount: validatedAmount,
        currency: currency || "EUR",
        anonymous: anonymous || false,
        message: message || null,
        images: images || null,
        videos: videos || null,
      },
      include: {
        campaign: {
          select: {
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Update campaign raised amount
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        raised: {
          increment: validatedAmount,
        },
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating donation:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid campaign or user ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 }
    );
  }
}




