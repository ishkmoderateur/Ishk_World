import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForToken, getGoogleUserInfo } from "@/lib/google-oauth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

/**
 * Handle Google OAuth callback
 * GET /api/auth/google/callback?code=...&state=...
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check for OAuth errors
    if (error) {
      console.error("❌ Google OAuth error:", error);
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=missing_code", request.url)
      );
    }

    // Verify state to prevent CSRF
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value;
    
    if (!state || !storedState || state !== storedState) {
      console.error("❌ Invalid OAuth state");
      return NextResponse.redirect(
        new URL("/auth/signin?error=invalid_state", request.url)
      );
    }

    // Parse callback URL from state
    let callbackUrl = "/profile";
    try {
      const stateData = JSON.parse(Buffer.from(state, "base64").toString());
      callbackUrl = stateData.callbackUrl || "/profile";
    } catch (e) {
      console.warn("⚠️ Could not parse state, using default callback");
    }

    // Get base URL from environment or request
    let baseUrl = process.env.NEXTAUTH_URL;
    
    // If not set, try to get from request
    if (!baseUrl) {
      const protocol = request.headers.get('x-forwarded-proto') || 
                       (request.url.startsWith('https') ? 'https' : 'http');
      const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
      if (host) {
        baseUrl = `${protocol}://${host}`;
      } else {
        baseUrl = "http://localhost:3000";
      }
    }
    
    // Force HTTPS in production
    if (process.env.NODE_ENV === 'production' && baseUrl.startsWith('http://')) {
      baseUrl = baseUrl.replace('http://', 'https://');
    }
    
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code, redirectUri);

    // Get user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    if (!googleUser.email || !googleUser.verified_email) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=email_not_verified", request.url)
      );
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
      select: { id: true, email: true, name: true, image: true, role: true },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || null,
          image: googleUser.picture || null,
          emailVerified: new Date(),
          role: "USER",
        },
        select: { id: true, email: true, name: true, image: true, role: true },
      });
      console.log("✅ Created new user from Google OAuth:", user.email);
    } else {
      // Update existing user with Google info if needed
      const updateData: any = {};
      if (!user.image && googleUser.picture) {
        updateData.image = googleUser.picture;
      }
      if (!user.name && googleUser.name) {
        updateData.name = googleUser.name;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
        console.log("✅ Updated user from Google OAuth:", user.email);
      }
    }

    // Create NextAuth session by redirecting to a special endpoint
    // that will create the session and then redirect to the callback URL
    const sessionUrl = new URL("/api/auth/google/session", request.url);
    sessionUrl.searchParams.set("userId", user.id);
    sessionUrl.searchParams.set("email", user.email);
    sessionUrl.searchParams.set("name", user.name || "");
    sessionUrl.searchParams.set("image", user.image || "");
    sessionUrl.searchParams.set("role", user.role);
    sessionUrl.searchParams.set("redirect", callbackUrl);

    // Clear the OAuth state cookie
    const response = NextResponse.redirect(sessionUrl);
    response.cookies.delete("google_oauth_state");

    return response;
  } catch (error) {
    console.error("❌ Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/auth/signin?error=${encodeURIComponent("oauth_failed")}`,
        request.url
      )
    );
  }
}
