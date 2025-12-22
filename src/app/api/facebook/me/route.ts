

import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabase } from "@/shared/libs/suapabase/supabaseClient";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";



/****
 * 
  return withAuth(req, async (req, user) => {
  const userId = user.id; // المستخدم المصادق عليه
  rq => subabaseServer.from('posts').select('*').eq('user_id', userId);
  

  
}
  }
 * 
 */

  export async function GET(req: NextRequest) {
    return withAuth(req, async (req, user) => {

  try {    
      const userId = user.userId;      
      const data = await supabaseServer.from("social_accounts")
      .select("access_token")
      .eq("user_id", userId)
      .eq("platform", "facebook")
      .single();

      const facebookId = data.data?.access_token;

    // لو مفيش توكن → مفيش ربط فيسبوك
    if (!facebookId) {
      return NextResponse.json(
        {
          hasFacebook: false,
          facebook: null,
        },
        { status: 404 } // مش error عشان الـ UI يتعامل معها عادي
      );
    }

    let facebookProfile: any = null;

    // 2. جلب بيانات البروفايل من Facebook Graph API
    try {
      const fbRes = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture&access_token=${facebookId}`
      );

      
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        facebookProfile = {
          id: fbData.id,
          name: fbData.name,
          picture: fbData.picture?.data?.url ?? null,
        };
  return NextResponse.json({
    hasFacebook: true,
    facebook: facebookProfile,
  });
      } else {

        const errorData = await fbRes.json();
        let status = fbRes.status;
        let message = errorData.error?.message || "Unknown error";


  if (errorData?.error?.code === 190) {
    // رمز الخطأ 190 يعني توكن غير صالح أو منتهي الصلاحية
    status = 401;
    message = "Facebook access token is invalid or expired";
  } else if (fbRes.status >= 500) {
    // خطأ داخلي من Facebook
    status = 502;
    message = "Facebook API internal error";
  }
  return NextResponse.json(
    {
      hasFacebook: false,
      facebook: null,
      message,
      fbError: errorData,
    },
    { status }
  );
      }
    } catch (e) {
      console.error("Error fetching Facebook profile:", e);
    }
    // 3. إرجاع حالة فيسبوك + البيانات لو موجودة
    return NextResponse.json(
      {
        hasFacebook: facebookId && !!facebookProfile,
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
})
}