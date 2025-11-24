import { prisma } from "../src/lib/prisma";

async function checkAdmin() {
  try {
    console.log("🔍 Checking super admin users...\n");

    const superAdmins = await prisma.user.findMany({
      where: {
        role: "SUPER_ADMIN",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        password: true, // We'll just check if it exists, not show it
      },
    });

    if (superAdmins.length === 0) {
      console.log("❌ No super admin users found in database");
      console.log("\n💡 You can create one using:");
      console.log("   npx tsx scripts/create-admin.ts <email> <password> SUPER_ADMIN");
    } else {
      console.log(`✅ Found ${superAdmins.length} super admin user(s):\n`);
      superAdmins.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}`);
        console.log(`   Name: ${admin.name || "N/A"}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Has Password: ${admin.password ? "✅ Yes" : "❌ No"}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log("");
      });
      
      console.log("⚠️  Password is hashed and cannot be displayed.");
      console.log("💡 If you forgot the password, you can reset it or create a new admin user.");
    }

  } catch (error) {
    console.error("❌ Error checking admin users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();




