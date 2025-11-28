/**
 * Email verification utilities
 * Secure token generation and validation for email confirmation
 */

import crypto from "crypto";
import { prisma } from "./prisma";
import { sendEmail, isEmailConfigured } from "./email";
import { sanitizeString } from "./validation";

/**
 * Generate a secure random token for email verification
 * Uses crypto.randomBytes for cryptographically secure randomness
 */
export function generateVerificationToken(): string {
  // Generate 32 random bytes and convert to base64url (URL-safe)
  const token = crypto.randomBytes(32).toString("base64url");
  return token;
}

/**
 * Generate a 6-digit verification code
 * Uses crypto.randomBytes for cryptographically secure randomness
 */
export function generateVerificationCode(): string {
  // Generate a random 6-digit code (000000 to 999999)
  const code = crypto.randomInt(100000, 999999).toString();
  return code;
}

/**
 * Create and store a verification token in the database
 * Token expires in 24 hours
 */
export async function createVerificationToken(email: string): Promise<string | null> {
  try {
    // Validate email format
    if (typeof email !== "string" || !email.includes("@")) {
      return null;
    }

    const sanitizedEmail = email.trim().toLowerCase();
    
    // Generate secure token
    const token = generateVerificationToken();
    
    // Token expires in 24 hours
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: sanitizedEmail,
      },
    });

    // Create new token
    await prisma.verificationToken.create({
      data: {
        identifier: sanitizedEmail,
        token: token,
        expires: expires,
      },
    });

    return token;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating verification token:", error);
    }
    return null;
  }
}

/**
 * Create and store a verification code in the database
 * Code expires in 15 minutes for security
 * Returns both the code and token (code for display, token for verification)
 */
export async function createVerificationCode(email: string): Promise<{ code: string; token: string } | null> {
  try {
    // Validate email format
    if (typeof email !== "string" || !email.includes("@")) {
      return null;
    }

    const sanitizedEmail = email.trim().toLowerCase();
    
    // Generate 6-digit code
    const code = generateVerificationCode();
    
    // Generate secure token (stored in DB, code is what user sees)
    const token = generateVerificationToken();
    
    // Code expires in 15 minutes for security
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: sanitizedEmail,
      },
    });

    // Store token with code embedded (format: code-token for easy lookup)
    // We'll store the code in the token field for lookup, and the full token separately
    await prisma.verificationToken.create({
      data: {
        identifier: sanitizedEmail,
        token: `${code}-${token}`, // Store code-token combination
        expires: expires,
      },
    });

    return { code, token };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating verification code:", error);
    }
    return null;
  }
}

/**
 * Verify a 6-digit code
 * Returns true if code is valid and email is verified
 */
export async function verifyEmailCode(email: string, code: string): Promise<{ success: boolean; email?: string; error?: string }> {
  try {
    if (typeof code !== "string" || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return { success: false, error: "Invalid code format. Code must be 6 digits." };
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Find all tokens for this email
    const verificationTokens = await prisma.verificationToken.findMany({
      where: {
        identifier: sanitizedEmail,
      },
    });

    if (verificationTokens.length === 0) {
      return { success: false, error: "No verification code found. Please request a new code." };
    }

    // Find token that matches the code
    let matchingToken = null;
    for (const vt of verificationTokens) {
      if (vt.token.startsWith(`${code}-`)) {
        matchingToken = vt;
        break;
      }
    }

    if (!matchingToken) {
      return { success: false, error: "Invalid verification code." };
    }

    // Check if code has expired
    if (matchingToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token: matchingToken.token },
      });
      return { success: false, error: "Verification code has expired. Please request a new code." };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if already verified
    if (user.emailVerified) {
      // Clean up token
      await prisma.verificationToken.delete({
        where: { token: matchingToken.token },
      });
      return { success: true, email: sanitizedEmail, error: "Email already verified" };
    }

    // Mark email as verified
    await prisma.user.update({
      where: { email: sanitizedEmail },
      data: {
        emailVerified: new Date(),
      },
    });

    // Clean up all tokens for this email after successful verification
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: sanitizedEmail,
      },
    });

    return { success: true, email: sanitizedEmail };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error verifying email code:", error);
    }
    return { success: false, error: "Failed to verify code" };
  }
}

/**
 * Verify a token and mark email as verified
 * Returns true if token is valid and email is verified
 */
export async function verifyEmailToken(token: string): Promise<{ success: boolean; email?: string; error?: string }> {
  try {
    if (typeof token !== "string" || token.length < 10) {
      return { success: false, error: "Invalid token format" };
    }

    // Find token in database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return { success: false, error: "Invalid or expired token" };
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return { success: false, error: "Token has expired" };
    }

    const email = verificationToken.identifier;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if already verified
    if (user.emailVerified) {
      // Clean up token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return { success: true, email, error: "Email already verified" };
    }

    // Mark email as verified
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    // Clean up token after successful verification
    await prisma.verificationToken.delete({
      where: { token },
    });

    return { success: true, email };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error verifying email token:", error);
    }
    return { success: false, error: "Failed to verify email" };
  }
}

/**
 * Send verification email with code to user
 * Returns true if email was sent successfully
 */
export async function sendVerificationEmail(email: string, token: string, code?: string): Promise<boolean> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️  Brevo SMTP not configured. Email verification emails will not be sent.");
    }
    return false;
  }

  try {
    const sanitizedEmail = email.trim().toLowerCase();
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    // Create verification URL
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;
    
    // Sanitize URL for email HTML
    const safeUrl = sanitizeString(verificationUrl);

    // If code is provided, use code-based verification
    if (code) {
      return await sendEmail({
        to: sanitizedEmail,
        subject: "Your verification code - Ishk",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your email</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h1 style="color: #2c3e50; margin-top: 0;">Verify Your Email Address</h1>
              <p>Thank you for registering with Ishk! Please use the verification code below to verify your email address:</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #ffffff; border: 3px solid #3498db; border-radius: 10px; padding: 20px; display: inline-block;">
                  <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Your verification code:</p>
                  <p style="font-size: 36px; font-weight: bold; color: #2c3e50; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${code}</p>
                </div>
              </div>
              <p style="font-size: 14px; color: #666;">Enter this code on the verification page to complete your registration.</p>
              <p style="font-size: 14px; color: #e74c3c; font-weight: bold;">⚠️ This code will expire in 15 minutes.</p>
              <p style="font-size: 14px; color: #666;">If you didn't create an account with Ishk, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} Ishk. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
        text: `
          Verify Your Email Address
          
          Thank you for registering with Ishk! Please use the verification code below to verify your email address:
          
          Your verification code: ${code}
          
          Enter this code on the verification page to complete your registration.
          
          ⚠️ This code will expire in 15 minutes.
          
          If you didn't create an account with Ishk, please ignore this email.
          
          © ${new Date().getFullYear()} Ishk. All rights reserved.
        `,
      });
    }

    // Fallback to link-based verification
    return await sendEmail({
      to: sanitizedEmail,
      subject: "Verify your email address - Ishk",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h1 style="color: #2c3e50; margin-top: 0;">Verify Your Email Address</h1>
            <p>Thank you for registering with Ishk! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${safeUrl}" style="background-color: #3498db; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email Address</a>
            </div>
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">${safeUrl}</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 24 hours.</p>
            <p style="font-size: 14px; color: #666;">If you didn't create an account with Ishk, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} Ishk. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Verify Your Email Address
        
        Thank you for registering with Ishk! Please verify your email address by visiting the following link:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with Ishk, please ignore this email.
        
        © ${new Date().getFullYear()} Ishk. All rights reserved.
      `,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error sending verification email:", error);
    }
    return false;
  }
}

/**
 * Check if user's email is verified
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const sanitizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: { emailVerified: true },
    });

    return user?.emailVerified !== null && user?.emailVerified !== undefined;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error checking email verification status:", error);
    }
    return false;
  }
}

