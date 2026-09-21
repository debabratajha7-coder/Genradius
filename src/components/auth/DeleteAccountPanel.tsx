"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const REASONS = [
  { id: "too_many_emails", label: "Too many emails / notifications" },
  { id: "privacy", label: "Privacy concerns" },
  { id: "not_using", label: "I’m not using Genradius anymore" },
  { id: "created_by_mistake", label: "Created by mistake / testing" },
  { id: "switching_account", label: "Switching to another account" },
  { id: "other", label: "Other" },
] as const;

const field =
  "w-full rounded border border-[var(--ink)]/25 bg-white px-3 py-2 text-sm outline-none";

export function DeleteAccountPanel() {
  const { logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [confirm, setConfirm] = useState("");
  const [removeNewsletter, setRemoveNewsletter] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onDelete(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          details,
          confirm,
          removeNewsletter,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete account");

      try {
        localStorage.removeItem("genradius-addresses-v1");
        localStorage.removeItem("genradius-wishlist-v1");
      } catch {
        /* ignore */
      }

      await logout();
      router.replace("/login?deleted=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 border-t border-[var(--ink)]/10 pt-6">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[11px] text-[var(--muted)] underline-offset-2 hover:underline"
        >
          Delete account
        </button>
      ) : (
        <form onSubmit={onDelete} className="max-w-md space-y-3">
          <p className="text-[11px] font-medium tracking-wide text-[var(--muted)] uppercase">
            Delete account
          </p>
          <p className="text-xs leading-relaxed text-[var(--moss)]">
            This permanently removes your member login. Type{" "}
            <span className="font-mono">DELETE</span> to confirm. Can’t be
            undone.
          </p>

          <fieldset className="space-y-1.5">
            <legend className="text-[11px] text-[var(--moss)]">
              Reason <span aria-hidden>*</span>
            </legend>
            <div className="space-y-1">
              {REASONS.map((r) => (
                <label
                  key={r.id}
                  className="flex cursor-pointer items-start gap-2 text-xs text-[var(--moss)]"
                >
                  <input
                    type="radio"
                    name="delete-reason"
                    required
                    className="mt-0.5"
                    checked={reason === r.id}
                    onChange={() => setReason(r.id)}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block space-y-1 text-[11px] text-[var(--moss)]">
            Optional details
            <textarea
              rows={2}
              className={field}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={1000}
            />
          </label>

          <label className="flex items-start gap-2 text-xs text-[var(--moss)]">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={removeNewsletter}
              onChange={(e) => setRemoveNewsletter(e.target.checked)}
            />
            <span>Unsubscribe from drop emails too</span>
          </label>

          <label className="block space-y-1 text-[11px] text-[var(--moss)]">
            Type DELETE
            <input
              required
              className={field}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
          </label>

          {error && <p className="text-xs text-red-700">{error}</p>}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              disabled={busy || confirm.toUpperCase() !== "DELETE" || !reason}
              className="text-xs text-[var(--muted)] underline disabled:no-underline disabled:opacity-40"
            >
              {busy ? "Deleting…" : "Confirm delete"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setError("");
                setConfirm("");
              }}
              className="text-xs font-semibold text-[var(--moss)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
