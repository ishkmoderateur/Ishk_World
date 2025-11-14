import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // TODO: Add admin authorization check
    // const session = await getAuthSession();
    // if (!session?.user || !isAdmin(session.user)) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

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

    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);

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

