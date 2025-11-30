// app/api/facebook/publish/route.ts
import { getFacebookAccount } from "@/shared/libs/facebook/facebookStore";
import { NextRequest, NextResponse } from "next/server";

async function getCurrentUserId(): Promise<string> {
  return "USER_1";
}

async function getPostContent(postId: string, userId: string) {
  // مؤقتاً: بس عشان تتأكد إن النشر شغال
  return `بوست تجريبي، ID: ${postId}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ message: "postId مفقود" }, { status: 400 });
    }

    const userId = await getCurrentUserId();
    const fb = getFacebookAccount(userId);

    if (!fb) {
      return NextResponse.json(
        { message: "هذا المستخدم غير مربوط بفيسبوك" },
        { status: 400 }
      );
    }

    const content = await getPostContent(postId, userId);

    // 1) نرسل البوست لواجهة فيسبوك للنشر على الصفحة
    const fbRes = await fetch(
      `https://graph.facebook.com/${fb.pageId}/feed` +
        `?message=${encodeURIComponent(content)}` +
        `&access_token=${fb.pageAccessToken}`,
      { method: "POST" }
    );

    const fbData = await fbRes.json();

    if (!fbRes.ok) {
      return NextResponse.json(
        {
          message: "خطأ من فيسبوك أثناء النشر",
          error: fbData,
        },
        { status: 500 }
      );
    }

    // ممكن تحدث حالة البوست عندك في DB هنا (published) لو حبيت

    return NextResponse.json({
      message: "تم النشر على فيسبوك بنجاح",
      facebookPostId: fbData.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        message: "خطأ غير متوقع",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}
