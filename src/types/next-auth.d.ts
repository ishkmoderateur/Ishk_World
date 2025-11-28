import "next-auth";

export type UserRole = 
  | "USER"
  | "SUPER_ADMIN"
  | "ADMIN_NEWS"
  | "ADMIN_PARTY"
  | "ADMIN_BOUTIQUE"
  | "ADMIN_ASSOCIATION"
  | "ADMIN_PHOTOGRAPHY";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      phone?: string | null;
      role?: UserRole;
      emailVerified?: Date | null;
    };
  }
}








