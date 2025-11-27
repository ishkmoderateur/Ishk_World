import { NextRequest, NextResponse } from "next/server";

/**
 * Verify Google OAuth configuration
 * GET /api/auth/google/verify
 * 
 * This endpoint helps verify that your Google OAuth setup is correct
 * by showing the exact redirect URI that will be used.
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
    const nodeEnv = process.env.NODE_ENV;

    // Calculate base URL using the same logic as the OAuth routes
    const getBaseUrl = () => {
      let baseUrl = nextAuthUrl;
      
      if (!baseUrl) {
        const forwardedProto = request.headers.get('x-forwarded-proto');
        let protocol = forwardedProto === 'https' || forwardedProto === 'http' 
          ? forwardedProto 
          : (request.url.startsWith('https') ? 'https' : 'http');
        
        const forwardedHost = request.headers.get('x-forwarded-host');
        const host = forwardedHost || request.headers.get('host');
        
        if (host) {
          if (nodeEnv === 'production') {
            protocol = 'https';
          }
          
          if (nodeEnv === 'production') {
            const hostWithoutPort = host.split(':')[0];
            baseUrl = `${protocol}://${hostWithoutPort}`;
          } else {
            const isStandardPort = (protocol === 'http' && host.includes(':80')) || 
                                   (protocol === 'https' && host.includes(':443'));
            
            if (isStandardPort) {
              const hostWithoutPort = host.split(':')[0];
              baseUrl = `${protocol}://${hostWithoutPort}`;
            } else {
              baseUrl = `${protocol}://${host}`;
            }
          }
        } else {
          baseUrl = nodeEnv === 'production' 
            ? "https://ishk-world.com" 
            : "http://localhost:3000";
        }
      }
      
      baseUrl = baseUrl.replace(/\/$/, '');
      
      if (nodeEnv === 'production' && baseUrl.startsWith('http://')) {
        baseUrl = baseUrl.replace('http://', 'https://');
      }
      
      if (baseUrl.includes('www.ishk-world.com')) {
        baseUrl = baseUrl.replace('www.ishk-world.com', 'ishk-world.com');
      }
      
      return baseUrl;
    };

    const baseUrl = getBaseUrl();
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Check configuration status
    const config = {
      environment: nodeEnv || 'development',
      baseUrl,
      redirectUri,
      credentials: {
        clientId: {
          configured: !!clientId,
          format: clientId ? (clientId.endsWith('.apps.googleusercontent.com') ? 'valid' : 'invalid') : 'missing',
          prefix: clientId ? clientId.substring(0, 30) + '...' : 'NOT SET',
        },
        clientSecret: {
          configured: !!clientSecret,
          format: clientSecret ? (clientSecret.startsWith('GOCSPX-') ? 'valid' : 'check format') : 'missing',
          length: clientSecret ? clientSecret.length : 0,
        },
      },
      nextAuthUrl: nextAuthUrl || 'NOT SET',
      headers: {
        host: request.headers.get('host'),
        'x-forwarded-host': request.headers.get('x-forwarded-host'),
        'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      },
    };

    // Determine status
    const isConfigured = !!clientId && !!clientSecret;
    const hasValidFormat = 
      (clientId?.endsWith('.apps.googleusercontent.com') ?? false) &&
      (clientSecret?.startsWith('GOCSPX-') ?? false);
    const isProduction = nodeEnv === 'production';
    const usesHttps = redirectUri.startsWith('https://');

    const status = isConfigured && hasValidFormat && (!isProduction || usesHttps) 
      ? 'ready' 
      : isConfigured 
        ? 'needs_review' 
        : 'not_configured';

    return NextResponse.json({
      status,
      message: status === 'ready' 
        ? '✅ Google OAuth is properly configured'
        : status === 'needs_review'
          ? '⚠️ Google OAuth credentials are set but may need review'
          : '❌ Google OAuth is not configured',
      config,
      instructions: {
        redirectUri: {
          message: 'Add this EXACT URI to Google Cloud Console:',
          uri: redirectUri,
          steps: [
            '1. Go to Google Cloud Console > APIs & Services > Credentials',
            '2. Open your OAuth 2.0 Client ID',
            '3. Add this URI to "Authorized redirect URIs":',
            `   ${redirectUri}`,
            '4. Click Save',
            '5. Wait 2-3 minutes for changes to propagate',
          ],
        },
        production: isProduction ? {
          message: 'You are in PRODUCTION mode',
          requirements: [
            `✅ Redirect URI uses HTTPS: ${usesHttps ? 'YES' : 'NO'}`,
            `✅ NEXTAUTH_URL should be: https://ishk-world.com`,
            `✅ Current NEXTAUTH_URL: ${nextAuthUrl || 'NOT SET'}`,
          ],
        } : null,
      },
    }, { status: status === 'ready' ? 200 : 200 }); // Always return 200, status is in the response body
  } catch (error) {
    console.error("❌ Error verifying Google OAuth config:", error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to verify Google OAuth configuration',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}








