import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

const SECRET_KEY = process.env.PUBLISH_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const postId: string | undefined = body?.postId;

    if (!postId) {
      const secret = req.headers.get("x-publish-secret");
      if (!secret || secret !== SECRET_KEY) {
        return NextResponse.json(
          { error: "Unauthorized - invalid secret" },
          { status: 401 }
        );
      }
    }

    let query = supabaseServer.from("posts").select(
      `
        id,
        content,
        platform,
        user_id,
        status,
        scheduled_at,
        users(facebook_access_token)
      `
    );

    if (postId) {
      query = query.eq("id", postId);
    } else {
      query = query
        .eq("status", "scheduled")
        .lte("scheduled_at", new Date().toISOString());
    }

    const { data: posts, error } = await query;

    if (error) throw error;
    if (!posts || posts.length === 0) {
      return NextResponse.json({
        message: "No posts to publish",
      });
    }

    for (const post of posts) {
      const fbToken = post?.users?.facebook_access_token;
      if (!fbToken) continue;

      try {
        const pageRes = await fetch(
          `https://graph.facebook.com/me/accounts?access_token=${fbToken}`
        );
        const pagesJson = await pageRes.json();
        const page = pagesJson?.data?.[0];
        if (!page) continue;

        const graphRes = await fetch(
          `https://graph.facebook.com/${page.id}/feed`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              message: post.content,
              access_token: page.access_token,
            }),
          }
        );

        const graphData = await graphRes.json();

        if (!graphRes.ok) {
          console.error("Facebook error:", graphData);
          continue;
        }

        await supabaseServer
          .from("posts")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            platform_post_id: graphData.id,
          })
          .eq("id", post.id);
      } catch (err) {
        console.error("Publish error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      publishedCount: posts.length,
    });
  } catch (err: any) {
    console.error("Publish route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
