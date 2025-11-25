import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@/types/next-auth.d";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.NODE_ENV === "development") {
    // Use a default secret for development (not secure, but allows testing)
    process.env.NEXTAUTH_SECRET = "development-secret-change-in-production";
    console.warn("⚠️  NEXTAUTH_SECRET is not set. Using development default.");
    console.warn("⚠️  Please set NEXTAUTH_SECRET in your .env file for production.");
  } else {
    console.error("❌ NEXTAUTH_SECRET is required in production!");
  }
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === "production") {
  console.warn("⚠️  NEXTAUTH_URL is not set. This is required in production.");
} else if (!process.env.NEXTAUTH_URL) {
  // Default to localhost for development
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}

// Using JWT strategy, so we don't need PrismaAdapter
// Adapter is only needed for database sessions, but we're using JWT tokens

// Validate Google OAuth credentials
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

if (!googleClientId || !googleClientSecret) {
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️  Google OAuth credentials not configured. Google sign-in will be disabled.");
    console.warn("⚠️  Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file to enable Google OAuth.");
  }
}

const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Trust host in development (NextAuth v5 requirement)
  providers: [
    // Only add Google provider if credentials are configured
    ...(googleClientId && googleClientSecret ? [
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      })
    ] : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("🔐 Server: Missing credentials");
          return null;
        }

        try {
          const email = (credentials.email as string)?.trim().toLowerCase();
          const password = credentials.password as string;
          
          console.log("🔐 Server: Attempting auth for:", email);
          console.log("🔐 Server: DATABASE_URL:", process.env.DATABASE_URL);
          
          if (!email || !password) {
            console.log("🔐 Server: Empty email or password after trim");
            return null;
          }
          
          // Check all users first for debugging
          const allUsers = await prisma.user.findMany({
            select: { email: true },
          });
          console.log("🔐 Server: Total users in DB:", allUsers.length);
          console.log("🔐 Server: All user emails:", allUsers.map(u => u.email));
          
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              role: true,
            },
          });

          if (!user) {
            console.log("🔐 Server: User not found for email:", email);
            console.log("🔐 Server: Searching for exact match:", email);
            return null;
          }

          if (!user.password) {
            console.log("🔐 Server: User has no password set");
            return null;
          }

          // Verify password with bcrypt
          const isValid = await bcrypt.compare(password, user.password);
          
          console.log("🔐 Server: Password match:", isValid);
          
          if (!isValid) {
            console.log("🔐 Server: Password mismatch");
            return null;
          }

          console.log("✅ Server: Authentication successful for:", email);

          // Return user object with role for NextAuth v5
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role, // Include role in user object
          };
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("❌ Server: Error in authorize function:", error);
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google" && user?.email) {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, name: true, image: true, role: true, emailVerified: true },
          });

          if (!existingUser) {
            // Create new user from Google OAuth
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || (profile as any)?.name || null,
                image: user.image || (profile as any)?.picture || null,
                emailVerified: new Date(), // Google emails are verified
                role: "USER", // Default role
                // No password for OAuth users
              },
            });
            console.log("✅ Created new user from Google OAuth:", newUser.email);
            // Update user object with database ID
            user.id = newUser.id;
            (user as any).role = newUser.role;
          } else {
            // Update existing user with Google info if needed
            const updateData: any = {};
            if (!existingUser.image && user.image) {
              updateData.image = user.image;
            }
            if (!existingUser.name && user.name) {
              updateData.name = user.name;
            }
            if (!existingUser.emailVerified) {
              updateData.emailVerified = new Date();
            }
            
            if (Object.keys(updateData).length > 0) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: updateData,
              });
              console.log("✅ Updated user from Google OAuth:", user.email);
            }
            
            // Update user object with database data
            user.id = existingUser.id;
            (user as any).role = existingUser.role;
          }
        } catch (error) {
          console.error("❌ Error handling Google OAuth sign-in:", error);
          // Allow sign-in to continue even if DB update fails
        }
      }
      return true; // Allow sign-in
    },
    async jwt({ token, user, trigger }) {
      // On initial login, user object is provided
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // Use role from user object (now included in authorize return)
        token.role = (user as any).role || "USER";
      } else if (token.id && !token.role) {
        // If token exists but role is missing, fetch it
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
          } else {
            token.role = "USER";
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error fetching user role from token:", error);
          }
          token.role = "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole | undefined;
        if (token.email) {
          session.user.email = token.email as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        
        // Fetch fresh user data from DB to ensure we have latest info
        if (token.id) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.id as string },
              select: { name: true, image: true, email: true, role: true },
            });
            if (dbUser) {
              session.user.name = dbUser.name || session.user.name;
              session.user.image = dbUser.image || session.user.image;
              session.user.email = dbUser.email || session.user.email;
              session.user.role = dbUser.role as UserRole;
            }
          } catch (error) {
            // Silently fail - use token data as fallback
            if (process.env.NODE_ENV === "development") {
              console.error("Error fetching user data for session:", error);
            }
          }
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If url is a relative path, use baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If url is on same origin, allow it
      if (new URL(url).origin === baseUrl) return url;
      // Otherwise redirect to baseUrl
      return baseUrl;
    },
  },
};

// Export authOptions for backward compatibility
export const authOptions = authConfig;

// Export NextAuth handlers (NextAuth v5 pattern)
import NextAuth from "next-auth";
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

