// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

// const SECRET_KEY = process.env.PUBLISH_SECRET;

// type PostRow = {
//   id: string;
//   content: string | null;
//   platform: string | null;
//   user_id: string;
//   status: string | null;
//   scheduled_at: string | null;
// };

// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => ({}));
//     const postId: string | undefined = body?.postId;

//     // ✅ publishAll لازم secret
//     if (!postId) {
//       const secret = req.headers.get("x-publish-secret");
//       if (!SECRET_KEY || !secret || secret !== SECRET_KEY) {
//         return NextResponse.json(
//           { success: false, error: "Unauthorized - invalid secret" },
//           { status: 401 }
//         );
//       }
//     }

//     // ✅ query موحدة
//     let query = supabaseServer
//       .from("posts")
//       .select("id,content,platform,user_id,status,scheduled_at");

//     if (postId) {
//       // publish من الـ UI
//       query = query.eq("id", postId);
//     } else {
//       // publishAll (scheduled)
//       query = query
//         .eq("status", "scheduled")
//         .lte("scheduled_at", new Date().toISOString());
//     }

//     const { data: posts, error } = await query;
//     if (error) throw error;

//     if (!posts || posts.length === 0) {
//       return NextResponse.json(
//         { success: false, error: "No posts to publish" },
//         { status: 404 }
//       );
//     }

//     const results: Array<{ id: string; ok: boolean; error?: string }> = [];
//     let successCount = 0;

//     for (const post of posts as PostRow[]) {
//       // ✅ جلب Facebook token من social_accounts
//       const { data: social, error: socialErr } = await supabaseServer
//         .from("social_accounts")
//         .select("access_token")
//         .eq("user_id", post.user_id)
//         .eq("platform", "facebook")
//         .single();

//       if (socialErr || !social?.access_token) {
//         results.push({
//           id: post.id,
//           ok: false,
//           error: "Missing Facebook token",
//         });
//         continue;
//       }

//       const message = (post.content || "").trim();
//       if (!message) {
//         results.push({
//           id: post.id,
//           ok: false,
//           error: "Post content is empty",
//         });
//         continue;
//       }

//       try {
//         // 1️⃣ جلب الصفحات
//         const pageRes = await fetch(
//           `https://graph.facebook.com/me/accounts?access_token=${encodeURIComponent(
//             social.access_token
//           )}`
//         );

//         const pagesJson = await pageRes.json().catch(() => ({}));

//         if (!pageRes.ok) {
//           results.push({
//             id: post.id,
//             ok: false,
//             error: pagesJson?.error?.message || "Failed to fetch pages",
//           });
//           continue;
//         }

//         const page = pagesJson?.data?.[0];
//         if (!page?.id || !page?.access_token) {
//           results.push({
//             id: post.id,
//             ok: false,
//             error: "No accessible Facebook pages",
//           });
//           continue;
//         }

//         // 2️⃣ نشر البوست
//         const graphRes = await fetch(
//           `https://graph.facebook.com/${page.id}/feed`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: new URLSearchParams({
//               message,
//               access_token: page.access_token,
//             }),
//           }
//         );

//         const graphData = await graphRes.json().catch(() => ({}));

//         if (!graphRes.ok) {
//           results.push({
//             id: post.id,
//             ok: false,
//             error: graphData?.error?.message || "Facebook publish failed",
//           });
//           continue;
//         }

//         // 3️⃣ تحديث الداتابيس بعد النجاح فقط
//         const { error: updateErr } = await supabaseServer
//           .from("posts")
//           .update({

//             status: "published",
//             published_at: new Date().toISOString(),
//             platform_post_id: graphData.id,
//             platform_post_url: graphData?.url ?? null,
//           })
//           .eq("id", post.id);

//         if (updateErr) {
//           results.push({
//             id: post.id,
//             ok: false,
//             error: "Published but failed to update DB",
//           });
//           continue;
//         }

//         successCount++;
//         results.push({ id: post.id, ok: true });
//       } catch (e: any) {
//         results.push({
//           id: post.id,
//           ok: false,
//           error: e?.message || "Unexpected publish error",
//         });
//       }
//     }

//     if (postId && successCount === 0) {
//       const first = results[0];
//       return NextResponse.json(
//         { success: false, error: first?.error || "Publish failed", results },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({
//       success: successCount > 0,
//       publishedCount: successCount,
//       results,
//     });
//   } catch (err: any) {
//     console.error("Publish route error:", err);
//     return NextResponse.json(
//       { success: false, error: err?.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }



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



