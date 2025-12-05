// app/api/facebook/publishAll/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

const SECRET_KEY = process.env.PUBLISH_SECRET; // set this in .env

export async function POST(req: Request) {
  try {
    //  Check for secret header
    const secret = req.headers.get("x-publish-secret");
    if (!secret || secret !== SECRET_KEY) {
      return NextResponse.json(
        { error: "Unauthorized - invalid secret" },
        { status: 401 }
      );
    }

    // Fetch all scheduled posts <= now
    const { data: posts, error } = await supabaseServer
      .from("posts")
      .select(
        `
        id,
        content,
        platform,
        user_id,
        status,
        scheduled_at,
        users(facebook_access_token)
      `
      )
      .eq("status", "scheduled")
      .lte("scheduled_at", new Date().toISOString());
 
    if (error) throw error;
    if (!posts || posts.length === 0) {
      return NextResponse.json({
        message: "No scheduled posts to publish now",
      });
    }

    // Loop through posts
    for (const post of posts) {

      const fbToken = post?.users?.facebook_access_token;
      if (!fbToken) {
        console.warn(`User ${post.user_id} does not have Facebook token`);
        continue;
      }

      try {
        const pageRes = await fetch(
          `https://graph.facebook.com/me/accounts?access_token=${fbToken}`
        );
        const pagesJson = await pageRes.json();
        const page = pagesJson.data[0];
        if (!page) continue;

        const graphRes = await fetch(`https://graph.facebook.com/${page.id}/feed`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            message: post.content,
            access_token: page.access_token,
          }),
        });
        const graphData = await graphRes.json();

        if (!graphRes.ok) {
          console.error(`Failed to publish post ${post.id}:`, graphData);
          continue;
        }

        // Update post after publishing
        await supabaseServer
          .from("posts")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            platform_post_id: graphData.id,
            platform_post_url: graphData.url,
          })
          .eq("id", post.id);

        console.log(`Post ${post.id} published successfully`);
      } catch (err) {
        console.error(`Error publishing post ${post.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "All scheduled posts processed",
    });
  } catch (err: any) {
    console.error("Error in publishAll route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
