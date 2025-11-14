import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photo = await prisma.photography.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const { title, category, image, description, featured, order } =
      await request.json();

    const photo = await prisma.photography.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.photography.delete({
      where: { id: params.id },
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

