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

import { supabaseServer } from "@/shared/libs/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/shared/libs/passwordHash";
import { createToken } from "@/shared/libs/jwt";
import { createResponseWithSession } from "@/shared/libs/cookies";

export async function POST(req: NextRequest) {
  try {
    // 1. استقبال البيانات
    const { email, password } = await req.json();

    // 2. التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { error: "الإيميل وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // 3. البحث عن المستخدم في قاعدة البيانات
    const { data: user, error: dbError } = await supabaseServer
      .from('users')
      .select('id, email, name, password, created_at')
      .eq('email', email)
      .single();

    if (dbError || !user) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صحيحة" },
        { status: 401 }
      );
    }

    // 4. التحقق من كلمة المرور
    // bcrypt.compare يقوم بمقارنة كلمة المرور مع الهاش
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: " كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // 5. إنشاء JWT Token
    const token = createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // 6. تحديث آخر تسجيل دخول (اختياري)
    // await supabaseServer
    //   .from('users')
    //   .update({ last_login: new Date().toISOString() })
    //   .eq('id', user.id);

    // 7. إرجاع الاستجابة مع Cookie آمنة
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}