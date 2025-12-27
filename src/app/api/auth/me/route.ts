

import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/shared/libs/auth/cookies";
import { verifyToken } from "@/shared/libs/auth/jwt";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const token = getSessionToken(req);

    if (!token) {
      return NextResponse.json(
        { error: "no session token found" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "invalid token" },
        { status: 401 }
      );
    }

    const { data: user, error: dbError } = await supabaseServer
      .from("users")
      .select("id, email, name, created_at")
      .eq("id", payload.userId)
      .single();

    if (dbError || !user) {
      return NextResponse.json(
        { error: "the user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
