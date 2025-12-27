import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";



export const GET = (req: NextRequest) =>
  withAuth(req, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const sessionId = searchParams.get("sessionId");

      if (!sessionId) {
        return NextResponse.json(
          { error: "sessionId is required" },
          { status: 400 }
        );
      }

      const userId = String(user.userId);

      const { data, error } = await supabaseServer
        .from("chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        console.error("Supabase get-chat error:", error);
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }

      const messages = (data.chat_content as any[]) ?? [];

      return NextResponse.json(
        {
          sessionId: data.id,
          messages,
        },
        { status: 200 }
      );
    } catch (err: any) {
      console.error("get-chat route error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
