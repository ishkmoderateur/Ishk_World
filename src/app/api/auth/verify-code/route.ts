import { NextRequest, NextResponse } from "next/server";
import { verifyEmailCode } from "@/lib/email-verification";
import { validateAndSanitizeEmail, validateRequired } from "@/lib/validation";
import { signIn } from "@/lib/auth";

/**
 * POST /api/auth/verify-code
 * Verify email address using 6-digit code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredValidation = validateRequired(body, ["email", "code"]);
    if (!requiredValidation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredValidation.missing.join(", ")}` },
        { status: 400 }
      );
    }

    const { email, code } = body;

    // Validate and sanitize email
    const sanitizedEmail = validateAndSanitizeEmail(email);
    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate code format
    if (typeof code !== "string" || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid code format. Code must be 6 digits." },
        { status: 400 }
      );
    }

    // Verify code
    const result = await verifyEmailCode(sanitizedEmail, code);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to verify code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.error || "Email verified successfully!",
      email: result.email,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Code verification error:", error);
    }
    
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}

