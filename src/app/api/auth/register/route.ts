/**
 * Register API Route (Next.js App Router)
 * مسؤول عن إنشاء حساب جديد للمستخدم
 */

import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, validatePasswordStrength } from "@/shared/libs/auth/password-hash";

export const POST = async (req: NextRequest) => {
  try {

    const { email, name, password } = await req.json();

    if (!email || !password) {
      console.warn("Missing email or password");
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn("Invalid email format:", email);
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }


const passwordValidation = validatePasswordStrength(password);

if (!passwordValidation.isValid) {
  return NextResponse.json(
    {
      error: "Weak password",
      details: passwordValidation.errors,
    },
    { status: 400 }
  );
}

    const { data: existingUser } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.warn("Email already in use:", email);
      return NextResponse.json({ error: "The email is already registered" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const { data: user, error: dbError } = await supabaseServer
      .from("users")
      .insert({
        email,
        name: name || email.split("@")[0],
        password: hashedPassword,
        created_at: new Date().toISOString(),
      })
      .select("id, email, name, created_at")
      .single();

    if (dbError || !user) {
      console.error("Database insertion failed:", dbError);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "User registered successfully. Please login to continue.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
};
