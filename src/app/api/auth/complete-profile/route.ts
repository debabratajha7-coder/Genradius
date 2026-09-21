import { NextResponse } from "next/server";
import { consumeEmailVerification } from "@/lib/email-otp";
import { hashPassword, normalizeEmail } from "@/lib/password";
import { addSubscriber } from "@/lib/subscribers";
import { createUserSession, getUserSession } from "@/lib/user-auth";
import { completePhoneProfile } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };

    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    if (!consumeEmailVerification(session.userId, email)) {
      return NextResponse.json(
        {
          error:
            "Verify your email with the OTP we sent before finishing signup.",
        },
        { status: 403 },
      );
    }

    const passwordHash = await hashPassword(password);
    const result = await completePhoneProfile({
      userId: session.userId,
      email,
      passwordHash,
      name: name || session.name,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    await addSubscriber(email, "footer");

    await createUserSession({
      userId: result.user.id,
      phone: result.user.phone,
      email: result.user.email,
      name: result.user.name,
      provider: "phone",
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: result.user.id,
        phone: result.user.phone,
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not save profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
