import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapa-base/supabaseServer";


export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const body = await req.json();
      const { prompt, content, platform = "twitter", status } = body;
      if (!content || !platform) {
        return NextResponse.json(
          { error: "المحتوى والمنصة مطلوبان" },
          { status: 400 }
        );
      }

      const { data: post, error } = await supabaseServer
        .from("posts")
        .insert({
          user_id: user.userId,
          content: content.trim(),
          ai_prompt: prompt?.trim() || null,
          platform,
          status,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving post:", error);
        throw new Error("فشل في حفظ المنشور");
      }
      return NextResponse.json({
        success: true,
        post,
        message: `تم حفظ المنشور كـ ${status === "draft" ? "مسودة" : status}`,
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}
