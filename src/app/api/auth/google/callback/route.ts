import { NextResponse } from "next/server";
import {
  appBaseUrl,
  createUserSession,
  isGoogleConfigured,
} from "@/lib/user-auth";
import { upsertGoogleUser } from "@/lib/users";
import { cookies } from "next/headers";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  id?: string;
  sub?: string;
  email?: string;
  name?: string;
  verified_email?: boolean;
};

export async function GET(req: Request) {
  const base = appBaseUrl(req);
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(oauthError)}`, base),
    );
  }

  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", base),
    );
  }

  const jar = await cookies();
  const savedState = jar.get("genradius_oauth_state")?.value;
  jar.delete("genradius_oauth_state");

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", base));
  }

  try {
    const redirectUri = `${base}/api/auth/google/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokenJson = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenRes.ok || !tokenJson.access_token) {
      throw new Error(
        tokenJson.error_description || tokenJson.error || "Token exchange failed",
      );
    }

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      },
    );
    const profile = (await profileRes.json()) as GoogleUserInfo;
    if (!profileRes.ok) {
      throw new Error("Failed to load Google profile");
    }

    const googleId = profile.id || profile.sub;
    if (!googleId) throw new Error("Missing Google user id");

    const user = await upsertGoogleUser({
      googleId,
      email: profile.email,
      name: profile.name,
    });

    await createUserSession({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      provider: "google",
    });

    return NextResponse.redirect(new URL("/account", base));
  } catch (e) {
    const message = e instanceof Error ? e.message : "google_failed";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, base),
    );
  }
}
