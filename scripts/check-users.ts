import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking for test users in database...\n");

  const testEmails = [
    "superadmin@ishk.test",
    "newsadmin@ishk.test",
    "partyadmin@ishk.test",
    "boutiqueadmin@ishk.test",
    "associationadmin@ishk.test",
    "photographyadmin@ishk.test",
    "user@ishk.test",
  ];

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: testEmails,
      },
    },
    select: {
      email: true,
      name: true,
      role: true,
    },
  });

  console.log(`Found ${users.length} test users:\n`);
  
  if (users.length === 0) {
    console.log("❌ No test users found in database!");
    console.log("Run: npm run create-test-users\n");
  } else {
    users.forEach((user) => {
      console.log(`✅ ${user.email} - ${user.name} (${user.role})`);
    });
    
    const missing = testEmails.filter(
      (email) => !users.some((u) => u.email === email)
    );
    
    if (missing.length > 0) {
      console.log(`\n⚠️  Missing users:`);
      missing.forEach((email) => console.log(`   - ${email}`));
      console.log("\nRun: npm run create-test-users");
    } else {
      console.log("\n✅ All test users exist!");
    }
  }

  const totalUsers = await prisma.user.count();
  console.log(`\nTotal users in database: ${totalUsers}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });












