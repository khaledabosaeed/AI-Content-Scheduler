import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

type MessageBody = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type Body = {
  sessionId: string | null;
  title: string;
  lastMessage: string;
  messages: MessageBody[];
};

export const POST = (req: NextRequest) =>
  withAuth(req, async (req, user) => {
    try {
      const body = (await req.json()) as Body;

      if (!body || !body.messages || body.messages.length === 0) {
        return NextResponse.json(
          { error: "No data provided" },
          { status: 400 }
        );
      }

      const { sessionId, title, lastMessage, messages } = body;
      const userId = String(user.userId);

      let finalSessionId = sessionId;

      if (!finalSessionId) {
        const { data, error } = await supabaseServer
          .from("chat_sessions")
          .insert({
            user_id: userId,
            chat_title: title,
            chat_content: messages,
            last_message: lastMessage,
          })
          .select("id, chat_title, last_message, updated_at")
          .single();

        if (error || !data) {
          console.error("insert chat_sessions error:", error);
          return NextResponse.json(
            { error: "Failed to create chat session" },
            { status: 500 }
          );
        }

        finalSessionId = data.id;

        return NextResponse.json(
          {
            id: data.id,
            title: data.chat_title,
            lastMessage: data.last_message,
            updatedAt: data.updated_at,
          },
          { status: 200 }
        );
      }

      const { data, error } = await supabaseServer
        .from("chat_sessions")
        .update({
          chat_title: title,
          chat_content: messages,
          last_message: lastMessage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", finalSessionId)
        .eq("user_id", userId)
        .select("id, chat_title, last_message, updated_at")
        .single();

      if (error || !data) {
        console.error("update chat_sessions error:", error);
        return NextResponse.json(
          { error: "Failed to update chat session" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          id: data.id,
          title: data.chat_title,
          lastMessage: data.last_message,
          updatedAt: data.updated_at,
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("add-chat API error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
