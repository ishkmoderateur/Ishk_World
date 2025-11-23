import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

// GET - Fetch all orders (Super Admin only)
export async function GET(request: NextRequest) {
  try {
    // Require super admin access
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Super admin access required" },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus;
    }
    if (userId) {
      where.userId = userId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}




