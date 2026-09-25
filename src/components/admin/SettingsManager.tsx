"use client";

import { useEffect, useState } from "react";

type Settings = {
  freeShippingThreshold: number;
  shippingFee: number;
  codFee: number;
  codEnabled: boolean;
  emiEnabled: boolean;
  pickupLocationName: string;
  codOtpRequired: boolean;
};

export function SettingsManager() {
  const [form, setForm] = useState<Settings | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setForm(d))
      .catch(() => setStatus("Failed to load settings"));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setForm(data);
      setStatus("Saved");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!form) {
    return <p className="text-sm text-[var(--moss)]">Loading settings…</p>;
  }

  const field =
    "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

  return (
    <form onSubmit={save} className="max-w-xl space-y-4">
      <label className="block space-y-1 text-xs font-extrabold uppercase">
        Free shipping threshold (₹)
        <input
          type="number"
          className={field}
          value={form.freeShippingThreshold}
          onChange={(e) =>
            setForm({ ...form, freeShippingThreshold: Number(e.target.value) })
          }
        />
      </label>
      <label className="block space-y-1 text-xs font-extrabold uppercase">
        Shipping fee below threshold (₹)
        <input
          type="number"
          className={field}
          value={form.shippingFee}
          onChange={(e) =>
            setForm({ ...form, shippingFee: Number(e.target.value) })
          }
        />
      </label>
      <label className="block space-y-1 text-xs font-extrabold uppercase">
        COD fee (₹)
        <input
          type="number"
          className={field}
          value={form.codFee}
          onChange={(e) => setForm({ ...form, codFee: Number(e.target.value) })}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-bold">
        <input
          type="checkbox"
          checked={form.codEnabled}
          onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })}
        />
        Enable cash on delivery
      </label>
      <label className="flex items-center gap-2 text-sm font-bold">
        <input
          type="checkbox"
          checked={form.emiEnabled}
          onChange={(e) => setForm({ ...form, emiEnabled: e.target.checked })}
        />
        Show approximate EMI on PDP (display only)
      </label>
      <label className="block space-y-1 text-xs font-extrabold uppercase">
        Shiprocket pickup location name
        <input
          className={field}
          value={form.pickupLocationName}
          onChange={(e) =>
            setForm({ ...form, pickupLocationName: e.target.value })
          }
        />
        <span className="text-[11px] font-normal normal-case text-[var(--moss)]">
          Must match the pickup location name in Shiprocket exactly. COD OTP
          required: {form.codOtpRequired ? "yes (Twilio on)" : "no"}.
        </span>
      </label>
      {status ? <p className="text-sm font-semibold">{status}</p> : null}
      <button type="submit" disabled={busy} className="btn-accent px-6 py-3 text-sm">
        {busy ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
