import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";



export const DELETE = async (req:NextRequest , {params }:{params : Promise<{ id: string }>})=>{
    return withAuth(req, async (_, user) => {
        try {
            const userId = user.userId; 
            const { id: postId } = await params;

            const {data : post , error : postError} =
             await supabaseServer.from('posts').
             select('id, user_id').
             eq('id' , postId).
             eq('user_id' , userId).
             select().
             single();

             if(postError || !post){
              return NextResponse.json({ error: 'Post not found' }, { status: 404 });
             }
             
             if(post.user_id !== userId){
              return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
             } 
            
           const { error : postDeleteError} =
            await  supabaseServer.
                            from('posts').
                            delete().
                            eq('id' , postId)

              if(postDeleteError){
                return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
              }

                return NextResponse.json({ message: `Post  deleted successfully` });

        }catch (error) {
                return NextResponse.json({ error: "Unexpected error" }, { status: 500 });

        }
    })
}

