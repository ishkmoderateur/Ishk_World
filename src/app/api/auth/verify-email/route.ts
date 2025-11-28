import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email-verification";
import { validateRequired } from "@/lib/validation";

/**
 * POST /api/auth/verify-email
 * Verify email address using token from verification email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredValidation = validateRequired(body, ["token"]);
    if (!requiredValidation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredValidation.missing.join(", ")}` },
        { status: 400 }
      );
    }

    const { token } = body;

    // Validate token format
    if (typeof token !== "string" || token.length < 10) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    // Verify token
    const result = await verifyEmailToken(token);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to verify email" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.error || "Email verified successfully",
      email: result.email,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Email verification error:", error);
    }
    
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/verify-email?token=...
 * Verify email address using token from URL (for email links)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Validate token format
    if (typeof token !== "string" || token.length < 10) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    // Verify token
    const result = await verifyEmailToken(token);

    if (!result.success) {
      // Redirect to verification page with error
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      return NextResponse.redirect(
        `${baseUrl}/auth/verify-email?error=${encodeURIComponent(result.error || "Failed to verify email")}`
      );
    }

    // Redirect to success page
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/auth/verify-email?success=true&email=${encodeURIComponent(result.email || "")}`
    );
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Email verification error:", error);
    }
    
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/auth/verify-email?error=${encodeURIComponent("Failed to verify email")}`
    );
  }
}

