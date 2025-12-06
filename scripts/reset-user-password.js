const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('\nUsage: node scripts/reset-user-password.js <email> <new-password>\n');
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
      select: { id: true, email: true, name: true, role: true }
    });

    console.log('\n✅ Password reset successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   New Password: ${newPassword}\n`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.log(`\n❌ Error: User with email "${email}" not found\n`);
    } else {
      console.error('\n❌ Error:', error.message, '\n');
    }
    process.exit(1);
  }
}

resetPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
