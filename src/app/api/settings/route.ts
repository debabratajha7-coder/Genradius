import { NextResponse } from "next/server";
import { getCheckoutSettings } from "@/lib/site-settings";

export async function GET() {
  const s = await getCheckoutSettings();
  return NextResponse.json({
    freeShippingThreshold: s.freeShippingThreshold,
    shippingFee: s.shippingFee,
    codFee: s.codFee,
    codEnabled: s.codEnabled,
    emiEnabled: s.emiEnabled,
    codOtpRequired: s.codOtpRequired,
  });
}
