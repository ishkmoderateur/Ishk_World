import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
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

// Only use PrismaAdapter if database is available
// Since we're using JWT strategy, adapter is optional
let adapter: any = undefined;
try {
  // Test if Prisma client is working by checking if it has the required methods
  if (prisma && typeof prisma === 'object' && 'user' in prisma) {
    adapter = PrismaAdapter(prisma);
  }
} catch (error) {
  console.warn("⚠️  PrismaAdapter initialization failed. Using JWT-only mode.");
  console.warn("This is OK if you haven't set up your database yet.");
  adapter = undefined;
}

const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Trust host in development (NextAuth v5 requirement)
  ...(adapter && { adapter }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          if (process.env.NODE_ENV === "development") {
            console.log("Missing credentials");
          }
          return null;
        }

        try {
          const email = (credentials.email as string)?.trim().toLowerCase();
          const password = credentials.password as string;
          
          if (!email || !password) {
            return null;
          }
          
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

          if (!user || !user.password) {
            return null;
          }

          // Verify password with bcrypt
          const isValid = await bcrypt.compare(password, user.password);
          
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error in authorize function:", error);
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
    async jwt({ token, user, trigger }) {
      // On initial login, user object is provided
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // Use role from user object if available, otherwise fetch from database
        if ((user as any).role) {
          token.role = (user as any).role;
        } else {
          // Fetch user role from database
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id },
              select: { role: true },
            });
            if (dbUser) {
              token.role = dbUser.role;
            } else {
              // If user not found, set default role
              token.role = "USER";
            }
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("Error fetching user role:", error);
            }
            // Set default role on error instead of leaving it undefined
            token.role = token.role || "USER";
          }
        }
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

