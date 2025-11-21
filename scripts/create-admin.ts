import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || "admin@ishk.com";
  const password = process.argv[3] || "admin123";
  const role = process.argv[4] || "SUPER_ADMIN";

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`⚠️  User ${email} already exists. Updating role to ${role}...`);
      const updated = await prisma.user.update({
        where: { email },
        data: { role: role as any },
      });
      console.log(`✅ User updated: ${updated.email} (Role: ${updated.role})`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Admin User",
        role: role as any,
      },
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password: ${password}`);
    console.log(`\n⚠️  Please change the password after first login!`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();




