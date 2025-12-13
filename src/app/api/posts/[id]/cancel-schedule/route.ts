// app/api/posts/[id]/cancel-schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async (req, user) => {
    try {
      const { id: postId } = await params;

      // تحويل البوست إلى draft
      const { data: post, error: postError } = await supabaseServer
        .from("posts")
        .update({ status: "draft", scheduled_at: null })
        .eq("id", postId)
        .eq("user_id", user.userId)
        .select()
        .single();

      if (postError || !post) {
        return NextResponse.json({ error: "Post not found or update failed" }, { status: 404 });
      }

      // إزالة السجل من post_schedules (تحقق من نجاح الحذف)
      const { error: scheduleError } = await supabaseServer
        .from("post_schedules")
        .delete()
        .eq("post_id", postId);

      if (scheduleError) {
        console.warn(`Failed to delete schedule for post ${postId}:`, scheduleError.message);
      }

      return NextResponse.json({
        success: true,
        post,
        message: "Schedule canceled, post set as draft"
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  });
}
