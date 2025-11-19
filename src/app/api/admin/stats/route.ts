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

    const [products, venues, campaigns, orders, users, donations, inquiries] = await Promise.all([
      prisma.product.count(),
      prisma.venue.count(),
      prisma.campaign.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.donation.count(),
      prisma.venueInquiry.count({ where: { status: "NEW" } }),
    ]);

    const ordersData = await prisma.order.findMany({
      select: { total: true },
    });

    const totalRevenue = ordersData.reduce((sum: number, order: { total: number }) => sum + order.total, 0);

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
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}




