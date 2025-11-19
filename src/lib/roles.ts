import { UserRole } from "@/types/next-auth.d";

/**
 * Check if user is a super admin
 */
export function isSuperAdmin(role?: UserRole | string): boolean {
  return role === "SUPER_ADMIN";
}

/**
 * Check if user is any admin (super admin or section admin)
 */
export function isAdmin(role?: UserRole | string): boolean {
  if (!role) return false;
  return role !== "USER";
}

/**
 * Check if user can access a specific section
 */
export function canAccessSection(
  userRole: UserRole | string | undefined,
  section: "news" | "party" | "boutique" | "association" | "photography"
): boolean {
  if (!userRole) return false;
  
  // Super admin can access everything
  if (isSuperAdmin(userRole)) return true;
  
  // Check section-specific access
  const sectionMap: Record<string, string> = {
    news: "ADMIN_NEWS",
    party: "ADMIN_PARTY",
    boutique: "ADMIN_BOUTIQUE",
    association: "ADMIN_ASSOCIATION",
    photography: "ADMIN_PHOTOGRAPHY",
  };
  
  return userRole === sectionMap[section];
}

/**
 * Get all sections a user can access
 */
export function getUserAccessibleSections(role?: UserRole | string): string[] {
  if (!role || role === "USER") return [];
  
  if (isSuperAdmin(role)) {
    return ["news", "party", "boutique", "association", "photography", "users", "orders", "inquiries", "donations"];
  }
  
  const roleToSection: Record<string, string> = {
    ADMIN_NEWS: "news",
    ADMIN_PARTY: "party",
    ADMIN_BOUTIQUE: "boutique",
    ADMIN_ASSOCIATION: "association",
    ADMIN_PHOTOGRAPHY: "photography",
  };
  
  const section = roleToSection[role];
  return section ? [section] : [];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role?: UserRole | string): string {
  if (!role) return "User";
  
  const roleNames: Record<string, string> = {
    USER: "User",
    SUPER_ADMIN: "Super Admin",
    ADMIN_NEWS: "News Admin",
    ADMIN_PARTY: "Party Admin",
    ADMIN_BOUTIQUE: "Boutique Admin",
    ADMIN_ASSOCIATION: "Association Admin",
    ADMIN_PHOTOGRAPHY: "Photography Admin",
  };
  
  return roleNames[role] || role;
}






