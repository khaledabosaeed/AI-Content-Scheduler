import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const { data: posts, error } = await supabaseServer
        .from("posts")
        .select("*")
        .eq("user_id", user.userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
          { error: "فشل في جلب المنشورات" },
          { status: 500 }
        );
      }

      return NextResponse.json({ posts });
    } catch (err: any) {
      console.error(err);
      return NextResponse.json(
        { error: "حدث خطأ غير متوقع" },
        { status: 500 }
      );
    }
  });
}
