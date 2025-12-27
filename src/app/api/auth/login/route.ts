import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/shared/libs/auth/password-hash";
import { createToken } from "@/shared/libs/auth/jwt";
import { createResponseWithSession } from "@/shared/libs/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const { data: user, error: dbError } = await supabaseServer
      .from("users")
      .select("id, email, name, password, created_at")
      .eq("email", email)
      .single();

    if (dbError || !user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,                
      email: user.email,
      name: user.name,
    });

    return createResponseWithSession(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
        },
      },
      token,
      200
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }

}
