import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { z } from "zod";

const uuidSchema = z.string().uuid();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (_req, user) => {
    const postId = params.id;

    const validationResult = uuidSchema.safeParse(postId);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("posts")
      .update({
        status: "draft",
        scheduled_at: null,
      })
      .eq("id", postId)
      .eq("user_id", user.userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, post: data });
  });
}
