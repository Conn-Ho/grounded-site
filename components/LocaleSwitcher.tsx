"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import type { Dict, Locale } from "@/lib/i18n";

export default function LocaleSwitcher({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict["localeSwitch"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const setLocale = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  const options: { locale: Locale; label: string }[] = [
    { locale: "en", label: dict.en },
    { locale: "zh", label: dict.zh },
  ];

  const currentLabel = locale === "en" ? dict.en : dict.zh;

  return (
    <div ref={ref} className="relative" aria-label={dict.ariaLabel}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`mono flex items-center gap-1.5 h-9 px-3 text-[12px] uppercase tracking-wider border border-[color:var(--card-border)] text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)] hover:border-[color:var(--card-border-hover)] transition-colors ${
          isPending ? "opacity-60" : ""
        }`}
      >
        {currentLabel}
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          aria-hidden
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 2.5L4 5.5L7 2.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-full border border-[color:var(--card-border)] bg-[color:var(--background-elevated)] z-50 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.locale}
              type="button"
              onClick={() => setLocale(opt.locale)}
              className={`mono w-full px-3 py-2 text-[12px] uppercase tracking-wider text-left transition-colors ${
                locale === opt.locale
                  ? "text-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                  : "text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--background-elevated)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
