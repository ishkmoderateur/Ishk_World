import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-oauth";

/**
 * Initiate Google OAuth flow
 * GET /api/auth/google?callbackUrl=/profile
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get("callbackUrl") || "/profile";
    
    // Generate state to prevent CSRF attacks
    const state = Buffer.from(
      JSON.stringify({ callbackUrl, timestamp: Date.now() })
    ).toString("base64");

    // Store state in a cookie (expires in 10 minutes)
    const response = NextResponse.redirect(
      getGoogleAuthUrl(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`,
        state
      )
    );

    response.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("❌ Google OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Google OAuth" },
      { status: 500 }
    );
  }
}


