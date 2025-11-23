import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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
    const body = await request.json();
    const { status } = body;

    if (!status || !["NEW", "CONTACTED", "QUOTED", "BOOKED", "DECLINED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (status !== "NEW") {
      updateData.respondedAt = new Date();
    }

    const booking = await prisma.photographyBooking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Error updating photography booking:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}


