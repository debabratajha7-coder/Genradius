import { AdminGate } from "@/components/admin/AdminGate";
import { PromosManager } from "@/components/admin/PromosManager";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Promo from "@/models/Promo";
import type { PromoLean } from "@/types/catalog";
import { memoryPromos } from "@/data/catalog";

async function loadPromos(): Promise<PromoLean[]> {
  if (useMemoryCatalog()) {
    return memoryPromos();
  }
  try {
    await connectDB();
    const rows = await Promo.find().sort({ order: 1 }).lean();
    return rows.map((r) => ({
      _id: String(r._id),
      text: r.text,
      active: Boolean(r.active),
      order: Number(r.order) || 0,
    }));
  } catch {
    return memoryPromos();
  }
}

export default async function AdminPromosPage() {
  const promos = await loadPromos();

  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Promos
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        Ticker + floating offer copy for the phone storefront.
      </p>
      <div className="mt-6">
        <PromosManager initial={promos} />
      </div>
    </AdminGate>
  );
}
