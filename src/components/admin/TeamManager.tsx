"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ADMIN_PERMISSIONS,
  type AdminPermissionId,
} from "@/lib/admin-permissions";

type AdminRow = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: "owner" | "staff";
  permissions: AdminPermissionId[];
  active: boolean;
};

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

export function TeamManager() {
  const [users, setUsers] = useState<AdminRow[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"owner" | "staff">("staff");
  const [permissions, setPermissions] = useState<AdminPermissionId[]>([
    "dashboard",
    "products",
  ]);

  async function load() {
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load team");
      return;
    }
    setUsers(data.users || []);
  }

  useEffect(() => {
    void load();
  }, []);

  function togglePerm(id: AdminPermissionId) {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
          role,
          permissions: role === "owner" ? undefined : permissions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setRole("staff");
      setStatus("Admin user created — they sign in with email, password, then phone OTP.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function patchUser(
    id: string,
    body: Partial<{
      active: boolean;
      permissions: AdminPermissionId[];
      role: "owner" | "staff";
    }>,
  ) {
    setError("");
    const res = await fetch(`/api/admin/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Update failed");
      return;
    }
    await load();
  }

  async function removeUser(id: string) {
    if (!confirm("Remove this admin user?")) return;
    const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Delete failed");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onCreate}
        className="space-y-4 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]"
      >
        <h2 className="text-sm font-extrabold tracking-wider uppercase">
          Add admin user
        </h2>
        <p className="text-xs text-[var(--moss)]">
          They’ll log in with email + password, then verify phone OTP every time.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Name
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Email
            <input
              required
              type="email"
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Phone (OTP)
            <input
              required
              className={field}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91…"
            />
          </label>
          <label className="block space-y-1 text-xs font-extrabold uppercase">
            Temp password
            <input
              required
              type="password"
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </label>
        </div>
        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Role
          <select
            className={field}
            value={role}
            onChange={(e) => setRole(e.target.value as "owner" | "staff")}
          >
            <option value="staff">Staff (limited)</option>
            <option value="owner">Owner (full access)</option>
          </select>
        </label>

        {role === "staff" && (
          <fieldset>
            <legend className="mb-2 text-xs font-extrabold tracking-wider uppercase">
              Permissions
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ADMIN_PERMISSIONS.filter((p) => p.id !== "team").map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={permissions.includes(p.id)}
                    onChange={() => togglePerm(p.id)}
                  />
                  {p.label}
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={permissions.includes("team")}
                  onChange={() => togglePerm("team")}
                />
                Manage admin team
              </label>
            </div>
          </fieldset>
        )}

        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        {status && (
          <p className="text-sm font-semibold text-[var(--olive)]">{status}</p>
        )}
        <button type="submit" disabled={busy} className="btn-accent px-6 py-3 text-sm">
          {busy ? "Creating…" : "Create admin"}
        </button>
      </form>

      <ul className="space-y-3">
        {users.map((u) => (
          <li
            key={u._id}
            className="rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {u.name || u.email}{" "}
                  <span className="text-[10px] font-extrabold tracking-wider text-[var(--moss)] uppercase">
                    {u.role}
                    {!u.active ? " · inactive" : ""}
                  </span>
                </p>
                <p className="text-sm text-[var(--moss)]">{u.email}</p>
                <p className="text-xs text-[var(--moss)]">{u.phone}</p>
                {u.role === "staff" && (
                  <p className="mt-1 text-[10px] text-[var(--moss)]">
                    Access:{" "}
                    {u.permissions.length
                      ? u.permissions.join(", ")
                      : "none"}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-xs font-extrabold uppercase underline"
                  onClick={() =>
                    patchUser(u._id, { active: !u.active })
                  }
                >
                  {u.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  className="text-xs font-extrabold text-red-700 uppercase underline"
                  onClick={() => removeUser(u._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            {u.role === "staff" && (
              <div className="mt-3 grid gap-1 border-t border-[var(--ink)]/10 pt-3 sm:grid-cols-2">
                {ADMIN_PERMISSIONS.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={u.permissions.includes(p.id)}
                      onChange={() => {
                        const next = u.permissions.includes(p.id)
                          ? u.permissions.filter((x) => x !== p.id)
                          : [...u.permissions, p.id];
                        void patchUser(u._id, { permissions: next });
                      }}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
