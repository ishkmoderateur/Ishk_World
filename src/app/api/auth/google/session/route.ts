import { NextRequest, NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encode, decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

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

    // Get base URL for redirects - MUST match the same logic used in OAuth routes
    const getBaseUrl = () => {
      // Check request host to detect if we're running locally
      const forwardedHost = request.headers.get('x-forwarded-host');
      const host = forwardedHost || request.headers.get('host') || '';
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168.') || host.startsWith('10.');
      
      // In development (localhost), prioritize request host over NEXTAUTH_URL
      // This allows local testing even if NEXTAUTH_URL is set to production
      let baseUrl = process.env.NEXTAUTH_URL;
      
      // If request is from localhost, ignore production NEXTAUTH_URL
      if (isLocalhost && baseUrl && baseUrl.includes('ishk-world.com')) {
        console.log("⚠️  Localhost detected: Ignoring production NEXTAUTH_URL, using request host");
        baseUrl = undefined; // Force it to use request host
      }
      
      if (!baseUrl) {
        // Check for forwarded protocol first (for proxies/load balancers)
        const forwardedProto = request.headers.get('x-forwarded-proto');
        let protocol = forwardedProto === 'https' || forwardedProto === 'http' 
          ? forwardedProto 
          : (request.url.startsWith('https') ? 'https' : 'http');
        
        // Check for forwarded host (for proxies/load balancers)
        const forwardedHost = request.headers.get('x-forwarded-host');
        const host = forwardedHost || request.headers.get('host');
        
        if (host) {
          // In production, ALWAYS use HTTPS regardless of what headers say
          if (process.env.NODE_ENV === 'production') {
            protocol = 'https';
          }
          
          // Remove port in production (standard HTTPS port 443)
          // Keep port for development
          if (process.env.NODE_ENV === 'production') {
            const hostWithoutPort = host.split(':')[0];
            baseUrl = `${protocol}://${hostWithoutPort}`;
          } else {
            // For development, keep the port if present
            const isStandardPort = (protocol === 'http' && host.includes(':80')) || 
                                   (protocol === 'https' && host.includes(':443'));
            
            if (isStandardPort) {
              const hostWithoutPort = host.split(':')[0];
              baseUrl = `${protocol}://${hostWithoutPort}`;
            } else {
              // Keep the port for non-standard ports (e.g., MAMP on 8888)
              baseUrl = `${protocol}://${host}`;
            }
          }
        } else {
          baseUrl = process.env.NODE_ENV === 'production' 
            ? "https://ishk-world.com" 
            : "http://localhost:3000";
        }
      }
      
      // Ensure baseUrl doesn't have trailing slash
      baseUrl = baseUrl.replace(/\/$/, '');
      
      // CRITICAL: Force HTTPS in production (even if NEXTAUTH_URL is set to HTTP)
      if (process.env.NODE_ENV === 'production' && baseUrl.startsWith('http://')) {
        console.warn("⚠️  WARNING: baseUrl was HTTP in production, forcing HTTPS");
        baseUrl = baseUrl.replace('http://', 'https://');
      }
      
      // Normalize to non-www version for consistency
      // Both www and non-www will be authorized in Google Console
      if (baseUrl.includes('www.ishk-world.com')) {
        baseUrl = baseUrl.replace('www.ishk-world.com', 'ishk-world.com');
      }
      
      return baseUrl;
    };

    const baseUrl = getBaseUrl();

    if (!userId || !email) {
      return NextResponse.redirect(new URL("/auth/signin?error=missing_user", baseUrl));
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, image: true, role: true },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin?error=user_not_found", baseUrl));
    }

    // CRITICAL: Use NextAuth's signIn function to create a proper session
    // NextAuth v5 requires using its internal signIn mechanism, not manually created JWTs
    // Since OAuth users don't have passwords, we'll use a workaround:
    // 1. Temporarily set a password for the OAuth user
    // 2. Use NextAuth's signIn function
    // 3. Remove the password (optional, or keep it for future use)
    
    // Alternative approach: Use NextAuth's internal API by making a POST request
    // to /api/auth/callback/credentials with the user's email and a temporary password
    
    // For now, let's try using NextAuth's signIn function directly
    // We'll need to create a temporary password for OAuth users
    
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error("NEXTAUTH_SECRET is not configured");
    }

    // Try using NextAuth's signIn function
    // This will create a proper session through NextAuth's internal mechanism
    try {
      console.log("🔐 Google OAuth: Attempting to use NextAuth signIn function");
      
      // Create a temporary password for OAuth users (we'll use a special marker)
      // This allows us to use NextAuth's signIn function
      const tempPassword = `google-oauth-${user.id}-${Date.now()}`;
      
      // Hash the temporary password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      // Temporarily set the password in the database
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      
      console.log("🔐 Google OAuth: Temporary password set, attempting signIn");
      
      // Use NextAuth's signIn function
      // This will create a proper session through NextAuth's internal mechanism
      const signInResult = await signIn("credentials", {
        email: user.email,
        password: tempPassword,
        redirect: false,
      });
      
      console.log("🔐 Google OAuth: signIn result:", signInResult);
      
      // If signIn worked, the session cookie should be set automatically
      // We can now remove the temporary password (optional)
      // For now, let's keep it in case we need it again
      
      // Create response with redirect
      const redirectUrl = new URL(redirect, baseUrl);
      const response = NextResponse.redirect(redirectUrl);
      
      console.log("✅ Google OAuth: Session created via NextAuth signIn");
      console.log("✅ Redirecting to:", redirectUrl.toString());
      
      return response;
    } catch (signInError) {
      console.error("❌ Google OAuth: signIn failed, falling back to manual JWT creation:", signInError);
      
      // Fallback to manual JWT creation if signIn fails
      // This ensures we still create a session even if signIn doesn't work
      const now = Math.floor(Date.now() / 1000);
      
      const tokenData = {
        sub: user.id,
        id: user.id,
        email: user.email,
        name: user.name || name || null,
        picture: user.image || image || null,
        role: user.role,
        iat: now,
        exp: now + (30 * 24 * 60 * 60),
      };
      
      const token = await encode({
        token: tokenData,
        secret,
        salt: secret,
      });
      
      console.log("🔐 Google OAuth: JWT token created (fallback)", {
        userId: user.id,
        email: user.email,
        tokenLength: token.length,
      });

      // Create response with redirect
      const redirectUrl = new URL(redirect, baseUrl);
      const response = NextResponse.redirect(redirectUrl);

      // Set NextAuth session cookie
      const cookieName = process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token";

      response.cookies.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      console.log("✅ Created NextAuth session (fallback) for Google OAuth user:", user.email);
      return response;
    }
  } catch (error) {
    console.error("❌ Google OAuth session creation error:", error);
    console.error("❌ Error details:", error instanceof Error ? error.message : String(error));
    
    // Get base URL for error redirect
    let errorBaseUrl = process.env.NEXTAUTH_URL;
    if (!errorBaseUrl) {
      const protocol = request.headers.get('x-forwarded-proto') || 
                       (request.url.startsWith('https') ? 'https' : 'http');
      const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
      if (host) {
        errorBaseUrl = `${protocol}://${host}`;
      } else {
        errorBaseUrl = "http://localhost:3000";
      }
    }
    if (process.env.NODE_ENV === 'production' && errorBaseUrl.startsWith('http://')) {
      errorBaseUrl = errorBaseUrl.replace('http://', 'https://');
    }
    
    return NextResponse.redirect(new URL("/auth/signin?error=session_failed", errorBaseUrl));
  }
}


