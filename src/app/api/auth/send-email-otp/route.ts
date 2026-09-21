import { NextResponse } from "next/server";
import { sendEmailOtp } from "@/lib/email-otp";
import { normalizeEmail } from "@/lib/password";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getUserSession } from "@/lib/user-auth";

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = rateLimit({
      key: `otp:email:${session.userId}:${clientIp(req)}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        {
          error: `Too many email OTPs. Try again in ${limited.retryAfterSec}s.`,
        },
        { status: 429 },
      );
    }

    const body = (await req.json()) as { email?: string };
    const email = normalizeEmail(String(body.email || ""));
    if (!email) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }

    const result = await sendEmailOtp({ userId: session.userId, email });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      email,
      mock: Boolean(result.mock),
      message: result.message,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to send email OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
