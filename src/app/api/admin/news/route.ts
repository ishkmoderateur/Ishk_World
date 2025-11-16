import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Require news admin access
    const session = await requireSectionAccess("news");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: News admin access required" },
        { status: 401 }
      );
    }
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
    // Require news admin access
    const session = await requireSectionAccess("news");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: News admin access required" },
        { status: 401 }
      );
    }
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
    // Require news admin access
    const session = await requireSectionAccess("news");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: News admin access required" },
        { status: 401 }
      );
    }
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




