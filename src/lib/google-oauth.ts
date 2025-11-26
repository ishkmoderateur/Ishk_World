// Direct Google OAuth 2.0 implementation (without NextAuth)

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

/**
 * Get Google OAuth authorization URL
 */
export function getGoogleAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  if (state) {
    params.append("state", state);
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<GoogleTokenResponse> {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    console.error("❌ Google OAuth credentials missing!");
    console.error("❌ GOOGLE_CLIENT_ID:", clientId ? "✓ Set" : "✗ Missing");
    console.error("❌ GOOGLE_CLIENT_SECRET:", clientSecret ? "✓ Set" : "✗ Missing");
    console.error("❌ Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file");
    console.error("❌ See GOOGLE_OAUTH_SETUP.md for instructions");
    throw new Error("Google OAuth credentials not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file.");
  }

  // Validate credential format
  if (clientId && !clientId.endsWith('.apps.googleusercontent.com')) {
    console.warn("⚠️  GOOGLE_CLIENT_ID format looks incorrect (should end with .apps.googleusercontent.com)");
  }
  if (clientSecret && !clientSecret.startsWith('GOCSPX-') && clientSecret.length < 20) {
    console.warn("⚠️  GOOGLE_CLIENT_SECRET format looks incorrect (should start with GOCSPX- and be longer)");
  }

  console.log("🔐 Google OAuth: Exchanging code for token", {
    hasCode: !!code,
    redirectUri,
    hasClientId: !!clientId,
    clientIdPrefix: clientId?.substring(0, 30) + "...",
    clientIdFormat: clientId?.endsWith('.apps.googleusercontent.com') ? "✓ Valid" : "✗ Invalid format",
    hasClientSecret: !!clientSecret,
    clientSecretLength: clientSecret?.length || 0,
    clientSecretFormat: clientSecret?.startsWith('GOCSPX-') ? "✓ Valid" : (clientSecret ? "⚠️ Check format" : "✗ Missing"),
    nodeEnv: process.env.NODE_ENV,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response;
    try {
      response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "ishk-platform/1.0",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("❌ Google OAuth: Fetch timeout");
        throw new Error("Request timeout: Failed to exchange code for token");
      }
      console.error("❌ Google OAuth: Fetch error", {
        error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        name: fetchError instanceof Error ? fetchError.name : 'Unknown',
      });
      throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error("❌ Google OAuth token exchange failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        redirectUri,
        clientIdUsed: clientId?.substring(0, 30) + "...",
        redirectUriUsed: redirectUri,
      });
      
      // CRITICAL: Show the exact error from Google
      console.error("🔴 GOOGLE ERROR TYPE:", errorData.error || "unknown");
      console.error("🔴 GOOGLE ERROR DESCRIPTION:", errorData.error_description || errorData.message || "No description");
      console.error("🔴 REDIRECT URI SENT TO GOOGLE:", redirectUri);
      console.error("🔴 CLIENT ID USED:", clientId?.substring(0, 40) + "...");
      console.error("🔴 CLIENT SECRET LENGTH:", clientSecret?.length || 0);
      
      // Provide specific guidance based on error type
      if (errorData.error === "invalid_client") {
        console.error("❌ INVALID_CLIENT ERROR - Possible causes:");
        console.error("   1. Client ID and Secret don't match (from different OAuth clients)");
        console.error("   2. Client Secret was REGENERATED in Google Cloud Console (most common!)");
        console.error("   3. Client Secret is incorrect or has typos (1 vs l, I vs 1, O vs 0)");
        console.error("   4. Redirect URI doesn't match Google Console");
        console.error("");
        console.error("🔧 TROUBLESHOOTING STEPS:");
        console.error("   1. Go to Google Cloud Console > APIs & Services > Credentials");
        console.error("   2. Click on your OAuth 2.0 Client ID:", clientId?.substring(0, 40) + "...");
        console.error("   3. Check if the Client Secret is visible or if you need to reset it");
        console.error("   4. If you see 'Reset secret', the old secret won't work anymore!");
        console.error("   5. Copy the NEW secret and update your .env file");
        console.error("   6. Restart your server after updating .env");
        console.error("");
        console.error("📋 Current credentials being used:");
        console.error("   Client ID:", clientId?.substring(0, 50) + "...");
        console.error("   Client Secret:", clientSecret ? `${clientSecret.substring(0, 15)}...${clientSecret.substring(clientSecret.length - 10)}` : "NOT SET");
        console.error("   Redirect URI:", redirectUri);
        console.error("");
        console.error("⚠️  If it was working yesterday and stopped today:");
        console.error("   → The Client Secret was likely regenerated in Google Cloud Console");
        console.error("   → You MUST use the NEW secret, the old one won't work");
      } else if (errorData.error === "redirect_uri_mismatch") {
        console.error("❌ REDIRECT_URI_MISMATCH ERROR:");
        console.error("   The redirect URI used doesn't match what's configured in Google Cloud Console");
        console.error("   Redirect URI used:", redirectUri);
        console.error("   Steps to fix:");
        console.error("   1. Go to Google Cloud Console > APIs & Services > Credentials");
        console.error("   2. Open your OAuth 2.0 Client ID");
        console.error("   3. Add this EXACT URI to 'Authorized redirect URIs':", redirectUri);
        console.error("   4. Make sure there are no trailing slashes or extra characters");
        console.error("   5. If using a custom port (like MAMP on 8888), include it in the URI");
      } else if (errorData.error === "invalid_grant") {
        console.error("❌ INVALID_GRANT ERROR:");
        console.error("   The authorization code has expired or was already used");
        console.error("   This usually happens if:");
        console.error("   1. The code was used more than once");
        console.error("   2. Too much time passed between authorization and token exchange");
        console.error("   3. The code was generated for a different redirect URI");
      }
      
      // Include the full error details in the error message for better debugging
      const errorType = errorData.error || "unknown_error";
      const errorDescription = errorData.error_description || errorData.message || "Unknown error";
      
      // Log the full error for debugging
      console.error("❌ Google API Error Response:", {
        error: errorType,
        description: errorDescription,
        fullResponse: errorData,
        redirectUri,
        clientIdPrefix: clientId?.substring(0, 20) + "...",
      });
      
      // Create a more descriptive error message
      let errorMessage = `Failed to exchange code for token (${response.status}): ${errorType}`;
      if (errorDescription) {
        errorMessage += ` - ${errorDescription}`;
      }
      
      throw new Error(errorMessage);
    }

    const tokenData = await response.json();
    console.log("✅ Google OAuth: Successfully exchanged code for token");
    return tokenData;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("❌ Google OAuth: Request timeout");
      throw new Error("Request timeout: Failed to exchange code for token");
    }
    throw error;
  }
}

/**
 * Get user info from Google using access token
 */
export async function getGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  console.log("🔐 Google OAuth: Fetching user info", {
    hasToken: !!accessToken,
    nodeEnv: process.env.NODE_ENV,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response;
    try {
      response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "ishk-platform/1.0",
          },
          signal: controller.signal,
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("❌ Google OAuth: Fetch timeout");
        throw new Error("Request timeout: Failed to get user info");
      }
      console.error("❌ Google OAuth: User info fetch error", {
        error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        name: fetchError instanceof Error ? fetchError.name : 'Unknown',
      });
      throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error("❌ Google OAuth user info fetch failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      
      throw new Error(
        `Failed to get user info (${response.status}): ${JSON.stringify(errorData)}`
      );
    }

    const userInfo = await response.json();
    console.log("✅ Google OAuth: Successfully fetched user info", {
      email: userInfo.email,
      verified: userInfo.verified_email,
    });
    return userInfo;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("❌ Google OAuth: Request timeout");
      throw new Error("Request timeout: Failed to get user info");
    }
    throw error;
  }
}




