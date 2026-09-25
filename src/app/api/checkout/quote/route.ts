import { NextResponse } from "next/server";
import {
  computeCheckoutTotals,
  getCheckoutSettings,
} from "@/lib/site-settings";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { priceCart, type CheckoutItemInput } from "@/lib/orders";
import { isShiprocketConfigured, quoteShipping } from "@/lib/shiprocket";
import { weightKg } from "@/lib/orders";

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
      paymentMethod?: "prepaid" | "cod";
      subtotal?: number;
    };
    const pincode = String(body.pincode || "").replace(/\D/g, "");
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Enter a 6-digit pincode" }, { status: 400 });
    }

    const priced = await priceCart(body.items || []);
    if (!priced.ok) {
      return NextResponse.json({ error: priced.error }, { status: 400 });
    }

    const settings = await getCheckoutSettings();
    const method = body.paymentMethod === "cod" ? "cod" : "prepaid";
    const fees = computeCheckoutTotals(priced.subtotal, method, settings);

    let courier = "Standard";
    let etd = "";
    if (isShiprocketConfigured()) {
      try {
        const quote = await quoteShipping({
          deliveryPincode: pincode,
          weightKg: weightKg(priced.items),
        });
        courier = quote.courier;
        etd = quote.etd;
      } catch {
        /* keep defaults */
      }
    }

    const remainingForFree = Math.max(
      0,
      settings.freeShippingThreshold - priced.subtotal,
    );

    return NextResponse.json({
      amount: fees.shippingFee,
      shippingFee: fees.shippingFee,
      codFee: fees.codFee,
      total: fees.total,
      subtotal: priced.subtotal,
      courier,
      etd,
      freeShippingThreshold: settings.freeShippingThreshold,
      remainingForFree,
      freeShipping: fees.shippingFee === 0,
      fallback: !isShiprocketConfigured(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Shipping quote failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
