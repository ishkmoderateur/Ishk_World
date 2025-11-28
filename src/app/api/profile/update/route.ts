import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-server";
import { sanitizeString, isValidPhone } from "@/lib/validation";

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
    const { name, phone } = body;

    // Build update data
    const updateData: { name?: string; phone?: string | null } = {};

    // Validate and sanitize name if provided
    if (name !== undefined) {
      if (typeof name !== "string") {
        return NextResponse.json(
          { error: "Name must be a string" },
          { status: 400 }
        );
      }
      const sanitizedName = sanitizeString(name.trim());
      if (sanitizedName.length === 0) {
        return NextResponse.json(
          { error: "Name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = sanitizedName;
    }

    // Validate and sanitize phone if provided
    if (phone !== undefined) {
      if (phone === null || phone === "") {
        updateData.phone = null;
      } else if (typeof phone === "string") {
        const trimmedPhone = phone.trim();
        if (trimmedPhone.length > 0) {
          if (!isValidPhone(trimmedPhone)) {
            return NextResponse.json(
              { error: "Invalid phone number format" },
              { status: 400 }
            );
          }
          updateData.phone = sanitizeString(trimmedPhone);
        } else {
          updateData.phone = null;
        }
      } else {
        return NextResponse.json(
          { error: "Phone must be a string or null" },
          { status: 400 }
        );
      }
    }

    // If no fields to update, return error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        emailVerified: true,
      },
    });

    return NextResponse.json(
      { 
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

