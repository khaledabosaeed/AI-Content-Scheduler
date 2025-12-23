import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createToken } from "@/shared/libs/auth/jwt";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const cookieStore = await cookies();

  const savedState = cookieStore.get("google_oauth_state")?.value;
  if (!state || state !== savedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokenRes.ok) {
    console.error("Google token exchange error:", tokens);
    return NextResponse.json(
      { error: tokens?.error_description || "Token exchange failed" },
      { status: 400 }
    );
  }

  const { access_token, refresh_token, expires_in, id_token } = tokens;

  if (!access_token) {
    return NextResponse.json({ error: "Missing access_token" }, { status: 400 });
  }

  const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const googleUser = await userInfoRes.json();

  const email = googleUser?.email?.toLowerCase();
  if (!email) return NextResponse.json({ error: "Google email missing" }, { status: 400 });

  if (id_token) {
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabaseAuth.auth.signInWithIdToken({
      provider: "google",
      token: id_token,
    });

    if (error) {
      console.error("Supabase signInWithIdToken error:", error);
    } else if (data.session) {
      cookieStore.set("sb-access-token", data.session.access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      cookieStore.set("sb-refresh-token", data.session.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  const supabaseDb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let userId: string;

  const { data: existingUser, error: exErr } = await supabaseDb
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (exErr) {
    console.error(exErr);
    return NextResponse.json({ error: "DB error fetching user" }, { status: 500 });
  }

  if (existingUser?.id) {
    userId = existingUser.id;
  } else {
    const { data: newUser, error: insErr } = await supabaseDb
      .from("users")
      .insert({
        email,
        name: googleUser?.name ?? email.split("@")[0],
      })
      .select("id")
      .single();

    if (insErr || !newUser) {
      console.error(insErr);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    userId = newUser.id;
  }

  // ✅ Save Google tokens in social_accounts
  const updateData: any = {
    user_id: userId,
    provider: "google",
    provider_account_email: email,
    access_token,
    token_expires_at: new Date(Date.now() + Number(expires_in || 0) * 1000).toISOString(),
    is_active: true,
  };
  if (refresh_token) updateData.refresh_token = refresh_token;

  await supabaseDb.from("social_accounts").upsert(updateData, {
    onConflict: "user_id,provider",
  });

const jwt = await createToken({
  userId,
  email,
  name: googleUser?.name ?? null,
});

  cookieStore.set("session", jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // optional: clear state cookie
  cookieStore.set("google_oauth_state", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.redirect(new URL("/chat", req.url));
}
