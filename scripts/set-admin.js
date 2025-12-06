const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setAdmin() {
  const email = process.argv[2];
  const role = process.argv[3];

  if (!email || !role) {
    console.log('\nUsage: node scripts/set-admin.js <email> <role>');
    console.log('\nAvailable roles:');
    console.log('  SUPER_ADMIN        - Full access to everything');
    console.log('  ADMIN_NEWS         - Manage news section');
    console.log('  ADMIN_PARTY        - Manage party services & venues');
    console.log('  ADMIN_BOUTIQUE     - Manage boutique & products');
    console.log('  ADMIN_ASSOCIATION  - Manage campaigns & donations');
    console.log('  ADMIN_PHOTOGRAPHY  - Manage photography services');
    console.log('  USER               - Regular user (remove admin)\n');
    process.exit(1);
  }

  const validRoles = ['SUPER_ADMIN', 'ADMIN_NEWS', 'ADMIN_PARTY', 'ADMIN_BOUTIQUE', 'ADMIN_ASSOCIATION', 'ADMIN_PHOTOGRAPHY', 'USER'];
  
  if (!validRoles.includes(role)) {
    console.log(`\nError: Invalid role "${role}"`);
    console.log('Valid roles:', validRoles.join(', '));
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role },
      select: { id: true, email: true, name: true, role: true }
    });

    console.log('\n✅ User role updated successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Role: ${user.role}\n`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.log(`\n❌ Error: User with email "${email}" not found\n`);
    } else {
      console.error('\n❌ Error:', error.message, '\n');
    }
    process.exit(1);
  }
}

setAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
