/**
 * Script to list all users in the database
 * Usage: npx tsx scripts/list-all-users.ts
 */

import { prisma } from "../src/lib/prisma";

async function listAllUsers() {
  try {
    console.log("🔍 Fetching all users from database...\n");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (users.length === 0) {
      console.log("✅ No users found in the database.");
      return;
    }

    console.log(`📋 Found ${users.length} user(s) in the database:\n`);
    console.log("─".repeat(100));

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name || "N/A"}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Email Verified: ${user.emailVerified ? `✅ Yes (${new Date(user.emailVerified).toLocaleString()})` : "❌ No"}`);
      console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
      console.log(`   Updated: ${new Date(user.updatedAt).toLocaleString()}`);
    });

    console.log("\n" + "─".repeat(100));
    console.log(`\n✅ Total: ${users.length} user(s)`);
    
    const verifiedCount = users.filter(u => u.emailVerified).length;
    const unverifiedCount = users.length - verifiedCount;
    console.log(`   Verified: ${verifiedCount}`);
    console.log(`   Unverified: ${unverifiedCount}`);
  } catch (error) {
    console.error("❌ Error listing users:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

listAllUsers();

