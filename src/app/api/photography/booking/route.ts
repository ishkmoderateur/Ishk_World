import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import {
  validateRequired,
  validateAndSanitizeEmail,
  isValidPhone,
  sanitizeString,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    const body = await request.json();

    const { name, email, phone, preferredDate, serviceType, message } = body;

    // Validate required fields
    const requiredValidation = validateRequired(body, ["name", "email"]);
    if (!requiredValidation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredValidation.missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate and sanitize email
    const sanitizedEmail = validateAndSanitizeEmail(email);
    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone && typeof phone === "string" && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedPhone = phone ? sanitizeString(phone) : null;
    const sanitizedMessage = message ? sanitizeString(message) : null;
    const sanitizedServiceType = serviceType ? sanitizeString(serviceType) : "portrait";

    // Parse date if provided
    let parsedDate: Date | null = null;
    if (preferredDate) {
      parsedDate = new Date(preferredDate);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
    }

    // Create booking
    const booking = await prisma.photographyBooking.create({
      data: {
        userId: session?.user?.id || null,
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        preferredDate: parsedDate,
        serviceType: sanitizedServiceType,
        message: sanitizedMessage,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { message: "Booking request submitted successfully", booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating photography booking:", error);
    return NextResponse.json(
      { error: "Failed to submit booking request" },
      { status: 500 }
    );
  }
}


