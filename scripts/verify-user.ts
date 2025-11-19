import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "superadmin@ishk.test";
  const testPassword = "test123";

  console.log(`Checking user: ${email}\n`);

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      role: true,
    },
  });

  if (!user) {
    console.log("❌ User not found in database!");
    console.log("\nCreating user...");
    
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name: "Super Admin",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });
    console.log("✅ User created:", newUser.email);
    return;
  }

  console.log("✅ User found:");
  console.log(`  - ID: ${user.id}`);
  console.log(`  - Email: ${user.email}`);
  console.log(`  - Name: ${user.name}`);
  console.log(`  - Role: ${user.role}`);
  console.log(`  - Has password: ${user.password ? "Yes" : "No"}`);

  if (user.password) {
    console.log("\n🔐 Testing password...");
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log(`  - Password match: ${isValid ? "✅ YES" : "❌ NO"}`);
    
    if (!isValid) {
      console.log("\n⚠️  Password doesn't match! Updating password...");
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
      console.log("✅ Password updated!");
      
      // Test again
      const newHash = await prisma.user.findUnique({
        where: { email },
        select: { password: true },
      });
      if (newHash?.password) {
        const isValidNow = await bcrypt.compare(testPassword, newHash.password);
        console.log(`  - Password match after update: ${isValidNow ? "✅ YES" : "❌ NO"}`);
      }
    }
  } else {
    console.log("\n⚠️  User has no password! Setting password...");
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    console.log("✅ Password set!");
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






