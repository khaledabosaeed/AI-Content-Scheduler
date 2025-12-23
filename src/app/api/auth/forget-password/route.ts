// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import jwt from "jsonwebtoken";

const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || "secret123";
const RESET_PASSWORD_EXP = "2m"; // صلاحية التوكن 2 دقيقة

export async function POST(req: Request) {
  const { email } = await req.json();

  // التحقق من وجود المستخدم
  const { data: user } = await supabaseServer
    .from("users")
    .select("id,email")
    .eq("email", email)
    .maybeSingle();

  // نرجع success دائمًا لتجنب كشف الإيميل
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // توليد JWT مؤقت للباسوورد
  const token = jwt.sign({ userId: user.id }, RESET_PASSWORD_SECRET, { expiresIn: RESET_PASSWORD_EXP });

  // الرابط لإعادة تعيين كلمة المرور
const resetLink = `http://localhost:3000/reset-password?token=${token}`;



  // هنا ترسل الإيميل فعليًا (مثلاً عبر Supabase Email أو SMTP)
  console.log("Reset password link (send via email):", resetLink);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      resetLink,
    }),
  });

  return NextResponse.json({ success: true,token  });
}
