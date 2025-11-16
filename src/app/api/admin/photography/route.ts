import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Require photography admin access
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }
    const photos = await prisma.photography.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photography:", error);
    return NextResponse.json(
      { error: "Failed to fetch photography" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require photography admin access
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }
    const { title, category, image, description, featured, order } =
      await request.json();

    const photo = await prisma.photography.create({
      data: {
        title,
        category,
        image,
        description,
        featured: featured || false,
        order: order || 0,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error creating photography:", error);
    return NextResponse.json(
      { error: "Failed to create photography" },
      { status: 500 }
    );
  }
}




