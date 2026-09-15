"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, Suspense } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { FadeIn } from "@/components/motion/Reveal";

type Step = "phone" | "otp" | "profile";

const field =
  "w-full rounded-md border-2 border-[var(--ink)] bg-white px-4 py-3.5 text-base shadow-[3px_3px_0_0_var(--ink)] outline-none focus:ring-2 focus:ring-[var(--sand)]";

function googleErrorMessage(code: string | null): string {
  if (!code) return "";
  if (code === "google_not_configured") {
    return "Google login isn’t set up yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local.";
  }
  if (code === "invalid_state") return "Google login expired. Try again.";
  if (code === "access_denied") return "Google sign-in was cancelled.";
  return decodeURIComponent(code);
}

function LoginFormInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { refresh, user } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [normalized, setNormalized] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(() =>
    googleErrorMessage(search.get("error")),
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (search.get("setup") === "1" && user && user.profileComplete === false) {
      setStep("profile");
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [search, user]);

  async function sendOtp(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setNormalized(data.phone);
      setMessage(data.message);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized || phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      await refresh();
      if (data.needsProfile) {
        setStep("profile");
        setName(data.user?.name || "");
        setEmail(data.user?.email || "");
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  async function completeProfile(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save profile");
      await refresh();
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setBusy(false);
    }
  }

  const titles: Record<Step, { h: string; p: string }> = {
    phone: {
      h: "Login with phone",
      p: "We’ll text you a one-time code to verify your number.",
    },
    otp: {
      h: "Enter OTP",
      p: "Type the code we sent to your phone.",
    },
    profile: {
      h: "Finish your account",
      p: "Add an email and password so you can sign in and get order updates.",
    },
  };

  return (
    <FadeIn className="mx-auto w-full max-w-md px-0 py-0 sm:px-4 sm:py-16">
      <div className="min-h-[calc(100dvh-8rem)] border-0 bg-[var(--background)] p-5 sm:min-h-0 sm:rounded-md sm:border-2 sm:border-[var(--ink)] sm:bg-[var(--sand)]/40 sm:p-8 sm:shadow-[6px_6px_0_0_var(--ink)]">
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--moss)] uppercase">
          Member access
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
          {titles[step].h}
        </h1>
        <p className="mt-2 text-sm text-[var(--moss)]">{titles[step].p}</p>

        {step === "phone" && (
          <>
            <form onSubmit={sendOtp} className="mt-6 space-y-4">
              <label className="block space-y-1.5 text-xs font-extrabold tracking-wider uppercase">
                Phone number
                <input
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="98765 43210 or +91…"
                  className={field}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              {error && (
                <p className="text-sm font-semibold text-red-700">{error}</p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="btn-accent w-full py-3.5 text-sm"
              >
                {busy ? "Sending…" : "Send OTP"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-[var(--moss)] uppercase">
              <span className="h-px flex-1 bg-[var(--ink)]/20" />
              or
              <span className="h-px flex-1 bg-[var(--ink)]/20" />
            </div>

            <a
              href="/api/auth/google"
              className="flex w-full items-center justify-center gap-3 rounded-md border-2 border-[var(--ink)] bg-white px-4 py-3.5 text-sm font-extrabold tracking-wider uppercase shadow-[3px_3px_0_0_var(--ink)] transition hover:bg-[var(--accent-soft)]"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.5-6.6 6.9l.1.1 6.3 5.3C36.9 41.1 44 36 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Continue with Google
            </a>
          </>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp} className="mt-6 space-y-4">
            <p className="text-sm text-[var(--moss)]">
              Code sent to{" "}
              <span className="font-bold text-[var(--ink)]">{normalized}</span>
            </p>
            {message && (
              <p className="rounded-md border border-[var(--ink)]/20 bg-white/70 px-3 py-2 text-xs text-[var(--moss)]">
                {message}
              </p>
            )}
            <label className="block space-y-1.5 text-xs font-extrabold tracking-wider uppercase">
              OTP
              <input
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                className={field}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
            {error && (
              <p className="text-sm font-semibold text-red-700">{error}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn-accent w-full py-3.5 text-sm"
            >
              {busy ? "Verifying…" : "Verify & continue"}
            </button>
            <button
              type="button"
              className="w-full text-xs font-bold tracking-wider text-[var(--moss)] uppercase underline"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError("");
              }}
            >
              Change number
            </button>
          </form>
        )}

        {step === "profile" && (
          <form onSubmit={completeProfile} className="mt-6 space-y-4">
            {normalized && (
              <p className="rounded-md border border-[var(--ink)]/20 bg-white/70 px-3 py-2 text-xs text-[var(--moss)]">
                Phone verified:{" "}
                <span className="font-bold text-[var(--ink)]">{normalized}</span>
              </p>
            )}
            <label className="block space-y-1.5 text-xs font-extrabold tracking-wider uppercase">
              Name
              <input
                autoComplete="name"
                placeholder="Your name"
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-xs font-extrabold tracking-wider uppercase">
              Email
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-xs font-extrabold tracking-wider uppercase">
              Set password
              <input
                required
                type="password"
                autoComplete="new-password"
                placeholder="Min 6 characters"
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-xs font-extrabold tracking-wider uppercase">
              Confirm password
              <input
                required
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                className={field}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            {error && (
              <p className="text-sm font-semibold text-red-700">{error}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn-accent w-full py-3.5 text-sm"
            >
              {busy ? "Saving…" : "Save & enter Genradius"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-[var(--moss)]">
          <Link href="/shop" className="underline">
            Continue shopping
          </Link>
        </p>
      </div>
    </FadeIn>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 text-center text-sm text-[var(--moss)]">
          Loading…
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
