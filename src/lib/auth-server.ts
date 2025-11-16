import { auth } from "./auth";
import { isAdmin, isSuperAdmin, canAccessSection } from "./roles";
import { UserRole } from "@/types/next-auth.d";

// Helper function to get server session (NextAuth v5 compatible)
// Uses the new auth() function from NextAuth v5
export async function getAuthSession() {
  try {
    const session = await auth();
    
    // Return null if there's no user
    if (!session || !session.user) {
      return null;
    }
    
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Check if user is admin (any admin role)
 * Returns null if unauthorized (caller should handle response)
 */
export async function requireAdmin() {
  const session = await getAuthSession();
  
  if (!session?.user || !isAdmin(session.user.role)) {
    return null;
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
  const session = await getAuthSession();
  
  if (!session?.user || !canAccessSection(session.user.role, section)) {
    return null;
  }
  
  return session;
}

