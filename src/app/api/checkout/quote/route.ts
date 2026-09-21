import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isShiprocketConfigured, quoteShipping } from "@/lib/shiprocket";
import { priceCart, weightKg, type CheckoutItemInput } from "@/lib/orders";

export async function POST(req: Request) {
  const limited = rateLimit({
    key: `ship:${clientIp(req)}`,
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many shipping checks" }, { status: 429 });
  }

  try {
    const body = (await req.json()) as {
      pincode?: string;
      items?: CheckoutItemInput[];
    };
    const pincode = String(body.pincode || "").replace(/\D/g, "");
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Enter a 6-digit pincode" }, { status: 400 });
    }

    const priced = await priceCart(body.items || []);
    if (!priced.ok) {
      return NextResponse.json({ error: priced.error }, { status: 400 });
    }

    if (!isShiprocketConfigured()) {
      return NextResponse.json({
        amount: 79,
        courier: "Standard",
        etd: "",
        fallback: true,
      });
    }

    const quote = await quoteShipping({
      deliveryPincode: pincode,
      weightKg: weightKg(priced.items),
    });
    return NextResponse.json({ ...quote, fallback: false });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Shipping quote failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
