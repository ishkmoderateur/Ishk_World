import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Require admin access
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const [products, venues, campaigns, orders, users, donations, inquiries, revenueResult] = await Promise.all([
      prisma.product.count(),
      prisma.venue.count(),
      prisma.campaign.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.donation.count(),
      prisma.venueInquiry.count({ where: { status: "NEW" } }),
      // Optimize: Use aggregate instead of fetching all orders
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.total || 0;

    return NextResponse.json({
      products,
      venues,
      campaigns,
      orders,
      users,
      donations,
      totalRevenue,
      pendingInquiries: inquiries,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching admin stats:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}




