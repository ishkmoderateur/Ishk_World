const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log('\nUsage: node scripts/test-login.js <email> <password>\n');
    process.exit(1);
  }

  try {
    console.log('\n=== LOGIN TEST ===\n');
    console.log('Testing email:', email);
    console.log('Testing password:', password);
    console.log('');

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true
      }
    });

    if (!user) {
      console.log('❌ User NOT found in database');
      console.log('\nAll users in database:');
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true }
      });
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   Has password:', !!user.password);
    console.log('');

    if (!user.password) {
      console.log('❌ User has no password set!');
      console.log('Run: node scripts/reset-user-password.js', email, 'NewPassword123');
      process.exit(1);
    }

    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('✅ Password is CORRECT!');
      console.log('\nYou should be able to login with:');
      console.log('   Email:', user.email);
      console.log('   Password:', password);
    } else {
      console.log('❌ Password is INCORRECT!');
      console.log('\nReset password with:');
      console.log('   node scripts/reset-user-password.js', email, 'NewPassword123');
    }
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message, '\n');
    process.exit(1);
  }
}

testLogin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
