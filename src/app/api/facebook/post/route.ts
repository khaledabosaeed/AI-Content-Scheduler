// app/api/facebook/post/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1) نقرأ توكن فيسبوك من الكوكي (جاينا من callback)
    const fbToken = req.cookies.get("fb_token")?.value;

    if (!fbToken) {
      return NextResponse.json(
        { error: "لا يوجد Facebook access token" },
        { status: 401 }
      );
    }

    // 2) نقرأ بيانات البوست من البودي
    const body = await req.json();
    const { message, pageId } = body;

    if (!message || !pageId) {
      return NextResponse.json(
        { error: "الرجاء إرسال message و pageId" },
        { status: 400 }
      );
    }

    // 3) نجهز الطلب لـ Meta Graph API
    // ملاحظة: لنشر بوست على صفحة لازم يكون معك *Page Access Token*
    const graphUrl = `https://graph.facebook.com/${pageId}/feed`;

    const graphRes = await fetch(graphUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        message,
        access_token: fbToken, //  هنا بنرفق الاكسس توكن
      }),
    });

    const graphData = await graphRes.json();

    if (!graphRes.ok) {
      // لو في خطأ من فيسبوك رجعه للفرونت
      return NextResponse.json(
        { error: "Facebook error", detail: graphData },
        { status: 400 }
      );
    }

    //  رجّع نتيجة نجاح النشر
    return NextResponse.json(
      {
        success: true,
        postId: graphData.id, // بيكون شكلها "PAGE_ID_POST_ID"
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("FB POST ERROR:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء نشر البوست" },
      { status: 500 }
    );
  }
}
