#!/usr/bin/env tsx
/**
 * Check if Google OAuth users are being created in the database
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("🔍 Checking Google OAuth Users in Database\n");
    console.log("=".repeat(70));

    // Get all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        password: true, // Check if they have password (OAuth users won't)
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`\n📊 Total Users: ${allUsers.length}\n`);
    console.log("-".repeat(70));

    // Separate OAuth users (no password) from regular users
    const oauthUsers = allUsers.filter((u) => !u.password);
    const regularUsers = allUsers.filter((u) => u.password);

    console.log(`\n🔐 Google OAuth Users (no password): ${oauthUsers.length}`);
    console.log("-".repeat(70));
    if (oauthUsers.length > 0) {
      oauthUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.name || "Not set"}`);
        console.log(`   Image: ${user.image ? "Set" : "Not set"}`);
        console.log(`   Email Verified: ${user.emailVerified ? "Yes" : "No"}`);
        console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      });
    } else {
      console.log("   No OAuth users found yet");
    }

    console.log(`\n👤 Regular Users (with password): ${regularUsers.length}`);
    console.log("-".repeat(70));
    if (regularUsers.length > 0) {
      regularUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.name || "Not set"}`);
        console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      });
    }

    // Check recent users (last 10)
    console.log(`\n📅 Recent Users (Last 10):`);
    console.log("-".repeat(70));
    const recentUsers = allUsers.slice(0, 10);
    recentUsers.forEach((user, index) => {
      const isOAuth = !user.password;
      console.log(
        `${index + 1}. ${user.email} ${isOAuth ? "(OAuth)" : "(Regular)"} - ${user.createdAt.toLocaleString()}`
      );
    });

    console.log("\n" + "=".repeat(70));
  } catch (error) {
    console.error("❌ Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();




