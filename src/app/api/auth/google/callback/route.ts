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
  // Get base URL for redirects - MUST match exactly what was used in the authorization request
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
          // Keep port for development (needed for MAMP and other custom ports)
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

  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    const baseUrl = getBaseUrl();

    // Check for OAuth errors
    if (error) {
      console.error("❌ Google OAuth error:", error);
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent(error)}`, baseUrl)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=missing_code", baseUrl)
      );
    }

    // Verify state to prevent CSRF
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value;
    
    if (!state || !storedState || state !== storedState) {
      console.error("❌ Invalid OAuth state");
      return NextResponse.redirect(
        new URL("/auth/signin?error=invalid_state", baseUrl)
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

    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    console.log("🔐 Google OAuth callback: Processing", {
      hasCode: !!code,
      hasState: !!state,
      redirectUri,
      baseUrl,
      nodeEnv: process.env.NODE_ENV,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      requestUrl: request.url,
      headers: {
        host: request.headers.get('host'),
        'x-forwarded-host': request.headers.get('x-forwarded-host'),
        'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      },
    });
    
    // CRITICAL: Log the exact redirect URI being used for token exchange
    // This must match EXACTLY what's configured in Google Cloud Console
    console.log("🔐 CRITICAL: Redirect URI for token exchange:", redirectUri);
    console.log("🔐 CRITICAL: This EXACT URI must be in Google Cloud Console > OAuth 2.0 Client > Authorized redirect URIs");
    console.log("🔐 CRITICAL: If you see 'redirect_uri_mismatch' error, add this URI:", redirectUri);
    console.log("🔐 CRITICAL: Current environment:", {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      requestHost: request.headers.get('host'),
      requestUrl: request.url,
      baseUrl,
    });

    // Exchange code for tokens
    let tokens;
    try {
      tokens = await exchangeCodeForToken(code, redirectUri);
    } catch (error) {
      console.error("❌ Google OAuth: Token exchange failed", {
        error: error instanceof Error ? error.message : String(error),
        redirectUri,
        baseUrl,
      });
      // Re-throw to be caught by outer try-catch
      throw error;
    }

    // Get user info from Google
    let googleUser;
    try {
      googleUser = await getGoogleUserInfo(tokens.access_token);
    } catch (error) {
      console.error("❌ Google OAuth: User info fetch failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      // Re-throw to be caught by outer try-catch
      throw error;
    }

    if (!googleUser.email || !googleUser.verified_email) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=email_not_verified", baseUrl)
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
    const sessionUrl = new URL("/api/auth/google/session", baseUrl);
    sessionUrl.searchParams.set("userId", user.id);
    sessionUrl.searchParams.set("email", user.email);
    sessionUrl.searchParams.set("name", user.name || "");
    sessionUrl.searchParams.set("image", user.image || "");
    sessionUrl.searchParams.set("role", user.role);
    sessionUrl.searchParams.set("redirect", callbackUrl);

    console.log("🔐 Google OAuth: Redirecting to session endpoint:", sessionUrl.toString());
    console.log("🔐 Google OAuth: User data:", {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      callbackUrl,
    });

    // Clear the OAuth state cookie
    const response = NextResponse.redirect(sessionUrl);
    response.cookies.delete("google_oauth_state");

    return response;
  } catch (error) {
    // Detailed error logging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
    
    console.error("❌ Google OAuth callback error:", error);
    console.error("❌ Error message:", errorMessage);
    console.error("❌ Error stack:", errorStack);
    
    // Get the redirect URI that was used (for error messages)
    const redirectUri = `${getBaseUrl()}/api/auth/google/callback`;
    
    // Determine specific error type
    let errorType = "oauth_failed";
    let errorDescription = "Authentication failed. Please try again.";
    
    if (errorMessage.includes("Failed to exchange code for token")) {
      errorType = "token_exchange_failed";
      
      // Extract the Google error type and description
      const errorTypeMatch = errorMessage.match(/Failed to exchange code for token.*?:\s*(\w+)/);
      const googleErrorType = errorTypeMatch ? errorTypeMatch[1] : null;
      const errorDescMatch = errorMessage.match(/-\s*(.+)$/);
      const googleErrorDesc = errorDescMatch ? errorDescMatch[1] : null;
      
      // Check for specific Google error types
      if (googleErrorType === "redirect_uri_mismatch" || errorMessage.includes("redirect_uri_mismatch")) {
        errorDescription = `Redirect URI mismatch. Add this EXACT URI to Google Cloud Console: ${redirectUri}`;
      } else if (googleErrorType === "invalid_client" || errorMessage.includes("invalid_client")) {
        errorDescription = `Invalid OAuth credentials. The Client ID and Secret don't match or are incorrect. Please verify:
1. GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local are correct
2. The Client Secret matches the Client ID in Google Cloud Console
3. You've restarted your development server after adding the credentials
4. Check for typos (1 vs l, I vs 1, O vs 0)`;
      } else if (googleErrorType === "invalid_grant" || errorMessage.includes("invalid_grant")) {
        errorDescription = `Authorization code expired or invalid. Please try signing in again.`;
      } else {
        errorDescription = googleErrorDesc 
          ? `Failed to exchange authorization code: ${googleErrorDesc}. Make sure this redirect URI is in Google Cloud Console: ${redirectUri}`
          : `Failed to exchange authorization code. Add this redirect URI to Google Cloud Console: ${redirectUri}`;
      }
    } else if (errorMessage.includes("Failed to get user info")) {
      errorType = "user_info_failed";
      errorDescription = "Failed to retrieve user information from Google.";
    } else if (errorMessage.includes("Request timeout")) {
      errorType = "timeout";
      errorDescription = "Request timed out. Please try again.";
    } else if (errorMessage.includes("redirect_uri_mismatch")) {
      errorType = "redirect_mismatch";
      errorDescription = "Redirect URI mismatch. Please check Google Cloud Console configuration.";
    } else if (errorMessage.includes("invalid_client")) {
      errorType = "invalid_client";
      errorDescription = "Invalid Google OAuth credentials. Please check environment variables.";
    } else if (errorMessage.includes("invalid_grant")) {
      errorType = "invalid_grant";
      errorDescription = "Authorization code expired or invalid. Please try again.";
    }
    
    // Get base URL for error redirect - use the same logic as above
    const errorBaseUrl = getBaseUrl();
    
    // Log the error type for debugging
    console.error("❌ Redirecting with error type:", errorType);
    console.error("❌ Error base URL:", errorBaseUrl);
    
    return NextResponse.redirect(
      new URL(
        `/auth/signin?error=${encodeURIComponent(errorType)}&details=${encodeURIComponent(errorDescription)}`,
        errorBaseUrl
      )
    );
  }
}

