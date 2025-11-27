import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

/**
 * Debug endpoint to check what cookies NextAuth is reading
 * GET /api/auth/google/session-debug
 */
export async function GET(request: NextRequest) {
  try {
    // Get all cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Find NextAuth cookies
    const nextAuthCookies = allCookies.filter(cookie => 
      cookie.name.includes('next-auth') || cookie.name.includes('authjs')
    );
    
    // Try to get session
    const session = await auth();
    
    // Try to decode any NextAuth cookies
    const decodedCookies: any[] = [];
    const secret = process.env.NEXTAUTH_SECRET;
    
    for (const cookie of nextAuthCookies) {
      try {
        if (secret) {
          const decoded = await decode({
            token: cookie.value,
            secret,
            salt: secret,
          });
          decodedCookies.push({
            name: cookie.name,
            decoded: decoded,
          });
        }
      } catch (e) {
        decodedCookies.push({
          name: cookie.name,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }
    
    return NextResponse.json({
      allCookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 })),
      nextAuthCookies: nextAuthCookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 })),
      decodedCookies,
      session: session ? {
        hasSession: true,
        hasUser: !!session.user,
        userId: session.user?.id,
        userEmail: session.user?.email,
      } : {
        hasSession: false,
      },
      secretLength: secret?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}






