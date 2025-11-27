import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log("❌ Usage: npx tsx scripts/reset-password.ts <email> <new-password>");
    console.log("\nExample:");
    console.log("  npx tsx scripts/reset-password.ts admin@example.com MyNewPassword123");
    process.exit(1);
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      console.log(`❌ User with email "${email}" not found!`);
      console.log("\nAvailable users:");
      const allUsers = await prisma.user.findMany({
        select: { email: true, role: true },
        orderBy: { email: "asc" },
      });
      allUsers.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`);
      });
      process.exit(1);
    }

    // Validate password length
    if (newPassword.length < 8) {
      console.log("❌ Password must be at least 8 characters long!");
      process.exit(1);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log("\n✅ Password reset successfully!");
    console.log(`\n📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name || "Not set"}`);
    console.log(`🔐 Role: ${user.role}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log("\n⚠️  Please keep this password secure!");
    console.log("⚠️  User should change password after first login.");

  } catch (error) {
    console.error("❌ Error resetting password:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();



