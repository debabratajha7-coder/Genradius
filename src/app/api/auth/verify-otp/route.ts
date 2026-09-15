import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { checkPhoneOtp } from "@/lib/twilio";
import { createUserSession } from "@/lib/user-auth";
import { isProfileComplete, upsertPhoneUser } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { phone?: string; code?: string };
    const phone = normalizePhone(String(body.phone || ""));
    const code = String(body.code || "");
    if (!phone) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }
    if (!/^\d{4,8}$/.test(code.trim())) {
      return NextResponse.json({ error: "Enter the OTP code" }, { status: 400 });
    }

    const ok = await checkPhoneOtp(phone, code);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 },
      );
    }

    const user = await upsertPhoneUser(phone);
    const needsProfile = !isProfileComplete(user);

    await createUserSession({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      provider: "phone",
    });

    return NextResponse.json({
      ok: true,
      needsProfile,
      user: {
        id: user.id,
        phone,
        email: user.email || null,
        name: user.name,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
