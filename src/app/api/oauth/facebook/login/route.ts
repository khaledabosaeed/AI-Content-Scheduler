// app/api/auth/facebook/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ID = process.env.FACEBOOK_APP_ID!;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  // الصلاحيات اللي نطلبها من فيسبوك
  const scopes = [
    "public_profile",
    "email",
    "pages_show_list",
    "pages_manage_posts",
    "pages_read_engagement",
  ].join(",");

  const fbLoginUrl =
    `https://www.facebook.com/v18.0/dialog/oauth` +
    `?client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${scopes}`;

  // نعمل redirect مباشرة لصفحة تسجيل الدخول تبعت فيسبوك
  return NextResponse.redirect(fbLoginUrl);
}
