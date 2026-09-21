"use client";

import { useEffect, useState, type FormEvent } from "react";

type Stats = {
  resendReady: boolean;
  from: string;
  newsletter: number;
  members: number;
  totalUnique: number;
  subscribers: { _id: string; email: string; source: string }[];
};

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

export function NotifyManager() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "newsletter" | "members">(
    "all",
  );
  const [testTo, setTestTo] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function loadStats() {
    const res = await fetch("/api/admin/notify");
    const data = await res.json();
    if (res.ok) setStats(data as Stats);
  }

  useEffect(() => {
    void loadStats();
  }, []);

  async function onSend(e: FormEvent, asTest: boolean) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const form = new FormData();
      form.set("subject", subject);
      form.set("body", body);
      form.set("audience", audience);
      if (asTest) {
        if (!testTo.trim()) {
          throw new Error("Enter a test email address");
        }
        form.set("testTo", testTo.trim());
      }
      if (files) {
        Array.from(files).forEach((f) => form.append("attachments", f));
      }

      const res = await fetch("/api/admin/notify", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");

      if (data.test) {
        setStatus(`Test sent to ${data.to}`);
      } else {
        setStatus(
          `Sent ${data.sent} of ${data.recipients}` +
            (data.failed ? ` (${data.failed} failed)` : ""),
        );
        if (data.errors?.length) {
          setError(data.errors.join(" · "));
        }
      }
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)]">
          <p className="text-[10px] font-extrabold tracking-wider text-[var(--moss)] uppercase">
            Newsletter
          </p>
          <p className="mt-1 text-2xl font-extrabold">
            {stats?.newsletter ?? "—"}
          </p>
        </div>
        <div className="rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)]">
          <p className="text-[10px] font-extrabold tracking-wider text-[var(--moss)] uppercase">
            Members w/ email
          </p>
          <p className="mt-1 text-2xl font-extrabold">
            {stats?.members ?? "—"}
          </p>
        </div>
        <div className="rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)]">
          <p className="text-[10px] font-extrabold tracking-wider text-[var(--moss)] uppercase">
            Unique total
          </p>
          <p className="mt-1 text-2xl font-extrabold">
            {stats?.totalUnique ?? "—"}
          </p>
        </div>
      </div>

      {!stats?.resendReady && (
        <p className="rounded-md border-2 border-amber-700 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          Add <code className="font-mono">RESEND_API_KEY</code> and{" "}
          <code className="font-mono">RESEND_FROM</code> to{" "}
          <code className="font-mono">.env.local</code>, then restart{" "}
          <code className="font-mono">npm run dev</code>.
        </p>
      )}

      {stats?.resendReady && (
        <p className="text-xs text-[var(--moss)]">
          Sending as <span className="font-semibold">{stats.from}</span>
        </p>
      )}

      <form
        onSubmit={(e) => onSend(e, false)}
        className="space-y-4 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]"
      >
        <h2 className="text-sm font-extrabold tracking-wider uppercase">
          New drop / announcement
        </h2>

        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Audience
          <select
            className={field}
            value={audience}
            onChange={(e) =>
              setAudience(e.target.value as "all" | "newsletter" | "members")
            }
          >
            <option value="all">Everyone (newsletter + members)</option>
            <option value="newsletter">Footer newsletter only</option>
            <option value="members">Logged-in members with email only</option>
          </select>
        </label>

        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Subject
          <input
            required
            className={field}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="New drop is live — Orbit tees"
          />
        </label>

        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Message
          <textarea
            required
            rows={8}
            className={field}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={"Hey circle,\n\nFresh pieces just landed…\n\nShop now: https://…"}
          />
        </label>

        <label className="block space-y-1 text-xs font-extrabold uppercase">
          Attachments (lookbook PDF, images — max 8MB each)
          <input
            type="file"
            multiple
            className="block w-full text-sm"
            onChange={(e) => setFiles(e.target.files)}
          />
        </label>

        <div className="flex flex-wrap items-end gap-3 border-t-2 border-[var(--ink)]/10 pt-4">
          <label className="min-w-[200px] flex-1 space-y-1 text-xs font-extrabold uppercase">
            Test email first
            <input
              type="email"
              className={field}
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="you@email.com"
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={(e) => onSend(e, true)}
            className="rounded-md border-2 border-[var(--ink)] bg-[var(--silver)] px-5 py-2.5 text-xs font-extrabold uppercase shadow-[3px_3px_0_0_var(--ink)]"
          >
            {busy ? "Sending…" : "Send test"}
          </button>
          <button
            type="submit"
            disabled={busy || !stats?.resendReady}
            className="btn-accent px-6 py-2.5 text-sm"
          >
            {busy ? "Sending…" : "Send to audience"}
          </button>
        </div>

        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        {status && (
          <p className="text-sm font-semibold text-[var(--olive)]">{status}</p>
        )}
      </form>

      {stats?.subscribers?.length ? (
        <div className="rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[3px_3px_0_0_var(--ink)]">
          <h3 className="text-xs font-extrabold tracking-wider uppercase">
            Recent newsletter signups
          </h3>
          <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-sm">
            {stats.subscribers.map((s) => (
              <li key={s._id} className="flex justify-between gap-2">
                <span>{s.email}</span>
                <span className="text-[10px] font-bold tracking-wider text-[var(--moss)] uppercase">
                  {s.source}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
