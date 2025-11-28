/**
 * Test email sending functionality
 * Usage: npx tsx scripts/test-email.ts <email>
 */

import "dotenv/config";
import { sendEmail, isEmailConfigured } from "../src/lib/email";
import { createVerificationCode, sendVerificationEmail } from "../src/lib/email-verification";

async function testEmail(email: string) {
  console.log("🧪 Testing email configuration...\n");

  // Check configuration
  console.log("📋 Configuration Check:");
  console.log("   BREVO_SMTP_USER:", process.env.BREVO_SMTP_USER || "NOT SET");
  console.log("   BREVO_SMTP_PASSWORD:", process.env.BREVO_SMTP_PASSWORD ? "***SET***" : "NOT SET");
  console.log("   BREVO_SENDER_EMAIL:", process.env.BREVO_SENDER_EMAIL || "NOT SET");
  console.log("   BREVO_SENDER_NAME:", process.env.BREVO_SENDER_NAME || "NOT SET");
  console.log("   NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "NOT SET");
  console.log("   NODE_ENV:", process.env.NODE_ENV || "NOT SET");
  console.log("");

  // Check if email is configured
  if (!isEmailConfigured()) {
    console.error("❌ Email is NOT configured!");
    console.error("   Please check your BREVO_SMTP_PASSWORD in .env file");
    process.exit(1);
  }

  console.log("✅ Email is configured\n");

  // Test 1: Simple email
  console.log("📧 Test 1: Sending simple test email...");
  try {
    const result1 = await sendEmail({
      to: email,
      subject: "Test Email from Ishk Platform",
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from your Ishk platform.</p>
        <p>If you received this, your email configuration is working!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `,
      text: `Test Email\n\nThis is a test email from your Ishk platform.\n\nIf you received this, your email configuration is working!\n\nTime: ${new Date().toLocaleString()}`,
    });

    if (result1) {
      console.log("✅ Simple email sent successfully!\n");
    } else {
      console.error("❌ Failed to send simple email\n");
    }
  } catch (error) {
    console.error("❌ Error sending simple email:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
  }

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Verification code email
  console.log("📧 Test 2: Sending verification code email...");
  try {
    const verificationData = await createVerificationCode(email);
    if (verificationData) {
      console.log("   Code generated:", verificationData.code);
      const result2 = await sendVerificationEmail(email, verificationData.token, verificationData.code);
      
      if (result2) {
        console.log("✅ Verification code email sent successfully!");
        console.log(`   Check your email (${email}) for the code: ${verificationData.code}`);
      } else {
        console.error("❌ Failed to send verification code email");
      }
    } else {
      console.error("❌ Failed to create verification code");
    }
  } catch (error) {
    console.error("❌ Error sending verification code email:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
  }

  console.log("\n✅ Email tests completed!");
  console.log("   Please check your inbox (and spam folder) for the test emails.");
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: npx tsx scripts/test-email.ts <email>");
  console.log("\nExample:");
  console.log("  npx tsx scripts/test-email.ts your@email.com");
  process.exit(1);
}

testEmail(email);

