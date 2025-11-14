import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

