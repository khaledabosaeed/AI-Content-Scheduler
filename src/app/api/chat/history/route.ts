import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

export const GET = (req: NextRequest) =>
  withAuth(req, async (_req, user) => {
    try {
      const userId = String(user.userId);

      const { data, error } = await supabaseServer
        .from("chat_sessions")
        .select("id, chat_title, last_message, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }); 

      if (error) {
        console.error("history error:", error);
        return NextResponse.json(
          { error: "Failed to load history" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          sessions:
            data?.map((row) => ({
              id: row.id,
              title: row.chat_title,
              lastMessage: row.last_message,
              updatedAt: row.updated_at,
            })) ?? [],
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("history route error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
