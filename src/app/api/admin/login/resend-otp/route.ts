import { NextResponse } from "next/server";
import { getAdminPendingSession } from "@/lib/admin-auth";
import { maskPhone } from "@/lib/phone";
import { sendPhoneOtp } from "@/lib/twilio";

export async function POST() {
  try {
    const pending = await getAdminPendingSession();
    if (!pending) {
      return NextResponse.json(
        { error: "Sign in with email and password first" },
        { status: 401 },
      );
    }

    const otp = await sendPhoneOtp(pending.phone);
    if (!otp.ok) {
      return NextResponse.json(
        { error: "Could not resend OTP" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      phoneMasked: maskPhone(pending.phone),
      message: otp.message,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to resend OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
