import { NextRequest, NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encode } from "next-auth/jwt";

/**
 * Create session after Google OAuth
 * This endpoint creates a NextAuth JWT session for the user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const image = searchParams.get("image");
    const role = searchParams.get("role") || "USER";
    const redirect = searchParams.get("redirect") || "/profile";

    if (!userId || !email) {
      return NextResponse.redirect(new URL("/auth/signin?error=missing_user", request.url));
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, image: true, role: true },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin?error=user_not_found", request.url));
    }

    // Create NextAuth JWT token
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error("NEXTAUTH_SECRET is not configured");
    }

    const token = await encode({
      token: {
        id: user.id,
        email: user.email,
        name: user.name || name || null,
        picture: user.image || image || null,
        role: user.role,
        sub: user.id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      },
      secret,
      salt: secret, // Use secret as salt for NextAuth v5
    });

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirect, request.url));

    // Set NextAuth session cookie
    const cookieName = process.env.NODE_ENV === "production" 
      ? "__Secure-next-auth.session-token" 
      : "next-auth.session-token";

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    console.log("✅ Created NextAuth session for Google OAuth user:", user.email);

    return response;
  } catch (error) {
    console.error("❌ Google OAuth session creation error:", error);
    return NextResponse.redirect(new URL("/auth/signin?error=session_failed", request.url));
  }
}


