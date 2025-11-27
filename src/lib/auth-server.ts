import { auth } from "./auth";
import { isAdmin, isSuperAdmin, canAccessSection } from "./roles";
import { UserRole } from "@/types/next-auth.d";

// Helper function to get server session (NextAuth v5 compatible)
// Uses the new auth() function from NextAuth v5
// In NextAuth v5, auth() automatically reads from headers/cookies in API routes
export async function getAuthSession() {
  try {
    const session = await auth();
    
    // Always log in production for debugging
    console.log("🔐 Auth session check:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userRole: session?.user?.role,
      userId: session?.user?.id,
      nodeEnv: process.env.NODE_ENV,
    });
    
    // Return null if there's no user
    if (!session || !session.user) {
      console.log("🔐 No session or user found");
      return null;
    }
    
    return session;
  } catch (error) {
    // Always log errors in production
    console.error("❌ Error getting session:", error);
    if (error instanceof Error) {
      console.error("Session error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return null;
  }
}

/**
 * Check if user is admin (any admin role)
 * Returns null if unauthorized (caller should handle response)
 */
export async function requireAdmin() {
  const session = await getAuthSession();
  
  if (!session?.user) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 requireAdmin: No user in session");
    }
    return null;
  }
  
  if (!isAdmin(session.user.role)) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 requireAdmin: User is not admin. Role:", session.user.role);
    }
    return null;
  }
  
  if (process.env.NODE_ENV === "development") {
    console.log("✅ requireAdmin: Admin access granted for role:", session.user.role);
  }
  
  return session;
}

/**
 * Check if user is super admin
 * Returns null if unauthorized (caller should handle response)
 */
export async function requireSuperAdmin() {
  const session = await getAuthSession();
  
  if (!session?.user || !isSuperAdmin(session.user.role)) {
    return null;
  }
  
  return session;
}

/**
 * Check if user can access a specific section
 * Returns null if unauthorized (caller should handle response)
 */
export async function requireSectionAccess(
  section: "news" | "party" | "boutique" | "association" | "photography"
) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      console.log(`🔐 requireSectionAccess(${section}): No user in session`);
      return null;
    }
    
    if (!canAccessSection(session.user.role, section)) {
      console.log(`🔐 requireSectionAccess(${section}): Access denied. User role: ${session.user.role}`);
      return null;
    }
    
    console.log(`✅ requireSectionAccess(${section}): Access granted for role: ${session.user.role}`);
    return session;
  } catch (error) {
    console.error(`❌ requireSectionAccess(${section}): Error:`, error);
    if (error instanceof Error) {
      console.error("requireSectionAccess error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return null;
  }
}

