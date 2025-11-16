import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Require party admin access
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }
    const inquiries = await prisma.venueInquiry.findMany({
      include: {
        venue: {
          select: {
            name: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Require party admin access
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }
    const { id, status } = await request.json();

    const inquiry = await prisma.venueInquiry.update({
      where: { id },
      data: {
        status,
        respondedAt: status !== "NEW" ? new Date() : null,
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Require party admin access
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    await prisma.venueInquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}




