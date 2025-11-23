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
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching inquiries:", error);
    }
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
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["NEW", "CONTACTED", "QUOTED", "BOOKED", "DECLINED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.venueInquiry.update({
      where: { id },
      data: {
        status,
        respondedAt: status !== "NEW" ? new Date() : null,
      },
    });

    return NextResponse.json(inquiry);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating inquiry:", error);
    }
    
    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Inquiry not found" },
          { status: 404 }
        );
      }
    }
    
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
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting inquiry:", error);
    }
    
    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Inquiry not found" },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}




