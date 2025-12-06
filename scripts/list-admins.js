const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAdmins() {
  const admins = await prisma.user.findMany({
    where: {
      role: {
        not: 'USER'
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      role: 'asc'
    }
  });

  console.log('\n=== ADMIN USERS ===\n');
  
  if (admins.length === 0) {
    console.log('No admin users found.\n');
    return;
  }

  admins.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.email}`);
    console.log(`   Name: ${admin.name || 'N/A'}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
    console.log('');
  });
  
  console.log(`Total admins: ${admins.length}\n`);
}

listAdmins()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
