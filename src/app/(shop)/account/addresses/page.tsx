"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { INDIAN_STATES } from "@/lib/india-states";

type Addr = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const field =
  "w-full rounded-2xl border border-[var(--ink)]/12 bg-white px-3 py-2 text-sm";

export default function AddressesPage() {
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<Addr[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: true,
  });

  async function load() {
    const res = await fetch("/api/account/addresses");
    if (!res.ok) return;
    const data = await res.json();
    setAddresses(data.addresses || []);
  }

  useEffect(() => {
    if (user) void load();
  }, [user]);

  if (loading) return <p className="p-8 text-sm">Loading…</p>;
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm">Sign in to manage addresses.</p>
        <Link href="/login" className="btn-accent mt-4 inline-flex px-6 py-3 text-sm">
          Log in
        </Link>
      </div>
    );
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    setAddresses(data.addresses);
    setForm({
      label: "Home",
      fullName: user?.name || "",
      phone: user?.phone || "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-[family-name:var(--font-heavy)] text-4xl leading-[0.95] tracking-tight uppercase sm:text-5xl">
        Addresses
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        Saved addresses prefill checkout. Default is used first.
      </p>
      <ul className="mt-6 space-y-3">
        {addresses.map((a) => (
          <li
            key={a.id}
            className="rounded-2xl border border-[var(--ink)]/12 bg-white p-4"
          >
            <p className="text-xs font-extrabold uppercase text-[var(--moss)]">
              {a.label}
              {a.isDefault ? " · Default" : ""}
            </p>
            <p className="font-semibold">{a.fullName}</p>
            <p className="text-sm text-[var(--moss)]">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
              <br />
              {a.city}, {a.state} {a.pincode}
              <br />
              {a.phone}
            </p>
            <div className="mt-2 flex gap-3 text-xs font-extrabold uppercase">
              {!a.isDefault ? (
                <button
                  type="button"
                  className="underline"
                  onClick={() =>
                    void fetch("/api/account/addresses", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: a.id, setDefault: true }),
                    }).then(load)
                  }
                >
                  Set default
                </button>
              ) : null}
              <button
                type="button"
                className="underline"
                onClick={() =>
                  void fetch(`/api/account/addresses?id=${a.id}`, {
                    method: "DELETE",
                  }).then(load)
                }
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="mt-8 space-y-3 rounded-2xl border border-[var(--ink)]/12 p-4">
        <h2 className="text-sm font-extrabold uppercase">Add address</h2>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <input
          className={field}
          placeholder="Label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className={field}
          placeholder="Full name"
          required
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className={field}
          placeholder="Phone"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className={field}
          placeholder="Line 1"
          required
          value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })}
        />
        <input
          className={field}
          placeholder="Line 2"
          value={form.line2}
          onChange={(e) => setForm({ ...form, line2: e.target.value })}
        />
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            className={field}
            placeholder="City"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <select
            className={field}
            required
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          >
            <option value="">State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            className={field}
            placeholder="Pincode"
            required
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          Default address
        </label>
        <button type="submit" className="btn-accent px-6 py-3 text-sm">
          Save address
        </button>
      </form>
    </div>
  );
}
