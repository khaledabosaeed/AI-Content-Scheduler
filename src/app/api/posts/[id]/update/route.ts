// api/posts/[id]/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { withAuth } from "@/shared/libs/auth/auth-middleware";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, user) => {
    try {
      const { id: postId } = await params; // ← لازم يكون نفس اسم الفولدر [id]
      const { content, platform, status, scheduledAt } = await req.json();

      if (!content || !platform || !status) {
        return NextResponse.json(
          { error: "Content, platform, and status are required" },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseServer
        .from("posts")
        .update({
          content,
          platform,
          status,
          scheduled_at: scheduledAt ? new Date(scheduledAt) : null,
        })
        .eq("id", postId)
        .select()
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, post: data });
    } catch (err: any) {
      console.error("Server error:", err);
      return NextResponse.json(
        { error: err.message || "Internal server error" },
        { status: 500 }
      );
    }
  });
}
