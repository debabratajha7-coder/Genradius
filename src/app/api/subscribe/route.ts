import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscribers";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const limited = rateLimit({
      key: `subscribe:${clientIp(req)}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many subscribe attempts. Try later." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as { email?: string };
    const result = await addSubscriber(String(body.email || ""), "footer");
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    return NextResponse.json({ ok: true, email: result.email });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Subscribe failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
