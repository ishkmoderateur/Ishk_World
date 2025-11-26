import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📋 Listing all users in the database...\n");

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        password: true, // To check if they have a password set
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (users.length === 0) {
      console.log("❌ No users found in the database!\n");
      return;
    }

    console.log(`Found ${users.length} user(s):\n`);
    console.log("=".repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name || "Not set"}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Has Password: ${user.password ? "✅ Yes" : "❌ No (OAuth only)"}`);
      console.log(`   Created: ${user.createdAt.toISOString().split('T')[0]}`);
      console.log(`   ID: ${user.id}`);
    });

    console.log("\n" + "=".repeat(80));
    
    // Summary by role
    const roleCounts: Record<string, number> = {};
    users.forEach(user => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });

    console.log("\n📊 Summary by Role:");
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} user(s)`);
    });

    // List admin emails
    const adminUsers = users.filter(u => u.role !== "USER");
    if (adminUsers.length > 0) {
      console.log("\n🔐 Admin Users:");
      adminUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }

    const superAdmins = users.filter(u => u.role === "SUPER_ADMIN");
    if (superAdmins.length > 0) {
      console.log("\n👑 Super Admin Users:");
      superAdmins.forEach(user => {
        console.log(`   - ${user.email}`);
      });
    }

  } catch (error) {
    console.error("❌ Error fetching users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

