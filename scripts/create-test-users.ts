import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating test users...");

  // Hash password for all users
  const hashedPassword = await bcrypt.hash("test123", 10);

  // Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@ishk.test" },
    update: {
      role: "SUPER_ADMIN",
      password: hashedPassword,
    },
    create: {
      email: "superadmin@ishk.test",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Super Admin created:", superAdmin.email);

  // Create News Admin
  const newsAdmin = await prisma.user.upsert({
    where: { email: "newsadmin@ishk.test" },
    update: {
      role: "ADMIN_NEWS",
      password: hashedPassword,
    },
    create: {
      email: "newsadmin@ishk.test",
      name: "News Admin",
      password: hashedPassword,
      role: "ADMIN_NEWS",
    },
  });
  console.log("✅ News Admin created:", newsAdmin.email);

  // Create Party Admin
  const partyAdmin = await prisma.user.upsert({
    where: { email: "partyadmin@ishk.test" },
    update: {
      role: "ADMIN_PARTY",
      password: hashedPassword,
    },
    create: {
      email: "partyadmin@ishk.test",
      name: "Party Admin",
      password: hashedPassword,
      role: "ADMIN_PARTY",
    },
  });
  console.log("✅ Party Admin created:", partyAdmin.email);

  // Create Boutique Admin
  const boutiqueAdmin = await prisma.user.upsert({
    where: { email: "boutiqueadmin@ishk.test" },
    update: {
      role: "ADMIN_BOUTIQUE",
      password: hashedPassword,
    },
    create: {
      email: "boutiqueadmin@ishk.test",
      name: "Boutique Admin",
      password: hashedPassword,
      role: "ADMIN_BOUTIQUE",
    },
  });
  console.log("✅ Boutique Admin created:", boutiqueAdmin.email);

  // Create Association Admin
  const associationAdmin = await prisma.user.upsert({
    where: { email: "associationadmin@ishk.test" },
    update: {
      role: "ADMIN_ASSOCIATION",
      password: hashedPassword,
    },
    create: {
      email: "associationadmin@ishk.test",
      name: "Association Admin",
      password: hashedPassword,
      role: "ADMIN_ASSOCIATION",
    },
  });
  console.log("✅ Association Admin created:", associationAdmin.email);

  // Create Photography Admin
  const photographyAdmin = await prisma.user.upsert({
    where: { email: "photographyadmin@ishk.test" },
    update: {
      role: "ADMIN_PHOTOGRAPHY",
      password: hashedPassword,
    },
    create: {
      email: "photographyadmin@ishk.test",
      name: "Photography Admin",
      password: hashedPassword,
      role: "ADMIN_PHOTOGRAPHY",
    },
  });
  console.log("✅ Photography Admin created:", photographyAdmin.email);

  // Create Regular User
  const regularUser = await prisma.user.upsert({
    where: { email: "user@ishk.test" },
    update: {
      role: "USER",
      password: hashedPassword,
    },
    create: {
      email: "user@ishk.test",
      name: "Regular User",
      password: hashedPassword,
      role: "USER",
    },
  });
  console.log("✅ Regular User created:", regularUser.email);

  console.log("\n📋 Test Accounts Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Super Admin:      superadmin@ishk.test      / test123");
  console.log("News Admin:       newsadmin@ishk.test       / test123");
  console.log("Party Admin:      partyadmin@ishk.test      / test123");
  console.log("Boutique Admin:   boutiqueadmin@ishk.test  / test123");
  console.log("Association Admin: associationadmin@ishk.test / test123");
  console.log("Photography Admin: photographyadmin@ishk.test / test123");
  console.log("Regular User:     user@ishk.test           / test123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("Error creating test users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });






