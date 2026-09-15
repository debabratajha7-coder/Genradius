"use client";

import { useCallback, useEffect, useState } from "react";

type CustomerRow = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  provider: string;
  lastLoginAt: string | null;
  createdAt: string | null;
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function CustomersManager() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (search: string) => {
    setBusy(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`/api/admin/customers?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setRows(data.customers || []);
      setTotal(data.total || 0);
      if (data.error) setError(data.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load("");
  }, [load]);

  return (
    <div className="space-y-5">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void load(q);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone…"
          className="min-w-[220px] flex-1 rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]"
        />
        <button type="submit" className="btn-accent px-5 py-2.5 text-xs">
          Search
        </button>
      </form>

      <p className="text-xs text-[var(--moss)]">
        {busy ? "Loading…" : `${total} customer${total === 1 ? "" : "s"}`}
      </p>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-md border-2 border-[var(--ink)] bg-white shadow-[4px_4px_0_0_var(--ink)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b-2 border-[var(--ink)] bg-[var(--accent-soft)]/40 text-[10px] font-extrabold tracking-wider uppercase">
            <tr>
              <th className="px-3 py-2.5">Name</th>
              <th className="px-3 py-2.5">Phone</th>
              <th className="px-3 py-2.5">Email</th>
              <th className="px-3 py-2.5">Provider</th>
              <th className="px-3 py-2.5">Last login</th>
              <th className="px-3 py-2.5">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c._id} className="border-b border-[var(--border)]">
                <td className="px-3 py-2.5 font-semibold">
                  {c.name || "—"}
                </td>
                <td className="px-3 py-2.5">{c.phone || "—"}</td>
                <td className="px-3 py-2.5">{c.email || "—"}</td>
                <td className="px-3 py-2.5 uppercase">{c.provider}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--moss)]">
                  {fmt(c.lastLoginAt)}
                </td>
                <td className="px-3 py-2.5 text-xs text-[var(--moss)]">
                  {fmt(c.createdAt)}
                </td>
              </tr>
            ))}
            {!busy && rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-10 text-center text-[var(--moss)]"
                >
                  No customers yet — they appear after phone / email / Google
                  signup.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
