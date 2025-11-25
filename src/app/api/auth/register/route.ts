/**
 * Register API Route (Next.js App Router)
 * مسؤول عن إنشاء حساب جديد للمستخدم
 */

import { supabaseServer } from "@/shared/libs/suapa-base/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, validatePasswordStrength } from "@/shared/libs/auth/passwordHash";
import { createToken } from "@/shared/libs/auth/jwt";
import { createResponseWithSession } from "@/shared/libs/auth/cookies";

export const POST = async (req: NextRequest) => {
  try {
    // 1️⃣ استقبال البيانات
    const { email, name, password } = await req.json();
    console.log("Payload received:", { email, name, password });

    // 2️⃣ التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      console.warn("Missing email or password");
      return NextResponse.json({ error: "الإيميل وكلمة المرور مطلوبان" }, { status: 400 });
    }

    // 3️⃣ التحقق من صحة الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn("Invalid email format:", email);
      return NextResponse.json({ error: "الإيميل غير صالح" }, { status: 400 });
    }

    // 4️⃣ التحقق من قوة كلمة المرور
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      console.warn("Weak password:", passwordValidation.errors);
      return NextResponse.json(

        { error: "كلمة المرور ضعيفة", details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // 5️⃣ التحقق من عدم وجود المستخدم مسبقًا
    const { data: existingUser, error: checkError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    console.log("Existing user:", existingUser, "Check error:", checkError);

    if (existingUser) {
      console.warn("Email already in use:", email);
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
    }

    // 6️⃣ تشفير كلمة المرور
    const hashedPassword = await hashPassword(password);
    console.log("Hashed password:", hashedPassword);

    // 7️⃣ إنشاء المستخدم في قاعدة البيانات
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
    console.log("Inserted user:", user, "DB error:", dbError);

    if (dbError || !user) {
      console.error("Database insertion failed:", dbError);
      return NextResponse.json({ error: "فشل في إنشاء المستخدم" }, { status: 500 });
    }

    // 8️⃣ إنشاء JWT Token
    const token = createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    console.log("JWT token created");

    // 9️⃣ إرجاع الاستجابة مع Cookie آمنة
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
    console.error("Register error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء التسجيل" }, { status: 500 });
  }
};
