import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  validateAndSanitizeEmail,
  validateRequired,
} from "@/lib/validation";
import {
  createVerificationCode,
  sendVerificationEmail,
  isEmailVerified,
} from "@/lib/email-verification";

/**
 * POST /api/auth/resend-verification
 * Resend verification email to user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredValidation = validateRequired(body, ["email"]);
    if (!requiredValidation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredValidation.missing.join(", ")}` },
        { status: 400 }
      );
    }

    const { email } = body;

    // Validate and sanitize email
    const sanitizedEmail = validateAndSanitizeEmail(email);
    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a verification email has been sent.",
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified.",
        alreadyVerified: true,
      });
    }

    // Generate new verification code
    const verificationData = await createVerificationCode(sanitizedEmail);
    if (!verificationData) {
      return NextResponse.json(
        { error: "Failed to create verification code" },
        { status: 500 }
      );
    }

    // Send verification email with code
    const emailSent = await sendVerificationEmail(sanitizedEmail, verificationData.token, verificationData.code);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Resend verification email error:", error);
    }
    
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}

