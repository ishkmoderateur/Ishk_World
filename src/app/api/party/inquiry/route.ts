import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import {
  validateAndSanitizeEmail,
  validateInteger,
  validateRequired,
  sanitizeString,
  isValidPhone,
} from "@/lib/validation";

// Initialize Resend only if API key is available
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// POST - Submit party service inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      eventDate,
      guestCount,
      message,
    } = body;

    // Validate required fields (no venueId required for general inquiries)
    const requiredValidation = validateRequired(body, [
      "name",
      "email",
      "eventDate",
      "guestCount",
    ]);

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

    // Validate guest count
    const validatedGuestCount = validateInteger(guestCount, { min: 1, max: 10000, required: true });
    if (validatedGuestCount === null) {
      return NextResponse.json(
        { error: "Guest count must be a valid number between 1 and 10,000" },
        { status: 400 }
      );
    }

    // Validate event date
    const eventDateObj = new Date(eventDate);
    if (isNaN(eventDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid event date" },
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

    // Get session (optional - can be anonymous inquiry)
    const session = await getAuthSession();

    // Sanitize string inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedMessage = message ? sanitizeString(message) : null;
    const sanitizedPhone = phone ? sanitizeString(phone) : null;

    // For general party inquiries, we'll use a placeholder venue or create a general inquiry
    // First, try to find or create a "General Party Inquiry" venue
    let generalVenue = await prisma.venue.findFirst({
      where: { slug: "general-party-inquiry" },
    });

    if (!generalVenue) {
      // Create a general venue for party inquiries
      generalVenue = await prisma.venue.create({
        data: {
          name: "General Party Inquiry",
          slug: "general-party-inquiry",
          description: "General party service inquiries",
          location: "Various",
          city: "Various",
          country: "Various",
          address: "Various",
          capacity: "Various",
          minCapacity: 1,
          maxCapacity: 10000,
          price: 0,
          images: JSON.stringify([]),
          features: JSON.stringify([]),
          isActive: false, // Hidden from public listings
        },
      });
    }

    // Create inquiry
    const inquiry = await prisma.venueInquiry.create({
      data: {
        userId: session?.user?.id || null,
        venueId: generalVenue.id,
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        eventDate: eventDateObj,
        guestCount: validatedGuestCount,
        message: sanitizedMessage,
        status: "NEW",
      },
      include: {
        venue: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    // Send confirmation email if Resend is configured
    if (resend && sanitizedEmail) {
      try {
        await resend.emails.send({
          from: process.env.ADMIN_EMAIL || "noreply@ishk.com",
          to: sanitizedEmail,
          subject: "Party Service Inquiry Received",
          html: `
            <h2>Thank you for your inquiry!</h2>
            <p>Hi ${sanitizedName},</p>
            <p>We've received your party service inquiry and will get back to you within 2 hours during business hours.</p>
            <p><strong>Event Date:</strong> ${eventDateObj.toLocaleDateString()}</p>
            <p><strong>Number of Guests:</strong> ${validatedGuestCount}</p>
            ${sanitizedMessage ? `<p><strong>Your Message:</strong> ${sanitizedMessage}</p>` : ""}
            <p>Best regards,<br>ISHK Team</p>
          `,
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(
      {
        message: "Inquiry submitted successfully",
        inquiry: {
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          eventDate: inquiry.eventDate,
          guestCount: inquiry.guestCount,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating party inquiry:", error);
    
    // Handle Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "An inquiry with this information already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}

