import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const newsBriefs = await prisma.newsBrief.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        savedAt: "desc",
      },
    });

    return NextResponse.json(newsBriefs);
  } catch (error) {
    console.error("Error fetching news briefs:", error);
    return NextResponse.json(
      { error: "Failed to fetch news briefs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, summary, region, topics, sourceUrl, userId } =
      await request.json();

    const newsBrief = await prisma.newsBrief.create({
      data: {
        title,
        summary,
        region,
        topics: topics || [],
        sourceUrl,
        userId: userId || null,
      },
    });

    return NextResponse.json(newsBrief);
  } catch (error) {
    console.error("Error creating news brief:", error);
    return NextResponse.json(
      { error: "Failed to create news brief" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "News brief ID is required" },
        { status: 400 }
      );
    }

    await prisma.newsBrief.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news brief:", error);
    return NextResponse.json(
      { error: "Failed to delete news brief" },
      { status: 500 }
    );
  }
}

