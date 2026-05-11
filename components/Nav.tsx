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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[color:var(--background)]/80 backdrop-blur-md border-b border-[color:var(--card-border)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 2 L18 2 L22 12 L18 22 L6 22 L2 12 Z"
              stroke="var(--accent)"
              strokeWidth="1.5"
              fill="var(--accent-soft)"
            />
            <circle cx="12" cy="12" r="3" fill="var(--accent)" />
          </svg>
          <span className="display-font text-[15px] tracking-[0.18em]">
            AMAGINE
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <span className="mr-3 h-px w-8 bg-[color:var(--accent-line)]" aria-hidden />
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono px-3 py-1 text-[13px] uppercase tracking-wider text-[color:var(--foreground-dim)] transition-colors hover:text-[color:var(--accent)]"
            >
              {l.label}
            </a>
          ))}
          <span className="ml-3 h-px w-8 bg-[color:var(--accent-line)]" aria-hidden />
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} dict={switcherDict} />
          <a
            href="#waitlist"
            className="hex-btn inline-flex h-10 items-center bg-[color:var(--accent-soft)] px-5 mono text-[12px] uppercase tracking-wider text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
            style={{ border: "1px solid var(--accent)" }}
          >
            {dict.joinWaitlist}
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
