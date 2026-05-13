"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Nav({
  locale,
  dict,
  switcherDict,
}: {
  locale: Locale;
  dict: Dict["nav"];
  switcherDict: Dict["localeSwitch"];
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#loop", label: dict.loop },
    { href: "#hunt", label: dict.hunt },
    { href: "#gallery", label: dict.projects },
    { href: "#packages", label: dict.packages },
    { href: "#faq", label: dict.faq },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[color:var(--card-border)] bg-[#0a0908]/85 backdrop-blur-xl shadow-[0_1px_0_0_rgba(246,83,16,0.06)]"
          : "border-b border-white/[0.06] bg-[#0a0908]/60 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-16 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 z-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 2 L18 2 L22 12 L18 22 L6 22 L2 12 Z"
              stroke="var(--accent)"
              strokeWidth="1.5"
              fill="var(--accent-soft)"
            />
            <circle cx="12" cy="12" r="3" fill="var(--accent)" />
          </svg>
          <span className="display-font text-[15px] tracking-[0.18em] text-[color:var(--foreground)]">
            AMAGINE
          </span>
        </Link>

        {/* Center nav — absolutely centered so it's always pixel-perfect */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-1.5 text-[13px] text-[color:var(--foreground-dim)] transition-colors hover:text-[color:var(--accent)]"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <LocaleSwitcher locale={locale} dict={switcherDict} />
          <a
            href="#waitlist"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[color:var(--accent)] px-5 mono text-[12px] uppercase tracking-wider text-[color:var(--accent)] font-semibold transition-all hover:bg-[color:var(--accent-soft)] hover:-translate-y-px"
          >
            {dict.joinWaitlist}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="https://x.com/amagine_ai"
            target="_blank"
            rel="noreferrer"
            aria-label="X / Twitter"
            className="text-[color:var(--foreground-dim)] transition-colors hover:text-[color:var(--foreground)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2h3.308L14.32 10.26 22.8 22h-6.827l-5.35-6.97L4.49 22H1.18l7.73-8.83L1 2h6.94l4.83 6.39L18.244 2Zm-2.39 18h1.83L7.24 4H5.28l10.575 16Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
