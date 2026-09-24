import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { parseAddress, priceCart, weightKg, type CheckoutItemInput } from "@/lib/orders";
import { createPhonePePayment, isPhonePeConfigured } from "@/lib/phonepe";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site";
import { isShiprocketConfigured, quoteShipping } from "@/lib/shiprocket";
import Order from "@/models/Order";

export async function POST(req: Request) {
  const limited = rateLimit({
    key: `checkout:${clientIp(req)}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Wait a few minutes." },
      { status: 429 },
    );
  }

  if (!isPhonePeConfigured()) {
    return NextResponse.json(
      {
        error:
          "PhonePe isn’t configured yet. Add PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      items?: CheckoutItemInput[];
    };

    const address = parseAddress(body);
    if (!address.ok) {
      return NextResponse.json({ error: address.error }, { status: 400 });
    }
    const priced = await priceCart(body.items || []);
    if (!priced.ok) {
      return NextResponse.json({ error: priced.error }, { status: 400 });
    }

    // Free shipping for customers — Shiprocket booking can still run post-payment
    let shipping = 0;
    let courier = "Standard";
    if (isShiprocketConfigured()) {
      try {
        const quote = await quoteShipping({
          deliveryPincode: address.pincode,
          weightKg: weightKg(priced.items),
        });
        courier = quote.courier || courier;
      } catch {
        /* keep Standard — charge stays 0 */
      }
    }

    const total = priced.subtotal + shipping;
    const merchantOrderId = `GR${Date.now().toString(36).toUpperCase()}`;

    await connectDB();
    await Order.create({
      merchantOrderId,
      items: priced.items,
      subtotal: priced.subtotal,
      shipping,
      total,
      name: address.name,
      phone: address.phone,
      email: address.email,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      status: "pending",
      courier,
    });

    const pay = await createPhonePePayment({
      merchantOrderId,
      amountPaise: Math.round(total * 100),
      redirectUrl: `${getSiteUrl()}/checkout/return?order=${merchantOrderId}`,
    });

    await Order.findOneAndUpdate(
      { merchantOrderId },
      { $set: { phonepeOrderId: pay.phonepeOrderId } },
    );

    return NextResponse.json({
      ok: true,
      merchantOrderId,
      redirectUrl: pay.redirectUrl,
      total,
      shipping,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
