import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  const denied = await requireAdminApi("customers");
  if (denied) return denied;

  if (useMemoryCatalog()) {
    return NextResponse.json(
      {
        customers: [],
        total: 0,
        error:
          "Customers need MongoDB. Set MONGODB_URI and USE_MEMORY_CATALOG=false.",
      },
      { status: 200 },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 25));
    const skip = (page - 1) * limit;

    await connectDB();

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      User.find(filter)
        .select("name email phone provider lastLoginAt createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const customers = rows.map((u) => ({
      _id: String(u._id),
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      provider: u.provider || "phone",
      lastLoginAt: u.lastLoginAt
        ? new Date(u.lastLoginAt).toISOString()
        : null,
      createdAt: u.createdAt
        ? new Date(u.createdAt as Date).toISOString()
        : null,
    }));

    return NextResponse.json({ customers, total, page, limit });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load customers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
