import { NextResponse } from "next/server";
import {
  createAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    if (!body.password || !verifyAdminPassword(body.password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
