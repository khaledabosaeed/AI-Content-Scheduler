import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      // جلب البيانات من body
      const { prompt, content, platform = "twitter", status, scheduledAt } =
        await req.json();

      if (!content || !platform) {
        return NextResponse.json(
          { error: "المحتوى والمنصة مطلوبان" },
          { status: 400 }
        );
      }

      // ===== حفظ Draft =====
      if (status === "draft") {
        const { data: post, error } = await supabaseServer
          .from("posts")
          .insert({
            user_id: user.userId,
            content: content.trim(),
            ai_prompt: prompt?.trim() || null,
            platform,
            status: "draft",
            scheduled_at: null,
          })
          .select()
          .single();

        if (error) throw new Error(error.message);

        return NextResponse.json({
          success: true,
          post,
          message: "تم حفظ المنشور كمسودة",
        });
      }

      // ===== حفظ Scheduled =====
      // التأكد من وجود حساب مرتبط بالمنصة
      const { data: socialAccount } = await supabaseServer
        .from("social_accounts")
        .select("*")
        .eq("user_id", user.userId)
        .eq("platform", platform)
        .single();

      if (!socialAccount) {
        return NextResponse.json(
          { error: `لا يوجد حساب مرتبط بمنصة ${platform}` },
          { status: 400 }
        );
      }

      // إنشاء البوست المجدول أولاً
      const { data: post, error: postError } = await supabaseServer
        .from("posts")
        .insert({
          user_id: user.userId,
          content: content.trim(),
          ai_prompt: prompt?.trim() || null,
          platform,
          status: "scheduled",
          scheduled_at: scheduledAt,
        })
        .select()
        .single();

      if (postError) throw new Error(postError.message);

      // إدراج في جدول post_schedules
      const { data: schedule, error: scheduleError } = await supabaseServer
        .from("post_schedules")
        .insert({
          post_id: post.id,
          social_account_id: socialAccount.id,
          scheduled_for: scheduledAt,
          status: "pending", // يجب أن تكون ضمن القيم المسموح بها ['pending', 'processing', 'published', 'failed']
        })
        .select()
        .single();

      if (scheduleError) throw new Error(scheduleError.message);

      return NextResponse.json({
        success: true,
        post,
        schedule,
        message: "تم جدولة المنشور بنجاح",
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  });
}
