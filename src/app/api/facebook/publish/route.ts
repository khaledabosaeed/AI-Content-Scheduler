// app/api/facebook/publishAll/route.ts
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
    // تحقق من الـ secret
    const secret = req.headers.get("x-publish-secret");
    if (!secret || secret !== SECRET_KEY) {
      return NextResponse.json(
        { error: "Unauthorized - invalid secret" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseServer
      .from("post_schedules")
      .select(
        `
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
  `
      )
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString());

    if (error) throw error;

    // تأكد أن data موجودة
    if (!data) {
      return NextResponse.json({ message: "No scheduled posts found" });
    }

    // الآن نقدر نعمل assertion بأمان
    const schedules: Schedule[] = (data || []).map((item: any) => ({
      id: item.id,
      scheduled_for: item.scheduled_for,
      status: item.status,

      social_accounts: item.social_accounts ?? [],
      posts: item.posts ?? [],
    }));

    if (error) throw error;
    if (!schedules || schedules.length === 0) {
      return NextResponse.json({
        message: "No scheduled posts to publish now",
      });
    }

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
        // جلب صفحات الفيسبوك المرتبطة
        const pageRes = await fetch(
          `https://graph.facebook.com/me/accounts?access_token=${socialAccount.access_token}`
        );
        const pagesJson = await pageRes.json();
        const page = pagesJson.data?.[0];
        if (!page) {
          console.warn(`No Facebook page found for schedule ${schedule.id}`);
          continue;
        }

        // نشر البوست على الصفحة
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
        const graphData = (await graphRes.json()) as {
          id: string;
          url: string;
        };

        if (!graphRes.ok) {
          console.error(`Failed to publish post ${post.id}:`, graphData);
          continue;
        }

        // تحديث حالة البوست بعد النشر
        await supabaseServer
          .from("posts")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            platform_post_id: graphData.id,
            platform_post_url: graphData.url,
          })
          .eq("id", post.id);

        // تحديث حالة الجدولة
        await supabaseServer
          .from("post_schedules")
          .update({ status: "published" })
          .eq("id", schedule.id);

        console.log(`Post ${post.id} published successfully`);
      } catch (err) {
        console.error(`Error publishing schedule ${schedule.id}:`, err);
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
