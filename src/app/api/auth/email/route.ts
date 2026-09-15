import { NextResponse } from "next/server";
import {
  hashPassword,
  normalizeEmail,
  verifyPassword,
} from "@/lib/password";
import { createUserSession } from "@/lib/user-auth";
import { touchLogin, upsertEmailUser } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
      name?: string;
      mode?: "login" | "signup";
    };

    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");
    const mode = body.mode === "signup" ? "signup" : "login";
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

    if (mode === "signup") {
      const passwordHash = await hashPassword(password);
      const result = await upsertEmailUser({
        email,
        passwordHash,
        name,
        create: true,
      });
      if (!result.ok) {
        return NextResponse.json(
          { error: result.error },
          { status: result.status },
        );
      }
      await createUserSession({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        provider: "email",
      });
      return NextResponse.json({
        ok: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
      });
    }

    const result = await upsertEmailUser({ email, create: false });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    if (!result.user.passwordHash) {
      return NextResponse.json(
        {
          error:
            "This email is linked to Google. Use Continue with Google instead.",
        },
        { status: 400 },
      );
    }

    const valid = await verifyPassword(password, result.user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
    }

    await touchLogin(result.user.id);
    await createUserSession({
      userId: result.user.id,
      email: result.user.email,
      phone: result.user.phone,
      name: result.user.name,
      provider: "email",
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Email login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
