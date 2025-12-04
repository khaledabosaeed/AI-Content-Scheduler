import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {

    const body = await req.json();
    if (!body) {
        return new NextResponse("Bad Request: No data provided", { status: 400 });
    }

    return withAuth(req, async (req, user) => {

        const userId = parseInt(user.userId);

        console.log(userId, "this is user id in add chat");

        // add a new chat session to the database

        const { data, error } = await
            supabaseServer.from("chat_sessions").insert({
                user_id: userId,
                chat_title: body.chat_title,
                chat_content: body.chat_content,
            });

        console.log(data, "this is data after insert");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(data, "this is data after insert");

        return new Response(JSON.stringify({ message: "chat added successfully" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        })

    })

};