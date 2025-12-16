// // app/api/facebook/publishAll/route.ts
// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

// const SECRET_KEY = process.env.PUBLISH_SECRET;

// interface SocialAccount {
//   id: string;
//   access_token: string;
//   platform_user_id: string;
// }

// interface Post {
//   id: string;
//   content: string;
// }

// interface Schedule {
//   id: string;
//   scheduled_for: string;
//   status: string;
//   social_accounts: SocialAccount[];
//   posts: Post[];
// }

// export async function POST(req: Request) {
//   try {
 
//    const body = await req.json().catch(()=>({}))
//    const postId:string | undefined = body?.postId
  
//     // لو بدون postId (publishAll) لازم secret
//     if (!postId) {
//       const secret = req.headers.get("x-publish-secret");
//       if (!secret || secret !== SECRET_KEY) {
//         return NextResponse.json(
//           { success: false, error: "Unauthorized - invalid secret" },
//           { status: 401 }
//         );
//       }
//     }

//     const { data, error } = await supabaseServer
//       .from("post_schedules")
//       .select(
//         `
//     id,
//     scheduled_for,
//     status,
//     social_accounts (
//       id,
//       access_token,
//       platform_user_id
//     ),
//     posts (
//       id,
//       content
//     )
//   `
//       )
//       .eq("status", "pending")
//       .lte("scheduled_for", new Date().toISOString());

//     if (error) throw error;

//     // تأكد أن data موجودة
//     if (!data) {
//       return NextResponse.json({ message: "No scheduled posts found" });
//     }

//     // الآن نقدر نعمل assertion بأمان
//     const schedules: Schedule[] = (data || []).map((item: any) => ({
//       id: item.id,
//       scheduled_for: item.scheduled_for,
//       status: item.status,

//       social_accounts: item.social_accounts ?? [],
//       posts: item.posts ?? [],
//     }));

//     if (error) throw error;
//     if (!schedules || schedules.length === 0) {
//       return NextResponse.json({
//         message: "No scheduled posts to publish now",
//       });
//     }

//     for (const schedule of schedules) {
//       const post = schedule.posts[0];
//       const socialAccount = schedule.social_accounts[0];

//       if (!post?.content) {
//         console.warn(`Schedule ${schedule.id} has no post content`);
//         continue;
//       }
//       if (!socialAccount?.access_token) {
//         console.warn(`Schedule ${schedule.id} has no access token`);
//         continue;
//       }

//       try {
//         // جلب صفحات الفيسبوك المرتبطة
//         const pageRes = await fetch(
//           `https://graph.facebook.com/me/accounts?access_token=${socialAccount.access_token}`
//         );
//         const pagesJson = await pageRes.json();
//         const page = pagesJson.data?.[0];
//         if (!page) {
//           console.warn(`No Facebook page found for schedule ${schedule.id}`);
//           continue;
//         }

//         // نشر البوست على الصفحة
//         const graphRes = await fetch(
//           `https://graph.facebook.com/${page.id}/feed`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: new URLSearchParams({
//               message: post.content,
//               access_token: page.access_token,
//             }),
//           }
//         );
//         const graphData = (await graphRes.json()) as {
//           id: string;
//           url: string;
//         };

//         if (!graphRes.ok) {
//           console.error(`Failed to publish post ${post.id}:`, graphData);
//           continue;
//         }

//         // تحديث حالة البوست بعد النشر
//         await supabaseServer
//           .from("posts")
//           .update({
//             status: "published",
//             published_at: new Date().toISOString(),
//             platform_post_id: graphData.id,
//             platform_post_url: graphData.url,
//           })
//           .eq("id", post.id);

//         // تحديث حالة الجدولة
//         await supabaseServer
//           .from("post_schedules")
//           .update({ status: "published" })
//           .eq("id", schedule.id);

//         console.log(`Post ${post.id} published successfully`);
//       } catch (err) {
//         console.error(`Error publishing schedule ${schedule.id}:`, err);
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "All scheduled posts processed",
//     });
//   } catch (err: any) {
//     console.error("Error in publishAll route:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
// app/api/facebook/publish/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

const SECRET_KEY = process.env.PUBLISH_SECRET;

interface SocialAccount {
  id: string;
  access_token: string;
  platform_user_id: string;
}

interface Post {
  id: string;
  content: string;
}

interface Schedule {
  id: string;
  scheduled_for: string;
  status: string;
  social_accounts: SocialAccount[];
  posts: Post[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const postId: string | undefined = body?.postId;

    // لو نشر تلقائي بدون postId → لازم secret
    if (!postId) {
      const secret = req.headers.get("x-publish-secret");
      if (!secret || secret !== SECRET_KEY) {
        console.log("Unauthorized attempt for automatic publish");
        return NextResponse.json(
          { success: false, error: "Unauthorized - invalid secret" },
          { status: 401 }
        );
      }
    }

    let query = supabaseServer.from("post_schedules").select(`
      id,
      scheduled_for,
      status,
      social_accounts (
        id,
        access_token,
        platform_user_id
      ),
      posts (
        id,
        content
      )
    `);

    if (postId) {
      console.log(`Publishing single post from UI: ${postId}`);
      query = query.eq("id", postId);
    } else {
      console.log("Publishing scheduled posts automatically");
      query = query
        .eq("status", "pending")
        .lte("scheduled_for", new Date().toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) {
      console.log("No posts found to publish");
      return NextResponse.json({ message: "No scheduled posts found" });
    }

    const schedules: Schedule[] = (data || []).map((item: any) => ({
      id: item.id,
      scheduled_for: item.scheduled_for,
      status: item.status,
      social_accounts: item.social_accounts ?? [],
      posts: item.posts ?? [],
    }));

    const results: Array<{ id: string; ok: boolean; error?: string }> = [];
    let successCount = 0;

    for (const schedule of schedules) {
      const post = schedule.posts[0];
      const socialAccount = schedule.social_accounts[0];

      if (!post?.content) {
        console.warn(`Schedule ${schedule.id} has no post content`);
        continue;
      }
      if (!socialAccount?.access_token) {
        console.warn(`Schedule ${schedule.id} has no access token`);
        continue;
      }

      try {
        console.log(`Publishing post ${post.id} on schedule ${schedule.id}`);

        const pageRes = await fetch(
          `https://graph.facebook.com/me/accounts?access_token=${socialAccount.access_token}`
        );
        const pagesJson = await pageRes.json();
        const page = pagesJson.data?.[0];
        if (!page) {
          console.warn(`No Facebook page found for schedule ${schedule.id}`);
          continue;
        }

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
          console.error(`Failed to publish post ${post.id}:`, graphData);
          continue;
        }

        console.log(`Post ${post.id} published successfully with id ${graphData.id}`);

        // تحديث جدول البوست بعد النشر
        await supabaseServer
          .from("posts")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            platform_post_id: graphData.id,
            platform_post_url: graphData.url,
          })
          .eq("id", post.id);

        // تحديث جدول الجدولة
        await supabaseServer
          .from("post_schedules")
          .update({ status: "published" })
          .eq("id", schedule.id);

        successCount++;
        results.push({ id: post.id, ok: true });
      } catch (err: any) {
        results.push({ id: post.id, ok: false, error: err?.message });
        console.error(`Error publishing schedule ${schedule.id}:`, err);
      }
    }

    return NextResponse.json({
      success: successCount > 0,
      publishedCount: successCount,
      results,
    });
  } catch (err: any) {
    console.error("Error in publish route:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
