import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

const SECRET_KEY = process.env.PUBLISH_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const postId: string | undefined = body?.postId;

    // ✅ لو بدون postId (publishAll) لازم secret
    if (!postId) {
      const secret = req.headers.get("x-publish-secret");
      if (!secret || secret !== SECRET_KEY) {
        return NextResponse.json(
          { success: false, error: "Unauthorized - invalid secret" },
          { status: 401 }
        );
      }
    }

    // ✅ 1) نجيب البوستات بدون JOIN
    let query = supabaseServer.from("posts").select(`
      id,
      content,
      platform,
      user_id,
      status,
      scheduled_at
    `);

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
      return NextResponse.json(
        { success: false, error: "No posts to publish" },
        { status: 404 }
      );
    }

    let successCount = 0;
    const results: Array<{ id: string; ok: boolean; error?: string }> = [];

    for (const post of posts) {
      // ✅ 2) نجيب Facebook token من جدول users بناءً على user_id
      const { data: userRow, error: userErr } = await supabaseServer
        .from("users")
        .select("facebook_access_token")
        .eq("id", post.user_id)
        .single();

      const fbToken = userRow?.facebook_access_token;

      if (userErr || !fbToken) {
        results.push({
          id: post.id,
          ok: false,
          error: "Missing Facebook token",
        });
        continue;
      }

      try {
        // ✅ 3) get pages
        const pageRes = await fetch(
          `https://graph.facebook.com/me/accounts?access_token=${encodeURIComponent(
            fbToken
          )}`
        );
        const pagesJson = await pageRes.json();

        if (!pageRes.ok) {
          results.push({
            id: post.id,
            ok: false,
            error: pagesJson?.error?.message || "Failed to fetch pages",
          });
          continue;
        }

        const page = pagesJson?.data?.[0];
        if (!page?.id || !page?.access_token) {
          results.push({
            id: post.id,
            ok: false,
            error: "No accessible Facebook pages",
          });
          continue;
        }

        // ✅ 4) publish post
        const graphRes = await fetch(
          `https://graph.facebook.com/${page.id}/feed`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              message: post.content,
              access_token: page.access_token,
            }),
          }
        );

        const graphData = await graphRes.json();

        if (!graphRes.ok) {
          results.push({
            id: post.id,
            ok: false,
            error: graphData?.error?.message || "Facebook publish failed",
          });
          continue;
        }

        // ✅ 5) update DB only on success
        const { error: updateErr } = await supabaseServer
          .from("posts")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            platform_post_id: graphData.id,
          })
          .eq("id", post.id);

        if (updateErr) {
          results.push({
            id: post.id,
            ok: false,
            error: updateErr.message || "Failed to update DB status",
          });
          continue;
        }

        successCount++;
        results.push({ id: post.id, ok: true });
      } catch (e: any) {
        results.push({
          id: post.id,
          ok: false,
          error: e?.message || "Unexpected publish error",
        });
      }
    }

    // ✅ لو publish بوست واحد وفشل: رجّعي error (عشان الـ UI ما يكذب)
    if (postId && successCount === 0) {
      const first = results[0];
      return NextResponse.json(
        { success: false, error: first?.error || "Publish failed", results },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: successCount > 0,
      publishedCount: successCount,
      results,
    });
  } catch (err: any) {
    console.error("Publish route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
