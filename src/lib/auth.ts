import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

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
          return null;
        }

        try {
          // Note: For a full implementation, you'd need a User model with password
          // This is a simplified version - you'll need to add password field to User model
          const email = credentials.email as string;
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          // Verify password with bcrypt
          if (!user.password) {
            return null; // User doesn't have a password set
          }
          
          const isValid = await bcrypt.compare(credentials.password as string, user.password);
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
          console.error("Error in authorize function:", error);
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// Export authOptions for backward compatibility
export const authOptions = authConfig;

// Export NextAuth handlers (NextAuth v5 pattern)
import NextAuth from "next-auth";
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

