

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. قراءة fb_token من الكوكي
    const fbToken = req.cookies.get("fb_token")?.value;
    const hasFacebook = !!fbToken;

    // لو مفيش توكن → مفيش ربط فيسبوك
    if (!fbToken) {
      return NextResponse.json(
        {
          hasFacebook: false,
          facebook: null,
        },
        { status: 200 } // مش error عشان الـ UI يتعامل معها عادي
      );
    }

    let facebookProfile: any = null;

    // 2. جلب بيانات البروفايل من Facebook Graph API
    try {
      const fbRes = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture&access_token=${fbToken}`
      );

      if (fbRes.ok) {
        const fbData = await fbRes.json();
        facebookProfile = {
          id: fbData.id,
          name: fbData.name,
          picture: fbData.picture?.data?.url ?? null,
        };
      } else {
        console.warn("Facebook token invalid or expired");
      }
    } catch (e) {
      console.error("Error fetching Facebook profile:", e);
    }

    // 3. إرجاع حالة فيسبوك + البيانات لو موجودة
    return NextResponse.json(
      {
        hasFacebook: hasFacebook && !!facebookProfile,
        facebook: facebookProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Facebook /me error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات فيسبوك" },
      { status: 500 }
    );
  }
}
