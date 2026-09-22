import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "genradius_user";

function secretKey() {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("Set AUTH_SECRET (or ADMIN_SECRET) in env");
  }
  return new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 64));
}

export type UserSession = {
  userId: string;
  phone?: string;
  email?: string;
  name?: string;
  provider?: "phone" | "email" | "google";
};

export async function createUserSession(session: UserSession) {
  const token = await new SignJWT({
    role: "customer",
    userId: session.userId,
    phone: session.phone || "",
    email: session.email || "",
    name: session.name || "",
    provider: session.provider || "phone",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearUserSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getUserSession(): Promise<UserSession | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== "customer") return null;
    const userId = String(payload.userId || "");
    if (!userId) return null;
    const phone = String(payload.phone || "") || undefined;
    const email = String(payload.email || "") || undefined;
    const name = String(payload.name || "") || undefined;
    const provider = (String(payload.provider || "phone") ||
      "phone") as UserSession["provider"];
    if (!phone && !email && provider !== "google") return null;
    return { userId, phone, email, name, provider };
  } catch {
    return null;
  }
}

export async function requireUserApi() {
  const session = await getUserSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null as UserSession | null,
    };
  }
  return { error: null, session };
}

import { getSiteUrl } from "@/lib/site";

export function appBaseUrl(req?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (req) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    if (host) return `${proto.split(",")[0].trim()}://${host.split(",")[0].trim()}`;
  }
  return getSiteUrl();
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
}
