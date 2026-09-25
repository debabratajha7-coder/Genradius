import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizePhone } from "@/lib/phone";
import { sendPhoneOtp, isTwilioConfigured } from "@/lib/twilio";
import { getCheckoutSettings } from "@/lib/site-settings";

/** Send OTP for COD confirmation when SMS is configured. */
export async function POST(req: Request) {
  const limited = rateLimit({
    key: `cod-otp:${clientIp(req)}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many OTP requests. Try in ${limited.retryAfterSec}s.` },
      { status: 429 },
    );
  }

  const settings = await getCheckoutSettings();
  if (!settings.codEnabled) {
    return NextResponse.json({ error: "COD is disabled" }, { status: 400 });
  }
  if (!isTwilioConfigured()) {
    return NextResponse.json({
      ok: true,
      required: false,
      message: "SMS not configured — COD OTP skipped.",
    });
  }

  try {
    const body = (await req.json()) as { phone?: string };
    const phone = normalizePhone(String(body.phone || ""));
    if (!phone) {
      return NextResponse.json({ error: "Valid phone required" }, { status: 400 });
    }
    const otp = await sendPhoneOtp(phone);
    return NextResponse.json({
      ok: true,
      required: true,
      phoneMasked: phone.slice(0, 3) + "•••••" + phone.slice(-4),
      message: otp.message,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "OTP failed" },
      { status: 500 },
    );
  }
}
