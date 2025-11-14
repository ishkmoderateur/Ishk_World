import { auth } from "./auth";

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

