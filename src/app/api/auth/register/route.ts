import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📝 Registration attempt:", { email: body.email, hasPassword: !!body.password, passwordLength: body.password?.length, name: body.name });
    
    let { email, password, name, phone } = body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Normalize email (trim and lowercase)
    email = email.trim().toLowerCase();

    if (!isValidEmail(email)) {
      console.log("❌ Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      console.log(`❌ Invalid password: type=${typeof password}, length=${password?.length}`);
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log("❌ User already exists:", email);
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    console.log("✅ Creating user:", email);
    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || null,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    console.log("✅ User created successfully:", user.email);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    // Return more specific error message in development
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Failed to register user"
      : "Failed to register user";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


