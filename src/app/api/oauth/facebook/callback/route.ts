// app/api/oauth/facebook/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ID = process.env.FACEBOOK_APP_ID!;
const APP_SECRET = process.env.FACEBOOK_API_SECRET!;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code)
      return NextResponse.json({ message: "Missing code" }, { status: 400 });

    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${APP_ID}&client_secret=${APP_SECRET}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${code}`
    );

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.json(
        { message: "Facebook error", detail: tokenData },
        { status: 400 }
      );
    }

    const userAccessToken = tokenData.access_token;

    const url = new URL("/dashboard", req.url);
    const res = NextResponse.redirect(url);

    res.cookies.set("fb_token", userAccessToken, {
      httpOnly: true,
      secure: false, // على localhost
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err: any) {
    console.error("FB CALLBACK ERROR:", err, err?.cause);
    return NextResponse.json(
      {
        message: "Unexpected error",
        error: String(err?.message || err),
        cause: String(err?.cause || ""),
      },
      { status: 500 }
    );
  }
}
