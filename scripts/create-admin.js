const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const role = process.argv[4];
  const name = process.argv[5];

  if (!email || !password || !role) {
    console.log('\nUsage: node scripts/create-admin.js <email> <password> <role> [name]');
    console.log('\nAvailable roles:');
    console.log('  SUPER_ADMIN        - Full access to everything');
    console.log('  ADMIN_NEWS         - Manage news section');
    console.log('  ADMIN_PARTY        - Manage party services & venues');
    console.log('  ADMIN_BOUTIQUE     - Manage boutique & products');
    console.log('  ADMIN_ASSOCIATION  - Manage campaigns & donations');
    console.log('  ADMIN_PHOTOGRAPHY  - Manage photography services\n');
    process.exit(1);
  }

  const validRoles = ['SUPER_ADMIN', 'ADMIN_NEWS', 'ADMIN_PARTY', 'ADMIN_BOUTIQUE', 'ADMIN_ASSOCIATION', 'ADMIN_PHOTOGRAPHY'];
  
  if (!validRoles.includes(role)) {
    console.log(`\nError: Invalid role "${role}"`);
    console.log('Valid roles:', validRoles.join(', '));
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name: name || email.split('@')[0],
        emailVerified: new Date()
      },
      select: { id: true, email: true, name: true, role: true }
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password: ${password}\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log(`\n❌ Error: User with email "${email}" already exists\n`);
    } else {
      console.error('\n❌ Error:', error.message, '\n');
    }
    process.exit(1);
  }
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
