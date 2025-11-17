import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require association admin access
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
      title,
      slug,
      description,
      category,
      goal,
      image,
      impact,
      isActive,
    } = body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (goal !== undefined) updateData.goal = parseFloat(goal);
    if (image !== undefined) updateData.image = image;
    if (impact !== undefined) updateData.impact = impact;
    if (isActive !== undefined) updateData.isActive = isActive;

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error("Error updating campaign:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require association admin access
    const session = await requireSectionAccess("association");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Association admin access required" },
        { status: 401 }
      );
    }
    const { id } = await params;
    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting campaign:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}




