import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Require association admin access
    const session = await requireSectionAccess("association");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Association admin access required" },
        { status: 401 }
      );
    }
    const donations = await prisma.donation.findMany({
      include: {
        campaign: {
          select: {
            title: true,
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

    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}




