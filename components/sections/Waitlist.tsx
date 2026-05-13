"use client";

import { useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; position: number | null }
  | { kind: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Waitlist({
  dict,
  locale,
}: {
  dict: Dict["waitlist"];
  locale: Locale;
}) {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const clean = email.trim();
    if (!EMAIL_RE.test(clean)) {
      setStatus({ kind: "error", message: dict.errorInvalidEmail });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: clean,
          interest: interest.trim() || undefined,
          locale,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; position?: number | null };
      if (!res.ok || !data.ok) {
        setStatus({ kind: "error", message: dict.errorGeneric });
        return;
      }
      setStatus({ kind: "done", position: data.position ?? null });
    } catch {
      setStatus({ kind: "error", message: dict.errorGeneric });
    }
  };

  return (
    <section id="waitlist" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto max-w-[900px] px-6 md:px-10 lg:px-16 text-center">
        <div className="mono mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          {dict.eyebrow}
        </div>
        <h2 className="display-font text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.02]">
          {dict.titleLine1}
          <br />
          <span className="text-[color:var(--accent)]">{dict.titleLine2}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-[1.75] text-[color:var(--foreground-dim)]">
          {dict.desc.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>

        {status.kind === "done" ? (
          <div className="mono mx-auto mt-10 inline-flex flex-col items-center gap-3 border border-[color:var(--accent)] bg-[color:var(--accent-soft)] px-8 py-5 text-[13px] uppercase tracking-wider text-[color:var(--accent)]">
            <span className="flex items-center gap-3">
              <span>{dict.submittedA}</span>
              <span className="h-px w-8 bg-[color:var(--accent)]" />
              <span>{dict.submittedB}</span>
            </span>
            {status.position !== null ? (
              <span className="text-[11px] text-[color:var(--foreground)]">
                {dict.position.replace("{n}", String(status.position))}
              </span>
            ) : null}
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.placeholder}
                disabled={status.kind === "submitting"}
                className="mono h-12 flex-1 rounded-lg border border-[color:var(--card-border)] bg-[color:var(--card-bg)] px-5 text-[14px] text-[color:var(--foreground)] placeholder:text-[color:var(--muted)] focus:border-[rgba(246,83,16,0.6)] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status.kind === "submitting"}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-lg bg-[color:var(--accent)] px-7 mono text-[13px] uppercase tracking-wider text-white font-semibold transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60 disabled:hover:translate-y-0 whitespace-nowrap"
              >
                {status.kind === "submitting" ? dict.submitting : dict.submit}
                {status.kind !== "submitting" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            {status.kind === "error" ? (
              <div
                role="alert"
                className="mono text-left text-[12px] text-[color:var(--accent)]"
              >
                {status.message}
              </div>
            ) : null}
          </form>
        )}

        <p className="mono mt-5 text-[11px] uppercase tracking-wider text-[color:var(--muted)]">
          {dict.privacy}
        </p>
      </div>
    </section>
  );
}
