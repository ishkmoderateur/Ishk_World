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
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    
    if (!clientId || !clientSecret) {
      console.error("❌ Google OAuth credentials not configured");
      console.error("❌ GOOGLE_CLIENT_ID:", clientId ? "✓ Set" : "✗ Missing");
      console.error("❌ GOOGLE_CLIENT_SECRET:", clientSecret ? "✓ Set" : "✗ Missing");
      console.error("❌ Please add both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file");
      console.error("❌ See GOOGLE_OAUTH_SETUP.md for detailed instructions");
      
      return NextResponse.json(
        { 
          error: "Google OAuth is not configured",
          details: `Missing ${!clientId ? 'GOOGLE_CLIENT_ID' : ''}${!clientId && !clientSecret ? ' and ' : ''}${!clientSecret ? 'GOOGLE_CLIENT_SECRET' : ''}. Please add these to your .env.local file. See GOOGLE_OAUTH_SETUP.md for instructions.`
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

    // Get base URL from environment or request
    // IMPORTANT: This MUST match exactly what will be used in the callback route
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
      
      // If not set, try to get from request
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
    
    const baseUrl = getBaseUrl();
    
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    console.log("🔐 Google OAuth: Initiating OAuth flow", {
      baseUrl,
      redirectUri,
      callbackUrl,
      hasClientId: !!clientId,
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    });
    
    // CRITICAL: Log the exact redirect URI that must be in Google Cloud Console
    console.log("🔐 CRITICAL: This EXACT redirect URI must be in Google Cloud Console:");
    console.log("🔐 CRITICAL:", redirectUri);
    console.log("🔐 CRITICAL: Go to Google Cloud Console > APIs & Services > Credentials");
    console.log("🔐 CRITICAL: Open your OAuth 2.0 Client ID");
    console.log("🔐 CRITICAL: Add this URI to 'Authorized redirect URIs':", redirectUri);

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


