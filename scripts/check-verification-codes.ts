/**
 * Check recent verification codes in the database
 * Usage: npx tsx scripts/check-verification-codes.ts [email]
 */

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function checkVerificationCodes(email?: string) {
  try {
    console.log("🔍 Checking verification codes...\n");

    const where = email 
      ? { identifier: email.trim().toLowerCase() }
      : {};

    const codes = await prisma.verificationToken.findMany({
      where,
      orderBy: {
        expires: "desc",
      },
      take: 10,
    });

    if (codes.length === 0) {
      console.log("❌ No verification codes found");
      if (email) {
        console.log(`   For email: ${email}`);
      }
      return;
    }

    console.log(`📋 Found ${codes.length} verification code(s):\n`);

    codes.forEach((code, index) => {
      const codePart = code.token.split("-")[0];
      const isExpired = code.expires < new Date();
      const status = isExpired ? "❌ EXPIRED" : "✅ ACTIVE";
      
      console.log(`${index + 1}. ${status}`);
      console.log(`   Email: ${code.identifier}`);
      console.log(`   Code: ${codePart}`);
      console.log(`   Expires: ${new Date(code.expires).toLocaleString()}`);
      console.log(`   Created: ${new Date(code.expires.getTime() - 15 * 60 * 1000).toLocaleString()}`);
      console.log("");
    });

    // Show the most recent code
    const latest = codes[0];
    const latestCode = latest.token.split("-")[0];
    const isExpired = latest.expires < new Date();
    
    console.log("─".repeat(50));
    console.log(`\n📧 Latest verification code:`);
    console.log(`   Email: ${latest.identifier}`);
    console.log(`   Code: ${latestCode}`);
    console.log(`   Status: ${isExpired ? "EXPIRED" : "ACTIVE"}`);
    console.log(`   Expires: ${new Date(latest.expires).toLocaleString()}`);
  } catch (error) {
    console.error("❌ Error checking verification codes:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
checkVerificationCodes(email);

