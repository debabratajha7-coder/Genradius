import { NextResponse } from "next/server";
import { checkEmailOtp } from "@/lib/email-otp";
import { normalizeEmail } from "@/lib/password";
import { getUserSession } from "@/lib/user-auth";

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { email?: string; code?: string };
    const email = normalizeEmail(String(body.email || ""));
    const code = String(body.code || "");

    if (!email) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }
    if (!/^\d{4,8}$/.test(code.trim())) {
      return NextResponse.json({ error: "Enter the OTP code" }, { status: 400 });
    }

    const ok = checkEmailOtp({
      userId: session.userId,
      email,
      code,
    });
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid or expired email OTP" },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true, email, verified: true });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Email verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
