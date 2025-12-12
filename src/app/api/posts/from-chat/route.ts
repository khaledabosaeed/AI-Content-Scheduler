import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const body = await req.json();
      const {
        prompt,
        content,
        platform = "twitter",
        status,
        scheduledAt,
      } = body;

      if (!content || !platform) {
        return NextResponse.json(
          { error: "المحتوى والمنصة مطلوبان" },
          { status: 400 }
        );
      }

      // حفظ البوست في Supabase
      const { data: post, error } = await supabaseServer
        .from("post_schedules")
        .insert({
          user_id: user.userId,
          content: content.trim(),
          ai_prompt: prompt?.trim() || null,
          platform,
          status,
          scheduled_at: scheduledAt || null,
        })
        .select()
        .single();

      if (error) throw new Error("فشل في حفظ المنشور");

      // أرسل response فوراً
      const response = NextResponse.json({
        success: true,
        post,
        message: `تم حفظ المنشور كـ ${status === "draft" ? "مسودة" : status}`,
      });

      // // نفّذ الجدولة بشكل غير متزامن
      // if (status === "scheduled" && scheduledAt) {
      //   (async () => {
      //     try {
      //       const scheduledTime = new Date(scheduledAt);
      //       const now = new Date();
      //       const delay = scheduledTime.getTime() - now.getTime();

      //       if (delay > 0) {
      //         queue.add("publish", { postId: post.id }, { delay }); // بدون await
      //         console.log(
      //           `✅ تم جدولة المنشور ${post.id} للنشر في ${scheduledAt}`
      //         );
      //       } else {
      //         await supabaseServer
      //           .from("posts")
      //           .update({ status: "draft", scheduled_at: null })
      //           .eq("id", post.id);
      //         console.warn("لا يمكن جدولة منشور في الماضي");
      //       }
      //     } catch (err) {
      //       console.error("فشل جدولة المنشور:", err);
      //     }
      //   })();
      // }

      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}
