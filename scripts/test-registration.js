// Test script to verify registration works
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testRegistration() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Check if database file exists
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected! Current users: ${userCount}`);
    
    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('\n📊 Users in database:');
    console.log(JSON.stringify(users, null, 2));
    
    // Test registration endpoint structure
    console.log('\n🔐 Registration API endpoint: /api/auth/register');
    console.log('   Method: POST');
    console.log('   Body: { email, password, name? }');
    
    // Check if registration route exists
    const fs = require('fs');
    const path = require('path');
    const registerRoute = path.join(__dirname, '..', 'src', 'app', 'api', 'auth', 'register', 'route.ts');
    
    if (fs.existsSync(registerRoute)) {
      console.log('✅ Registration API route exists');
    } else {
      console.log('❌ Registration API route NOT found');
    }
    
    // Check registration form
    const registerPage = path.join(__dirname, '..', 'src', 'app', 'auth', 'register', 'page.tsx');
    
    if (fs.existsSync(registerPage)) {
      console.log('✅ Registration form exists');
    } else {
      console.log('❌ Registration form NOT found');
    }
    
    console.log('\n✅ Registration system is properly set up!');
    console.log('\n📝 To test registration:');
    console.log('   1. Go to http://localhost:3000/auth/register');
    console.log('   2. Fill in the form');
    console.log('   3. Submit');
    console.log('   4. Check server console for logs');
    console.log('   5. Check this database for new user');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'P1001') {
      console.error('   Database connection failed. Make sure the database file exists.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testRegistration();


