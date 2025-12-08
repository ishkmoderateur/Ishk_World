import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { validateAndSanitizeEmail } from "@/lib/validation";

// GET - Get current admin profile
export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT - Update admin profile
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
    const { name, email, phone } = body;

    const updateData: any = {};

    // Update name if provided
    if (name !== undefined) {
      updateData.name = name ? String(name).trim() : null;
    }

    // Update email if provided (with validation)
    if (email !== undefined && email !== session.user.email) {
      const sanitizedEmail = validateAndSanitizeEmail(email);
      if (!sanitizedEmail) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }

      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email: sanitizedEmail },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }

      updateData.email = sanitizedEmail;
    }

    // Update phone if provided
    if (phone !== undefined) {
      updateData.phone = phone ? String(phone).trim() : null;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}







