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
        console.log("🔐 Authorize function called");
        console.log("🔐 Credentials received:", { 
          email: credentials?.email ? "***" : "MISSING", 
          hasPassword: !!credentials?.password 
        });
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials - email or password not provided");
          console.log("❌ Credentials object:", credentials);
          return null;
        }

        try {
          const email = (credentials.email as string)?.trim().toLowerCase();
          const password = credentials.password as string;
          
          if (!email || !password) {
            console.log("❌ Email or password is empty after normalization");
            return null;
          }
          
          console.log(`🔐 Attempting login for: ${email}`);
          console.log(`🔐 Password length: ${password.length}`);
          
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
            console.log(`❌ User not found in database: ${email}`);
            return null;
          }

          console.log(`✅ User found: ${user.email} (ID: ${user.id})`);
          console.log(`✅ User has password: ${!!user.password}`);
          console.log(`✅ User role: ${user.role}`);

          // Verify password with bcrypt
          if (!user.password) {
            console.log(`❌ User has no password set: ${email}`);
            return null;
          }
          
          console.log(`🔐 Comparing passwords...`);
          const isValid = await bcrypt.compare(password, user.password);
          console.log(`🔐 Password comparison result: ${isValid ? "✅ VALID" : "❌ INVALID"}`);
          
          if (!isValid) {
            console.log(`❌ Invalid password for: ${email}`);
            console.log(`❌ Provided password: "${password}"`);
            console.log(`❌ Stored hash: ${user.password.substring(0, 20)}...`);
            return null;
          }

          console.log(`✅ Login successful for: ${email} (Role: ${user.role})`);
          const userToReturn = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
          console.log(`✅ Returning user object:`, { ...userToReturn, id: userToReturn.id.substring(0, 10) + "..." });
          return userToReturn;
        } catch (error) {
          console.error("❌ Error in authorize function:");
          console.error("❌ Error type:", error instanceof Error ? error.constructor.name : typeof error);
          console.error("❌ Error message:", error instanceof Error ? error.message : String(error));
          console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace");
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
        // Fetch user role from database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            console.log(`✅ JWT token created for user ${user.email} with role ${dbUser.role}`);
          } else {
            // If user not found, set default role
            token.role = "USER";
            console.log(`⚠️ User ${user.email} not found in database for role fetch, using default role`);
          }
        } catch (error) {
          console.error("❌ Error fetching user role:", error);
          // Set default role on error instead of leaving it undefined
          token.role = token.role || "USER";
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
          console.error("❌ Error fetching user role from token:", error);
          token.role = "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
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
  },
};

// Export authOptions for backward compatibility
export const authOptions = authConfig;

// Export NextAuth handlers (NextAuth v5 pattern)
import NextAuth from "next-auth";
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

