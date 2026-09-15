"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] p-6 shadow-[6px_6px_0_0_var(--ink)]"
      >
        <h1 className="font-[family-name:var(--font-logo)] text-2xl uppercase">
          Genradius Admin
        </h1>
        <p className="mt-1 text-sm text-[var(--moss)]">
          Enter the admin password from your env.
        </p>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="mt-5 w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 shadow-[2px_2px_0_0_var(--ink)]"
        />
        {error && (
          <p className="mt-2 text-sm font-semibold text-red-700">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn-accent mt-4 w-full py-3 text-sm"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
