import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, summary, region, topics, sourceUrl } = await request.json();

    const newsBrief = await prisma.newsBrief.update({
      where: { id: params.id },
      data: {
        title,
        summary,
        region,
        topics: topics || [],
        sourceUrl,
      },
    });

    return NextResponse.json(newsBrief);
  } catch (error) {
    console.error("Error updating news brief:", error);
    return NextResponse.json(
      { error: "Failed to update news brief" },
      { status: 500 }
    );
  }
}

