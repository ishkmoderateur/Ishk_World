#!/usr/bin/env node

/**
 * Verification script for Google OAuth configuration
 * Run this on your VPS to verify the setup
 */

require('dotenv').config();

console.log('🔍 Verifying Google OAuth Configuration...\n');

// Check required environment variables
const requiredVars = {
  'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
  'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
  'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
};

let allValid = true;

console.log('📋 Environment Variables:');
console.log('─'.repeat(50));

for (const [key, value] of Object.entries(requiredVars)) {
  const exists = !!value;
  const trimmed = value?.trim();
  const isEmpty = !trimmed || trimmed.length === 0;
  
  if (exists && !isEmpty) {
    // Mask sensitive values
    let displayValue = value;
    if (key.includes('SECRET') || key.includes('SECRET')) {
      displayValue = value.substring(0, 10) + '...' + value.substring(value.length - 5);
    } else if (key === 'GOOGLE_CLIENT_ID') {
      displayValue = value.substring(0, 20) + '...';
    }
    
    console.log(`✅ ${key}: ${displayValue}`);
    
    // Validate format
    if (key === 'NEXTAUTH_URL') {
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        console.log(`   ⚠️  Warning: ${key} should start with http:// or https://`);
        allValid = false;
      }
      if (value.endsWith('/')) {
        console.log(`   ⚠️  Warning: ${key} should not end with a slash`);
        allValid = false;
      }
    }
    
    if (key === 'GOOGLE_CLIENT_ID' && !value.includes('.apps.googleusercontent.com')) {
      console.log(`   ⚠️  Warning: ${key} doesn't look like a valid Google Client ID`);
    }
  } else {
    console.log(`❌ ${key}: MISSING or EMPTY`);
    allValid = false;
  }
}

console.log('\n🔗 Expected Redirect URI:');
console.log('─'.repeat(50));

const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
if (nextAuthUrl) {
  const redirectUri = `${nextAuthUrl}/api/auth/callback/google`;
  console.log(`✅ Should be configured in Google Cloud Console:`);
  console.log(`   ${redirectUri}`);
} else {
  console.log(`❌ Cannot determine redirect URI (NEXTAUTH_URL is missing)`);
  allValid = false;
}

console.log('\n📝 Google Cloud Console Checklist:');
console.log('─'.repeat(50));
console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
console.log('2. Find your OAuth 2.0 Client ID');
console.log('3. Under "Authorized redirect URIs", ensure you have:');
if (nextAuthUrl) {
  console.log(`   ✅ ${nextAuthUrl}/api/auth/callback/google`);
}
console.log('   ✅ http://localhost:3000/api/auth/callback/google (for local dev)');
console.log('4. Under "Authorized JavaScript origins", ensure you have:');
if (nextAuthUrl) {
  const origin = nextAuthUrl.replace(/\/$/, '');
  console.log(`   ✅ ${origin}`);
}
console.log('   ✅ http://localhost:3000');

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ All environment variables are set!');
  console.log('⚠️  Make sure the redirect URI is configured in Google Cloud Console.');
} else {
  console.log('❌ Some environment variables are missing or invalid.');
  console.log('⚠️  Please update your .env file and try again.');
}
console.log('='.repeat(50));
