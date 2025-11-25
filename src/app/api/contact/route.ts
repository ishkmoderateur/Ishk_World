import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { validateAndSanitizeEmail, sanitizeString } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, type = "general", cartDetails } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email
    const sanitizedEmail = validateAndSanitizeEmail(email);
    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedPhone = phone ? sanitizeString(phone) : null;
    const sanitizedMessage = sanitizeString(message);

    // Get user ID if logged in
    const session = await getAuthSession();
    const userId = session?.user?.id || null;

    // Store contact message in database (you can create a ContactMessage model if needed)
    // For now, we'll just log it and return success
    // In production, you might want to:
    // 1. Store in database
    // 2. Send email notification
    // 3. Create a ticket in a support system

    console.log("📧 Contact form submission:", {
      userId,
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      type,
      hasCartDetails: !!cartDetails,
      messageLength: sanitizedMessage.length,
    });

    if (cartDetails) {
      console.log("🛒 Cart inquiry details:", {
        itemsCount: cartDetails.items?.length || 0,
        total: cartDetails.total,
        currency: cartDetails.currency,
      });
    }

    // TODO: Store in database if you have a ContactMessage model
    // Example:
    // await prisma.contactMessage.create({
    //   data: {
    //     userId,
    //     name: sanitizedName,
    //     email: sanitizedEmail,
    //     phone: sanitizedPhone,
    //     message: sanitizedMessage,
    //     type,
    //     cartDetails: cartDetails ? JSON.stringify(cartDetails) : null,
    //   },
    // });

    return NextResponse.json(
      { 
        success: true,
        message: "Your message has been sent successfully. We'll get back to you soon!" 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ Contact form error:", error);
    
    const errorMessage = process.env.NODE_ENV === "development"
      ? (error instanceof Error ? error.message : "Failed to send message")
      : "Failed to send message. Please try again.";
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


