// app/api/oauth/facebook/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/libs/auth/auth-middleware";
import { supabaseServer } from "@/shared/libs/suapabase/supabaseServer";

const APP_ID = process.env.FACEBOOK_APP_ID!;
const APP_SECRET = process.env.FACEBOOK_API_SECRET!;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const code = req.nextUrl.searchParams.get("code");
      if (!code) return NextResponse.json({ message: "Missing code" }, { status: 400 });

      // استبدال الكود بـ access token
      const tokenRes = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
          `client_id=${APP_ID}&client_secret=${APP_SECRET}` +
          `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${code}`
      );
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        return NextResponse.json({ message: "Facebook error", detail: tokenData }, { status: 400 });
      }

      const userAccessToken = tokenData.access_token;

      // جلب بيانات الحساب (account id)
      const profileRes = await fetch(
        `https://graph.facebook.com/me?fields=id,name&access_token=${userAccessToken}`
      );
      const profile = await profileRes.json();
      const facebookAccountId = profile.id; // هذا الـ account_id

      // حفظ أو تحديث الحساب في جدول social_accounts
      await supabaseServer.from("social_accounts").upsert({
        user_id: user.userId,
        platform: "facebook",
        platform_user_id: facebookAccountId,
        platform_username: profile.name,
        access_token: userAccessToken,
      });

      // إعادة التوجيه للداشبورد
      const url = new URL("/dashboard", req.url);
      const res = NextResponse.redirect(url);

      // تخزين التوكن في كوكيز
      res.cookies.set("fb_token", userAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });

      return res;
    } catch (err: any) {
      console.error("FB CALLBACK ERROR:", err);
      return NextResponse.json(
        { message: "Unexpected error", error: String(err.message || err) },
        { status: 500 }
      );
    }
  });
}
