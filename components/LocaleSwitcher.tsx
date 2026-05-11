"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
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

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  const base =
    "mono flex h-8 w-8 items-center justify-center text-[12px] uppercase tracking-wider transition-colors";
  const active =
    "bg-[color:var(--accent)] text-[color:var(--background)]";
  const inactive =
    "text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)]";

  return (
    <div
      aria-label={dict.ariaLabel}
      className={`hex-chip flex overflow-hidden border border-[color:var(--card-border)] ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`${base} ${locale === "en" ? active : inactive}`}
        aria-pressed={locale === "en"}
      >
        {dict.en}
      </button>
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={`${base} ${locale === "zh" ? active : inactive}`}
        aria-pressed={locale === "zh"}
      >
        {dict.zh}
      </button>
    </div>
  );
}
