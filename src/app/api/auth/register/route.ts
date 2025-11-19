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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, password, name, phone } = body;

    // Validate required fields
    const requiredValidation = validateRequired(body, ["email", "password"]);
    if (!requiredValidation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredValidation.missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate and sanitize email
    const sanitizedEmail = validateAndSanitizeEmail(email);
    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error || "Invalid password" },
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

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Sanitize name and phone
    const sanitizedName = name ? sanitizeString(name) : null;
    const sanitizedPhone = phone ? sanitizeString(phone) : null;

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashed,
        name: sanitizedName,
        phone: sanitizedPhone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
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


