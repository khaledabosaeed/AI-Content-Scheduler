/**
 * Login API Route
 * مسؤول عن تسجيل دخول المستخدم
 *
 * الخطوات:
 * 1. استقبال email + password
 * 2. البحث عن المستخدم في قاعدة البيانات
 * 3. جلب الهاش المخزن
 * 4. مقارنة كلمة المرور المدخلة مع الهاش (باستخدام bcrypt)
 * 5. إذا كان التطابق صحيح → إنشاء JWT
 * 6. تخزين JWT في Cookie آمنة
 * 7. إرجاع بيانات المستخدم
 */

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
        { error: "الإيميل وكلمة المرور مطلوبان" },
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
        { error: "البريد الإلكتروني غير صحيحة" },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: " كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return createResponseWithSession(
      {
        message: "تم تسجيل الدخول بنجاح",
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
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }

}
