import { NextResponse } from "next/server";

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
  // Safely check environment variables without exposing secrets
  const envStatus = {
    nodeEnv: process.env.NODE_ENV,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT SET",
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
  };

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "ishk-platform",
      environment: envStatus,
    },
    { status: 200 }
  );
}


