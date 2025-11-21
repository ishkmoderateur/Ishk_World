import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Testing database connection...\n");
  
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  
  try {
    // Test connection
    await prisma.$connect();
    console.log("✅ Prisma connected successfully\n");
    
    // Count users
    const userCount = await prisma.user.count();
    console.log("📊 Total users in database:", userCount);
    
    // Find the specific user
    const email = "superadmin@ishk.test";
    console.log("\n🔍 Searching for user:", email);
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    if (user) {
      console.log("✅ User found:", user);
    } else {
      console.log("❌ User not found!");
      console.log("\n📋 All users in database:");
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true },
      });
      allUsers.forEach((u) => console.log(`   - ${u.email} (${u.name})`));
    }
    
    // Test with lowercase
    console.log("\n🔍 Searching with lowercase:", email.toLowerCase());
    const userLower = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { email: true, name: true },
    });
    
    if (userLower) {
      console.log("✅ User found with lowercase:", userLower);
    } else {
      console.log("❌ User not found with lowercase either!");
    }
    
  } catch (error) {
    console.error("❌ Database error:", error);
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

