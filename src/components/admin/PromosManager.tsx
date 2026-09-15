"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { PromoLean } from "@/types/catalog";

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

export function PromosManager({ initial }: { initial: PromoLean[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          active: true,
          order: rows.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const created: PromoLean = {
        _id: String(data._id),
        text: data.text,
        active: data.active,
        order: data.order,
      };
      setRows((prev) => [...prev, created]);
      setText("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this promo?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/promos?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setRows((prev) => prev.filter((p) => p._id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--moss)]">
        These lines feed the top ticker and the floating phone offer pill.
      </p>

      <form
        onSubmit={onCreate}
        className="space-y-3 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]"
      >
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Promo text
          <input
            className={field}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Free shipping over ₹999"
            required
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="btn-accent px-6 py-3 text-sm"
        >
          {busy ? "Saving…" : "Add promo"}
        </button>
      </form>

      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

      <ul className="space-y-2">
        {rows.map((p) => (
          <li
            key={p._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border-2 border-[var(--ink)] bg-white px-4 py-3 shadow-[2px_2px_0_0_var(--ink)]"
          >
            <div>
              <p className="text-sm font-semibold">{p.text}</p>
              <p className="text-[10px] font-bold tracking-wider text-[var(--moss)] uppercase">
                {p.active ? "Active" : "Hidden"} · order {p.order}
              </p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void onDelete(p._id)}
              className="rounded-md border-2 border-red-800 bg-red-50 px-3 py-1.5 text-[10px] font-extrabold uppercase text-red-800 shadow-[2px_2px_0_0_var(--ink)]"
            >
              Delete
            </button>
          </li>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-[var(--moss)]">No promos yet.</p>
        )}
      </ul>
    </div>
  );
}
