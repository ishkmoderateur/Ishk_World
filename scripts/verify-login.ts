import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "superadmin@ishk.test";
  const password = "test123";

  console.log("🔍 Verifying login credentials...\n");

  // Check user exists
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
    },
  });

  if (!user) {
    console.log("❌ User not found!");
    console.log("   Searching for:", email.toLowerCase());
    console.log("\n   Available users:");
    const allUsers = await prisma.user.findMany({
      select: { email: true },
    });
    allUsers.forEach((u) => console.log("   -", u.email));
    return;
  }

  console.log("✅ User found:");
  console.log("   Email:", user.email);
  console.log("   Name:", user.name);
  console.log("   Role:", user.role);
  console.log("   Has password:", !!user.password);
  console.log("   Password hash:", user.password ? user.password.substring(0, 20) + "..." : "NULL");

  if (!user.password) {
    console.log("\n❌ User has no password set!");
    return;
  }

  // Test password
  console.log("\n🔐 Testing password...");
  const isValid = await bcrypt.compare(password, user.password);
  console.log("   Password 'test123' matches:", isValid);

  if (!isValid) {
    console.log("\n❌ Password mismatch!");
    console.log("   Trying to verify with new hash...");
    const newHash = await bcrypt.hash(password, 10);
    console.log("   New hash would be:", newHash.substring(0, 30) + "...");
    console.log("   Old hash is:", user.password.substring(0, 30) + "...");
  } else {
    console.log("\n✅ Password verification successful!");
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

