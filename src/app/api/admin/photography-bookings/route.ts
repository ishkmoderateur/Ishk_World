import { NextResponse } from "next/server";
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

    const bookings = await prisma.photographyBooking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching photography bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}


