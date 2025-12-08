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

// POST - Submit venue inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      venueId,
      name,
      email,
      phone,
      eventDate,
      guestCount,
      message,
    } = body;

    // Validate required fields
    const requiredValidation = validateRequired(body, [
      "venueId",
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

    // Validate venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { id: true, name: true, location: true },
    });

    if (!venue) {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      );
    }

    // Get session (optional - can be anonymous inquiry)
    const session = await getAuthSession();

    // Sanitize string inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedMessage = message ? sanitizeString(message) : null;
    const sanitizedPhone = phone ? sanitizeString(phone) : null;

    // Create inquiry
    const inquiry = await prisma.venueInquiry.create({
      data: {
        userId: session?.user?.id,
        venueId,
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
            location: true,
          },
        },
      },
    });

    // Send email notification (if Resend is configured)
    if (resend && process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        // Sanitize all values for email HTML
        const safeVenueName = sanitizeString(venue.name);
        const safeLocation = sanitizeString(venue.location);
        const safeName = sanitizeString(name);
        const safeEmail = sanitizeString(email);
        const safePhone = sanitizedPhone || "Not provided";
        const safeEventDate = eventDateObj.toLocaleDateString();
        const safeGuestCount = String(validatedGuestCount);
        const safeMessage = sanitizedMessage || "";
        const safeInquiryId = inquiry.id;
        const safeBaseUrl = process.env.NEXTAUTH_URL || "";

        await resend.emails.send({
          from: "Ishk <noreply@ishk.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `New Venue Inquiry: ${safeVenueName}`,
          html: `
            <h2>New Venue Inquiry</h2>
            <p><strong>Venue:</strong> ${safeVenueName}</p>
            <p><strong>Location:</strong> ${safeLocation}</p>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Event Date:</strong> ${safeEventDate}</p>
            <p><strong>Guest Count:</strong> ${safeGuestCount}</p>
            ${safeMessage ? `<p><strong>Message:</strong> ${safeMessage}</p>` : ""}
            <p><a href="${safeBaseUrl}/admin/inquiries/${safeInquiryId}">View Inquiry</a></p>
          `,
        });

        // Send confirmation email to user
        await resend.emails.send({
          from: "Ishk <noreply@ishk.com>",
          to: sanitizedEmail,
          subject: "Thank you for your inquiry - Ishk",
          html: `
            <h2>Thank you for your inquiry!</h2>
            <p>We've received your inquiry for <strong>${safeVenueName}</strong> and will get back to you within 2 hours.</p>
            <p>Your inquiry details:</p>
            <ul>
              <li>Event Date: ${safeEventDate}</li>
              <li>Guest Count: ${safeGuestCount}</li>
            </ul>
            <p>Best regards,<br>The Ishk Team</p>
          `,
        });
      } catch (emailError) {
        // Log error but don't fail the request if email fails
        if (process.env.NODE_ENV === "development") {
          console.error("Error sending email:", emailError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      inquiry: {
        id: inquiry.id,
        status: inquiry.status,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating inquiry:", error);
    }
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

