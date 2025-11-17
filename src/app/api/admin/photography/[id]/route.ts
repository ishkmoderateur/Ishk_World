import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require photography admin access
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }
    const { id } = await params;
    const photo = await prisma.photography.findUnique({
      where: { id },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Photography not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error fetching photography:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require photography admin access
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }
    const { id } = await params;
    const { title, category, image, description, featured, order } =
      await request.json();

    const photo = await prisma.photography.update({
      where: { id },
      data: {
        title,
        category,
        image,
        description,
        featured,
        order,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error updating photography:", error);
    return NextResponse.json(
      { error: "Failed to update photography" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require photography admin access
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }
    const { id } = await params;
    await prisma.photography.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photography:", error);
    return NextResponse.json(
      { error: "Failed to delete photography" },
      { status: 500 }
    );
  }
}




