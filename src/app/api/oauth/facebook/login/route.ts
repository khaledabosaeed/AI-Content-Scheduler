//إنشاء رابط تسجيل الدخول في فيسبوك وإرجاع redirect للمستخدم إلى صفحة تسجيل الدخول الخاصة بفيسبوك.

import { NextRequest, NextResponse } from "next/server";

const APP_ID = process.env.FACEBOOK_APP_ID!;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

export async function GET() {
  //المتتطلبات الي حيطلبها التطبيق من المستخدم(الصلاحيات  )
  const scopes = [
    "public_profile",
    "email",
    "pages_show_list",
    "pages_manage_posts",
    "pages_read_engagement",
  ].join(",");

  // حيتم انشاء رابط لتسجيل الدخول في فيسبوك
  const fbLoginUrl =
    `https://www.facebook.com/v18.0/dialog/oauth` +
    `?client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&response_type=code` +
    `&auth_type=rerequest`;

  return NextResponse.redirect(fbLoginUrl);
}
