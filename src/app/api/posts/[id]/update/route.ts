// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, user) => {
    try {
      const { id: postId } = await params;
      const { content, platform, status, scheduledAt } = await req.json();

      if (!content || !platform || !status) {
        return NextResponse.json(
          { error: "Content, platform, and status required" },
          { status: 400 }
        );
      }

      // ===== تحديث البوست =====
      const { data: post, error: postError } = await supabaseServer
        .from("posts")
        .update({
          content,
          platform,
          status,
          scheduled_at: status === "scheduled" ? scheduledAt : null,
        })
        .eq("id", postId)
        .eq("user_id", user.userId)
        .select()
        .single();

      if (postError || !post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      // ===== التعامل مع جدول post_schedules =====
      if (status === "scheduled") {
        // تحقق من وجود حساب مرتبط بالمنصة
        const { data: socialAccount } = await supabaseServer
          .from("social_accounts")
          .select("*")
          .eq("user_id", user.userId)
          .eq("platform", platform)
          .single();

        if (!socialAccount) {
          return NextResponse.json(
            { error: `No social account linked for ${platform}` },
            { status: 400 }
          );
        }

        // إدراج أو تحديث السجل في post_schedules
        await supabaseServer.from("post_schedules").upsert({
          post_id: post.id,
          social_account_id: socialAccount.id,
          scheduled_for: scheduledAt,
          status: "pending", // يجب أن يكون ضمن القيم ['pending','processing','published','failed']
        });
      } else {
        // إذا كان status != scheduled → حذف من post_schedules
        await supabaseServer
          .from("post_schedules")
          .delete()
          .eq("post_id", post.id);
      }

      return NextResponse.json({
        success: true,
        post,
        message: "Post updated successfully",
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  });
}
