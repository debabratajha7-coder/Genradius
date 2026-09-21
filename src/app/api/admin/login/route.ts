import { NextResponse } from "next/server";
import { createAdminPendingSession } from "@/lib/admin-auth";
import {
  authenticateAdmin,
  bootstrapAdminConfigured,
  ensureBootstrapAdmin,
} from "@/lib/admin-users";
import { normalizeEmail } from "@/lib/password";
import { maskPhone } from "@/lib/phone";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendPhoneOtp } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const limited = rateLimit({
      key: `admin:login:${clientIp(req)}`,
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Try again in ${limited.retryAfterSec}s.`,
        },
        { status: 429 },
      );
    }

    if (!bootstrapAdminConfigured()) {
      return NextResponse.json(
        {
          error:
            "Admin bootstrap incomplete. Set ADMIN_EMAIL, ADMIN_PASSWORD, and a valid ADMIN_PHONE (E.164 like +9198XXXXXXXX) in .env.local, then restart the server.",
        },
        { status: 503 },
      );
    }

    await ensureBootstrapAdmin();
    const body = (await req.json()) as { email?: string; password?: string };

    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (!admin.phone) {
      return NextResponse.json(
        {
          error:
            "This admin has no phone on file. Ask an owner to add one before login.",
        },
        { status: 400 },
      );
    }

    await createAdminPendingSession({
      adminId: admin._id,
      email: admin.email,
      phone: admin.phone,
    });

    const otp = await sendPhoneOtp(admin.phone);
    return NextResponse.json({
      ok: true,
      needsOtp: true,
      phoneMasked: maskPhone(admin.phone),
      message: otp.message,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
