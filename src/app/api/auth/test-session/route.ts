import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Test endpoint to check if session is being read correctly
 * GET /api/auth/test-session
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!session?.user,
      user: session?.user || null,
      session: session || null,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      hasSession: false,
    }, { status: 500 });
  }
}




