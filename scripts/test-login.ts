import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testLogin() {
  const email = "superadmin@ishk.test";
  const password = "test123";

  console.log("🧪 Testing Login Flow\n");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);

  // Step 1: Find user
  console.log("1️⃣ Finding user in database...");
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("❌ User not found!");
    return;
  }
  console.log("✅ User found:", user.email);

  // Step 2: Check password
  console.log("\n2️⃣ Checking password...");
  if (!user.password) {
    console.log("❌ User has no password!");
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log("❌ Password doesn't match!");
    console.log("   Stored hash:", user.password.substring(0, 20) + "...");
    return;
  }
  console.log("✅ Password is valid!");

  // Step 3: Check role
  console.log("\n3️⃣ Checking role...");
  console.log(`   Role: ${user.role}`);

  console.log("\n✅ All checks passed! Login should work.");
  console.log("\nIf login still fails, check:");
  console.log("  - Server console for debug messages");
  console.log("  - Browser console for errors");
  console.log("  - Network tab for API responses");
}

testLogin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());







