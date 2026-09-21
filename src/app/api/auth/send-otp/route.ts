import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizePhone } from "@/lib/phone";
import { sendPhoneOtp } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const limited = rateLimit({
      key: `otp:phone:${ip}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Too many OTP requests. Try again in ${limited.retryAfterSec}s.` },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const body = (await req.json()) as { phone?: string };
    const phone = normalizePhone(String(body.phone || ""));
    if (!phone) {
      return NextResponse.json(
        {
          error:
            "Enter a valid phone number (10-digit India or +countrycode).",
        },
        { status: 400 },
      );
    }

    const perPhone = rateLimit({
      key: `otp:phone:num:${phone}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!perPhone.ok) {
      return NextResponse.json(
        { error: "Too many codes for this number. Wait and try again." },
        { status: 429 },
      );
    }

    const result = await sendPhoneOtp(phone);
    return NextResponse.json({
      ok: true,
      phone,
      mock: Boolean(result.mock),
      message: result.message,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to send OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
