/**
 * Register API Route
 * مسؤول عن إنشاء حساب جديد للمستخدم
 * 
 * الخطوات:
 * 1. استقبال email + password + name
 * 2. التحقق من صحة البيانات
 * 3. التحقق من قوة كلمة المرور
 * 4. عمل Hash لكلمة المرور باستخدام bcrypt (مع Salt تلقائي)
 * 5. حفظ المستخدم في قاعدة البيانات (Supabase)
 * 6. إنشاء JWT token
 * 7. تخزين JWT في Cookie آمنة
 * 8. إرجاع بيانات المستخدم
 */

import { supabaseServer } from "@/shared/libs/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, validatePasswordStrength } from "@/shared/libs/passwordHash";
import { createToken } from "@/shared/libs/jwt";
import { createResponseWithSession } from "@/shared/libs/cookies";

export const POST = async (req: NextRequest) => {
  try {
    // 1. استقبال البيانات
    const { email, name, password } = await req.json();

    // 2. التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { error: "الإيميل وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // 3. التحقق من صحة الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "الإيميل غير صالح" },
        { status: 400 }
      );
    }

    // 4. التحقق من قوة كلمة المرور
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: "كلمة المرور ضعيفة",
          details: passwordValidation.errors 
        },
        { status: 400 }
      );
    }

    // 5. التحقق من عدم وجود المستخدم مسبقًا
    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 409 }
      );
    }

    // 6. تشفير كلمة المرور (Hash + Salt)
    const hashedPassword = await hashPassword(password);

    // 7. إنشاء المستخدم في قاعدة البيانات
    // نخزن فقط الهاش - ليس كلمة المرور الأصلية
    const { data: user, error: dbError } = await supabaseServer
      .from('users')
      .insert({
        email,
        name: name || email.split('@')[0],
        password_hash: hashedPassword,
        created_at: new Date().toISOString(),
      })
      .select('id, email, name, created_at')
      .single();

    if (dbError || !user) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: "فشل في إنشاء المستخدم" },
        { status: 500 }
      );
    }

    // 8. إنشاء JWT Token
    const token = createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // 9. إرجاع الاستجابة مع Cookie آمنة
    return createResponseWithSession(
      {
        message: "تم إنشاء الحساب بنجاح",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
        },
      },
      token,
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء التسجيل" },
      { status: 500 }
    );
  }
}; 