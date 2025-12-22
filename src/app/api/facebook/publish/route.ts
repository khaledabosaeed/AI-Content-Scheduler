import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

const SECRET_KEY = process.env.PUBLISH_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const postId: string | undefined = body?.postId;

    // 🔐 scheduled لازم secret
    if (!postId) {
      const secret = req.headers.get("x-publish-secret");
      if (!secret || secret !== SECRET_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // =========================
    // 1️⃣ جلب البيانات حسب الحالة
    // =========================
    let rows: any[] = [];

    if (postId) {
      // 👉 نشر فوري
      const { data, error } = await supabaseServer
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      rows = [{ post: data, scheduleId: null }];
    } else {
      // 👉 نشر مجدول
      const { data, error } = await supabaseServer
        .from("post_schedules")
        .select(`
          id,
          scheduled_for,
          posts (*),
          social_accounts (*)
        `)
        .eq("status", "pending")
        .lte("scheduled_for", new Date().toISOString());

      if (error) throw error;

      rows =
        data?.map((s) => ({
          post: s.posts,
          scheduleId: s.id,
          socialAccount: s.social_accounts,
        })) ?? [];
    }

    if (rows.length === 0) {
      return NextResponse.json({ message: "Nothing to publish" });
    }

    // =========================
    // 2️⃣ النشر الفعلي (كود موحّد)
    // =========================
    const results = [];

    for (const row of rows) {
      const post = row.post;
      const scheduleId = row.scheduleId;

      if (!post?.content) {
        results.push({ id: post?.id, ok: false, error: "Empty content" });
        continue;
      }
      
      // token
      const { data: social } = await supabaseServer
        .from("social_accounts")
        .select("access_token")
        .eq("user_id", post.user_id)
        .eq("platform", "facebook")
        .single();

      if (!social?.access_token) {
        results.push({ id: post.id, ok: false, error: "No token" });
        continue;
      }

      // pages
      const pagesRes = await fetch(
        `https://graph.facebook.com/me/accounts?access_token=${social.access_token}`
      );
      const pages = await pagesRes.json();
      const page = pages?.data?.[0];

      if (!page) {
        results.push({ id: post.id, ok: false, error: "No page" });
        continue;
      }

      // publish
      const publishRes = await fetch(
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

      const publishData = await publishRes.json();

      if (!publishRes.ok) {
        results.push({
          id: post.id,
          ok: false,
          error: publishData?.error?.message,
        });
        continue;
      }

      // =========================
      // 3️⃣ تحديث DB
      // =========================
      await supabaseServer
        .from("posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
          platform_post_id: publishData.id,
        })
        .eq("id", post.id);

      if (scheduleId) {
        await supabaseServer
          .from("post_schedules")
          .update({ status: "published" })
          .eq("id", scheduleId);
      }

      results.push({ id: post.id, ok: true });
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 500 }
    );
  }
}



