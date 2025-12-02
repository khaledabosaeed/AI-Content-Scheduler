// app/api/facebook/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { getSessionToken } from "@/shared/libs/auth/cookies";
import { verifyToken } from "@/shared/libs/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    //  user access token اللي خزّنّاه في الكوكي بعد اللوجين
    const userToken = req.cookies.get("fb_token")?.value;

    if (!userToken) {
      return NextResponse.json(
        { error: { message: "لا يوجد Facebook access token في الكوكي" } },
        { status: 401 }
      );
    }

    //  تحقق من جلسة المستخدم
    const sessionToken = getSessionToken(req);
    if (!sessionToken) {
      return NextResponse.json(
        { error: { message: "غير مصرح - لا توجد جلسة" } },
        { status: 401 }
      );
    }

    const payload = verifyToken(sessionToken);
    if (!payload) {
      return NextResponse.json(
        { error: { message: "جلسة غير صالحة أو منتهية" } },
        { status: 401 }
      );
    }

    // اقرأ postId من body
    const body = await req.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: { message: "postId مفقود" } },
        { status: 400 }
      );
    }

    //  جب البوست من قاعدة البيانات
    const { data: post, error: postError } = await supabaseServer
      .from("posts")
      .select("id, content, platform, status, user_id")
      .eq("id", postId)
      .eq("user_id", payload.userId) // تأكد إنه بوست هذا المستخدم
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: { message: "البوست غير موجود" } },
        { status: 404 }
      );
    }

    //  جب صفحات المستخدم من /me/accounts باستخدام user token
    const pagesRes = await fetch(
      `https://graph.facebook.com/me/accounts?access_token=${userToken}`
    );
    const pagesJson = await pagesRes.json();

    if (!pagesRes.ok) {
      return NextResponse.json(
        {
          error: {
            message: "فشل في جلب الصفحات من فيسبوك",
            facebookError: pagesJson,
          },
        },
        { status: 400 }
      );
    }

    const pages = pagesJson.data || [];

    if (pages.length === 0) {
      return NextResponse.json(
        { error: { message: "لا يوجد أي صفحة مرتبطة بهذا الحساب" } },
        { status: 400 }
      );
    }

    // إما تختاري أول صفحة، أو صفحة معيّنة بـ env
    const ENV_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
    const page =
      (ENV_PAGE_ID && pages.find((p: any) => p.id === ENV_PAGE_ID)) || pages[0]; // لو ما حددنا ENV، ناخذ أول صفحة (Contant Ai عندك)

    if (!page) {
      return NextResponse.json(
        { error: { message: "تعذر اختيار الصفحة للنشر" } },
        { status: 400 }
      );
    }

    const pageId = page.id;
    const pageAccessToken = page.access_token;
    //)النشر على صفحة فيسبوك باستخدام page access token
    const graphUrl = `https://graph.facebook.com/${pageId}/feed`;

    const graphRes = await fetch(graphUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        message: post.content,
        access_token: pageAccessToken,
      }),
    });

    const graphData = await graphRes.json();

    if (!graphRes.ok) {
      console.error("Facebook publish error:", graphData);
      return NextResponse.json(
        {
          error: {
            message: "فشل النشر على فيسبوك",
            facebookError: graphData,
          },
        },
        { status: 400 }
      );
    }

    await supabaseServer
      .from("posts")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        facebook_post_id: graphData.id,
      })
      .eq("id", post.id);

    return NextResponse.json(
      {
        success: true,
        facebookPostId: graphData.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("FB PUBLISH ERROR:", err);
    return NextResponse.json(
      { error: { message: "حدث خطأ أثناء نشر البوست" } },
      { status: 500 }
    );
  }
}
