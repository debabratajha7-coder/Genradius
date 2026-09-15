import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { sendPhoneOtp } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { phone?: string };
    const phone = normalizePhone(String(body.phone || ""));
    if (!phone) {
      return NextResponse.json(
        { error: "Enter a valid phone number (10-digit India or +countrycode)." },
        { status: 400 },
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
