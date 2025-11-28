import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  validateAndSanitizeEmail,
  isValidPassword,
  validateRequired,
  sanitizeString,
  isValidPhone,
} from "@/lib/validation";
import {
  createVerificationCode,
  sendVerificationEmail,
} from "@/lib/email-verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Server: Registration request received:", {
        email: body.email ? "***" : "MISSING",
        hasPassword: !!body.password,
        passwordLength: body.password?.length || 0,
        hasName: !!body.name,
      });
    }
    
    const { email, password, name, phone } = body;

    // Validate required fields
    const requiredValidation = validateRequired(body, ["email", "password"]);
    if (!requiredValidation.valid) {
      const errorMsg = `Missing required fields: ${requiredValidation.missing.join(", ")}`;
      if (process.env.NODE_ENV === "development") {
        console.log("❌ Server: Registration validation failed:", errorMsg);
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    // Validate and sanitize email
    const sanitizedEmail = validateAndSanitizeEmail(email);
    if (!sanitizedEmail) {
      const errorMsg = "Invalid email address";
      if (process.env.NODE_ENV === "development") {
        console.log("❌ Server: Email validation failed for:", email);
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      const errorMsg = passwordValidation.error || "Invalid password";
      if (process.env.NODE_ENV === "development") {
        console.log("❌ Server: Password validation failed:", errorMsg);
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone && typeof phone === "string" && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Check if user already exists - if so, try to sign them in
    const existing = await prisma.user.findUnique({ 
      where: { email: sanitizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        emailVerified: true,
      }
    });
    
    if (existing) {
      // User exists - verify password and sign them in
      if (!existing.password) {
        // User exists but has no password (OAuth user)
        return NextResponse.json(
          { 
            error: "An account with this email already exists. Please sign in with Google or use a different email.",
            existingAccount: true,
          },
          { status: 409 }
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, existing.password);
      
      if (isValidPassword) {
        // Password matches - return success with sign-in flag
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Server: User exists with matching password - will sign in:", sanitizedEmail);
        }
        
        return NextResponse.json(
          {
            user: {
              id: existing.id,
              email: existing.email,
              name: existing.name,
              role: existing.role,
              emailVerified: existing.emailVerified,
            },
            message: "Account found. Signing you in...",
            shouldSignIn: true, // Flag to tell frontend to sign in
            existingAccount: true,
          },
          { status: 200 }
        );
      } else {
        // Password doesn't match
        return NextResponse.json(
          { 
            error: "An account with this email already exists. Please sign in or use a different email.",
            existingAccount: true,
          },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Sanitize name and phone
    const sanitizedName = name ? sanitizeString(name) : null;
    const sanitizedPhone = phone ? sanitizeString(phone) : null;

    // Create user (email not verified yet)
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashed,
        name: sanitizedName,
        phone: sanitizedPhone,
        // emailVerified is null by default - will be set after verification
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Server: User created successfully:", {
        id: user.id,
        email: user.email,
        name: user.name,
      });
    }

    // Generate and send verification code via email
    let emailSent = false;
    let emailError: string | null = null;
    
    console.log("📧 Starting email verification process for:", sanitizedEmail);
    
    // Check if email is configured
    const { isEmailConfigured } = await import("@/lib/email");
    if (!isEmailConfigured()) {
      emailError = "Email service not configured. Please contact support.";
      console.error("❌ Email service not configured");
      console.error("   BREVO_SMTP_PASSWORD:", process.env.BREVO_SMTP_PASSWORD ? "SET" : "NOT SET");
      console.error("   BREVO_SMTP_USER:", process.env.BREVO_SMTP_USER || "NOT SET");
    } else {
      const verificationData = await createVerificationCode(sanitizedEmail);
      if (verificationData) {
        console.log("✅ Verification code created successfully");
        console.log("   Code:", verificationData.code);
        console.log("   Email:", sanitizedEmail);
        
        emailSent = await sendVerificationEmail(sanitizedEmail, verificationData.token, verificationData.code);
        
        if (emailSent) {
          console.log("✅ Verification email with code sent successfully to:", sanitizedEmail);
          console.log("   Code:", verificationData.code);
        } else {
          emailError = "Failed to send verification email. Please try again or contact support.";
          console.error("❌ Failed to send verification email to:", sanitizedEmail);
          console.error("   Code was generated:", verificationData.code);
          console.error("   Check server logs for SMTP errors");
        }
      } else {
        emailError = "Failed to generate verification code. Please try again.";
        console.error("❌ Failed to create verification code");
      }
    }

    return NextResponse.json(
      {
        user,
        message: emailSent 
          ? "Account created successfully. Please check your email for the verification code."
          : "Account created successfully, but verification email could not be sent. " + (emailError || "Please contact support."),
        emailSent: emailSent,
        emailError: emailError || undefined,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Registration error:", error);
    }
    
    // Return generic error message in production
    const errorMessage = process.env.NODE_ENV === "development" 
      ? (error instanceof Error ? error.message : "Failed to register user")
      : "Failed to register user";
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


