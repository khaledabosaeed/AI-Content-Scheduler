/**
 * Get Current User API Route (Session Restore)
 * مسؤول عن استعادة جلسة المستخدم
 *
 * الخطوات:
 * 1. قراءة Cookie الجلسة تلقائيًا
 * 2. استخراج JWT من الكوكي
 * 3. التحقق من صحة وتوقيع JWT
 * 4. إذا كان صحيح وغير منتهي → استخراج user_id
 * 5. جلب بيانات المستخدم من قاعدة البيانات
 * 6. إرجاع بيانات المستخدم
 *
 * استخدام:
 * - يستدعى عند فتح الموقع لاستعادة الجلسة
 * - يستدعى من Client Components للتحقق من الجلسة
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/shared/libs/auth/cookies";
import { verifyToken } from "@/shared/libs/auth/jwt";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    // 1. قراءة JWT من الكوكي
    const token = getSessionToken(req);

    if (!token) {
      return NextResponse.json(
        { error: "غير مصرح - لا توجد جلسة نشطة" },
        { status: 401 }
      );
    }

    // 2. التحقق من صحة JWT
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "غير مصرح - جلسة غير صالحة أو منتهية" },
        { status: 401 }
      );
    }

    // 3. جلب بيانات المستخدم من قاعدة البيانات
    const { data: user, error: dbError } = await supabaseServer
      .from("users")
      .select("id, email, name, created_at")
      .eq("id", payload.userId)
      .single();

    if (dbError || !user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

<<<<<<< HEAD
    // 4. قراءة fb_token من الكوكي ومعرفة هل في ربط ولا لأ
    const fbToken = req.cookies.get("fb_token")?.value;
    const hasFacebook = !!fbToken;

    let facebookProfile: any = null;

    if (fbToken) {
      try {
        const fbRes = await fetch(
          `https://graph.facebook.com/me?fields=id,name,picture&access_token=${fbToken}`
        );
        console.log("FB PROFILE RESPONSE STATUS:", fbRes);

        if (fbRes.ok) {
          const fbData = await fbRes.json();
          facebookProfile = {
            id: fbData.id,
            name: fbData.name,
            picture: fbData.picture?.data?.url ?? null,
          };
        } else {
          console.warn("Facebook token invalid or expired");
        }
      } catch (e) {
        console.error("Error fetching Facebook profile:", e);
      }
    }

    // 5. إرجاع بيانات المستخدم + حالة فيسبوك
=======
    // 4. إرجاع بيانات المستخدم فقط
>>>>>>> save_data_sidebar
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
      { error: "حدث خطأ أثناء جلب بيانات المستخدم" },
      { status: 500 }
    );
  }
}
