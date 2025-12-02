import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const fbToken = req.cookies.get("fb_token")?.value;

    if (!fbToken) {
      return NextResponse.json(
        { error: "لا يوجد fb_token في الكوكي" },
        { status: 401 }
      );
    }

    // نجرّب الطلب ونرجّع كل شيء زي ما هو
    const res = await fetch(
      `https://graph.facebook.com/me/accounts?access_token=${fbToken}`
    );

    const text = await res.text(); 

    return NextResponse.json(
      {
        fetchStatus: res.status,
        fetchOk: res.ok,
        rawBody: text, // هنا رسالة فيسبوك كما هي (JSON أو error)
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("FB PAGES-DEBUG ERROR:", e);
    return NextResponse.json(
      {
        error: "خطأ أثناء جلب الصفحات (exception)",
        detail: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}
