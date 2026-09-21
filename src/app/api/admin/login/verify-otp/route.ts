import { NextResponse } from "next/server";
import {
  createAdminSession,
  getAdminPendingSession,
} from "@/lib/admin-auth";
import { findAdminById, touchAdminLogin } from "@/lib/admin-users";
import { checkPhoneOtp } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const pending = await getAdminPendingSession();
    if (!pending) {
      return NextResponse.json(
        { error: "Sign in with email and password first" },
        { status: 401 },
      );
    }

    const body = (await req.json()) as { code?: string };
    const code = String(body.code || "");
    if (!/^\d{4,8}$/.test(code.trim())) {
      return NextResponse.json({ error: "Enter the OTP code" }, { status: 400 });
    }

    const ok = await checkPhoneOtp(pending.phone, code);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 },
      );
    }

    const admin = await findAdminById(pending.adminId);
    if (!admin || !admin.active) {
      return NextResponse.json(
        { error: "Admin account not found or disabled" },
        { status: 401 },
      );
    }

    await createAdminSession(admin);
    await touchAdminLogin(admin._id);

    return NextResponse.json({
      ok: true,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "OTP verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
