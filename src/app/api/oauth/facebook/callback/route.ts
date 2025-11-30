import { saveFacebookAccount } from "@/shared/libs/facebook/facebookStore";
import { NextRequest, NextResponse } from "next/server";

const APP_ID = process.env.FACEBOOK_APP_ID!;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

async function getCurrentUserId(): Promise<string> {
  return "USER_1";
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      { message: "Facebook login error", error },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { message: "No code provided from Facebook" },
      { status: 400 }
    );
  }

  try {
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token` +
        `?client_id=${APP_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&client_secret=${APP_SECRET}` +
        `&code=${code}`
    );

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      return NextResponse.json(
        { message: "Error from Facebook", error: tokenData },
        { status: 500 }
      );
    }

    const userAccessToken = tokenData.access_token;

  
    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`
    );
    const pagesData = await pagesRes.json();

    if (!pagesRes.ok) {
      return NextResponse.json(
        { message: "Error getting pages", error: pagesData },
        { status: 500 }
      );
    }

    const pages = pagesData.data || [];

    if (pages.length === 0) {
      return NextResponse.json(
        { message: "لا يوجد صفحات لهذا الحساب" },
        { status: 400 }
      );
    }

    const firstPage = pages[0];
    const pageId = firstPage.id;
    const pageName = firstPage.name;
    const pageAccessToken = firstPage.access_token;

    const userId = await getCurrentUserId();

    saveFacebookAccount(userId, {
      pageId,
      pageName,
      pageAccessToken,
    });

    // 4) نرجّعك على الداشبورد
    return NextResponse.redirect(new URL("/dashboard?fb=connected=1", req.url));
  } catch (err: any) {
    return NextResponse.json(
      {
        message: "Error while connecting Facebook",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}
