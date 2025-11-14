import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

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

    // Validation
    if (!venueId || !name || !email || !eventDate || !guestCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get session (optional - can be anonymous inquiry)
    const session = await getAuthSession();

    // Create inquiry
    const inquiry = await prisma.venueInquiry.create({
      data: {
        userId: session?.user?.id,
        venueId,
        name,
        email,
        phone,
        eventDate: new Date(eventDate),
        guestCount: parseInt(guestCount),
        message,
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
        await resend.emails.send({
          from: "Ishk <noreply@ishk.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `New Venue Inquiry: ${inquiry.venue.name}`,
          html: `
            <h2>New Venue Inquiry</h2>
            <p><strong>Venue:</strong> ${inquiry.venue.name}</p>
            <p><strong>Location:</strong> ${inquiry.venue.location}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
            <p><strong>Guest Count:</strong> ${guestCount}</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
            <p><a href="${process.env.NEXTAUTH_URL}/admin/inquiries/${inquiry.id}">View Inquiry</a></p>
          `,
        });

        // Send confirmation email to user
        await resend.emails.send({
          from: "Ishk <noreply@ishk.com>",
          to: email,
          subject: "Thank you for your inquiry - Ishk",
          html: `
            <h2>Thank you for your inquiry!</h2>
            <p>We've received your inquiry for <strong>${inquiry.venue.name}</strong> and will get back to you within 2 hours.</p>
            <p>Your inquiry details:</p>
            <ul>
              <li>Event Date: ${new Date(eventDate).toLocaleDateString()}</li>
              <li>Guest Count: ${guestCount}</li>
            </ul>
            <p>Best regards,<br>The Ishk Team</p>
          `,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails
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
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

