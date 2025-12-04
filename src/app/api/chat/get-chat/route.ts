import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

/****
 * 
 * NOW THIS ROUTE TAKE THE GET THE CHATS FROM THE DATABASE
 * 
 * DEPEND ON THE USER ID FROM THE SESSION COOKIES
 * 
 */

export const GET = (req: NextRequest) => {

    return withAuth(req, async (req, user) => {

        const userId = parseInt(user.userId);
        console.log(userId, "this is user id");

        // get the chats from the database
        
        const { data, error } = await
            supabaseServer.from
                ("chat_sessions").
                select("*").
                eq("user_id", userId).
                order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
        console.log(data, "this is data");

        return NextResponse.json({ data })
    })
}