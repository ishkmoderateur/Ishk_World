import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

// GET - Fetch single donation by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("association");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Association admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            slug: true,
            goal: true,
            raised: true,
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
    });

    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(donation);
  } catch (error) {
    console.error("Error fetching donation:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation" },
      { status: 500 }
    );
  }
}

// PUT - Update donation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("association");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Association admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    // Check if donation exists
    const existingDonation = await prisma.donation.findUnique({
      where: { id },
    });

    if (!existingDonation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (userId !== undefined) updateData.userId = userId || null;
    if (campaignId !== undefined) {
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
      updateData.campaignId = campaignId;
    }
    if (amount !== undefined) {
      const validatedAmount = parseFloat(String(amount));
      if (isNaN(validatedAmount) || validatedAmount <= 0) {
        return NextResponse.json(
          { error: "Amount must be a positive number" },
          { status: 400 }
        );
      }
      updateData.amount = validatedAmount;
    }
    if (currency !== undefined) updateData.currency = currency;
    if (anonymous !== undefined) updateData.anonymous = anonymous;
    if (message !== undefined) updateData.message = message || null;
    if (images !== undefined) {
      if (Array.isArray(images) && images.length > 10) {
        return NextResponse.json(
          { error: "Maximum 10 images allowed" },
          { status: 400 }
        );
      }
      updateData.images = images || null;
    }
    if (videos !== undefined) {
      if (Array.isArray(videos) && videos.length > 2) {
        return NextResponse.json(
          { error: "Maximum 2 videos allowed" },
          { status: 400 }
        );
      }
      updateData.videos = videos || null;
    }

    // If amount or campaign changed, update campaign raised amount
    if (amount !== undefined || campaignId !== undefined) {
      const oldAmount = existingDonation.amount;
      const newAmount = amount !== undefined ? parseFloat(String(amount)) : oldAmount;
      const oldCampaignId = existingDonation.campaignId;
      const newCampaignId = campaignId || oldCampaignId;

      // Decrement old campaign
      if (oldCampaignId) {
        await prisma.campaign.update({
          where: { id: oldCampaignId },
          data: {
            raised: {
              decrement: oldAmount,
            },
          },
        });
      }

      // Increment new campaign
      await prisma.campaign.update({
        where: { id: newCampaignId },
        data: {
          raised: {
            increment: newAmount,
          },
        },
      });
    }

    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedDonation);
  } catch (error: any) {
    console.error("Error updating donation:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid campaign or user ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update donation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete donation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("association");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Association admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get donation before deleting to update campaign
    const donation = await prisma.donation.findUnique({
      where: { id },
    });

    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    // Delete donation
    await prisma.donation.delete({
      where: { id },
    });

    // Update campaign raised amount (decrement)
    await prisma.campaign.update({
      where: { id: donation.campaignId },
      data: {
        raised: {
          decrement: donation.amount,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting donation:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete donation" },
      { status: 500 }
    );
  }
}








