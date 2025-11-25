import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-oauth";

/**
 * Initiate Google OAuth flow
 * GET /api/auth/google?callbackUrl=/profile
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Google OAuth is configured
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    if (!clientId) {
      console.error("❌ GOOGLE_CLIENT_ID is not configured");
      return NextResponse.json(
        { 
          error: "Google OAuth is not configured. Please contact the administrator.",
          details: "GOOGLE_CLIENT_ID environment variable is missing"
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get("callbackUrl") || "/profile";
    
    // Generate state to prevent CSRF attacks
    const state = Buffer.from(
      JSON.stringify({ callbackUrl, timestamp: Date.now() })
    ).toString("base64");

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    console.log("🔐 Google OAuth: Initiating OAuth flow", {
      baseUrl,
      redirectUri,
      callbackUrl,
      hasClientId: !!clientId,
    });

    // Store state in a cookie (expires in 10 minutes)
    const response = NextResponse.redirect(
      getGoogleAuthUrl(redirectUri, state)
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Failed to initiate Google OAuth",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}


