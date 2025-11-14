import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

