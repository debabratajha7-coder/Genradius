import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/user-auth";
import { connectDB } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { INDIAN_STATES } from "@/lib/india-states";
import User from "@/models/User";

const STATES = new Set<string>(INDIAN_STATES);

function serializeAddresses(
  addresses: {
    _id?: { toString(): string };
    label?: string;
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    isDefault?: boolean;
  }[],
) {
  return addresses.map((a) => ({
    id: String(a._id),
    label: a.label || "Home",
    fullName: a.fullName || "",
    phone: a.phone || "",
    line1: a.line1 || "",
    line2: a.line2 || "",
    city: a.city || "",
    state: a.state || "",
    pincode: a.pincode || "",
    country: a.country || "India",
    isDefault: Boolean(a.isDefault),
  }));
}

export async function GET() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;
  await connectDB();
  const user = await User.findById(auth.session!.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ addresses: serializeAddresses(user.addresses || []) });
}

export async function POST(req: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;
  try {
    const body = await req.json();
    const phone = normalizePhone(String(body.phone || ""));
    const fullName = String(body.fullName || "").trim();
    const line1 = String(body.line1 || "").trim();
    const line2 = String(body.line2 || "").trim();
    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim();
    const pincode = String(body.pincode || "").replace(/\D/g, "");
    const label = String(body.label || "Home").trim() || "Home";
    const isDefault = Boolean(body.isDefault);

    if (fullName.length < 2)
      return NextResponse.json({ error: "Enter full name" }, { status: 400 });
    if (!phone)
      return NextResponse.json({ error: "Valid phone required" }, { status: 400 });
    if (line1.length < 6)
      return NextResponse.json({ error: "Enter address line" }, { status: 400 });
    if (city.length < 2)
      return NextResponse.json({ error: "Enter city" }, { status: 400 });
    if (!STATES.has(state))
      return NextResponse.json({ error: "Select a state" }, { status: 400 });
    if (!/^\d{6}$/.test(pincode))
      return NextResponse.json({ error: "6-digit pincode required" }, { status: 400 });

    await connectDB();
    const user = await User.findById(auth.session!.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (isDefault || !(user.addresses || []).length) {
      for (const a of user.addresses || []) a.isDefault = false;
    }

    user.addresses = user.addresses || [];
    user.addresses.push({
      label,
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      country: "India",
      isDefault: isDefault || user.addresses.length === 0,
    });
    await user.save();
    return NextResponse.json({
      addresses: serializeAddresses(user.addresses),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await connectDB();
    const user = await User.findById(auth.session!.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const addr = (user.addresses || []).find((a) => String(a._id) === id);
    if (!addr) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.setDefault) {
      for (const a of user.addresses || []) a.isDefault = false;
      addr.isDefault = true;
    }
    if (body.fullName != null) addr.fullName = String(body.fullName).trim();
    if (body.phone != null) {
      const phone = normalizePhone(String(body.phone));
      if (!phone)
        return NextResponse.json({ error: "Valid phone required" }, { status: 400 });
      addr.phone = phone;
    }
    if (body.line1 != null) addr.line1 = String(body.line1).trim();
    if (body.line2 != null) addr.line2 = String(body.line2).trim();
    if (body.city != null) addr.city = String(body.city).trim();
    if (body.state != null) addr.state = String(body.state).trim();
    if (body.pincode != null)
      addr.pincode = String(body.pincode).replace(/\D/g, "");
    if (body.label != null) addr.label = String(body.label).trim() || "Home";

    await user.save();
    return NextResponse.json({
      addresses: serializeAddresses(user.addresses || []),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;
  try {
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await connectDB();
    const user = await User.findById(auth.session!.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    user.addresses.pull(id);
    if (user.addresses.length && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
    return NextResponse.json({
      addresses: serializeAddresses(user.addresses),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
