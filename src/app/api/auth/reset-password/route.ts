import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || "secret123";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) return NextResponse.json({ error: "Token and password required" }, { status: 400 });

  try {
    // 1️⃣ التحقق من التوكن
    const decoded = jwt.verify(token, RESET_PASSWORD_SECRET) as { userId: string };
    const userId = decoded.userId;

    // 2️⃣ تشفير الباسوورد الجديد
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ تحديث الباسوورد في Supabase
    await supabaseServer.from("users").update({ password: hashedPassword }).eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
