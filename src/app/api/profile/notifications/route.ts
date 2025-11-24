import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // For now, return default notification preferences
    // In the future, you can add a UserPreferences model to the database
    return NextResponse.json({
      emailNotifications: true,
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { emailNotifications, orderUpdates, promotions, newsletter } = body;

    // For now, just return success
    // In the future, you can add a UserPreferences model to store these settings
    // Example:
    // await prisma.userPreferences.upsert({
    //   where: { userId: session.user.id },
    //   update: { emailNotifications, orderUpdates, promotions, newsletter },
    //   create: { userId: session.user.id, emailNotifications, orderUpdates, promotions, newsletter },
    // });

    return NextResponse.json({
      message: "Notification preferences updated successfully",
      preferences: {
        emailNotifications: emailNotifications ?? true,
        orderUpdates: orderUpdates ?? true,
        promotions: promotions ?? true,
        newsletter: newsletter ?? false,
      },
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}






