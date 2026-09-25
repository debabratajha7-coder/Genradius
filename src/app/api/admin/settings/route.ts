import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  getCheckoutSettings,
  updateCheckoutSettings,
} from "@/lib/site-settings";

export async function GET() {
  const denied = await requireAdminApi("orders");
  if (denied) return denied;
  try {
    const settings = await getCheckoutSettings();
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdminApi("orders");
  if (denied) return denied;
  try {
    const body = await req.json();
    const settings = await updateCheckoutSettings(body);
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
