"use client";

import { useMemo, useState } from "react";
import type { Dict } from "@/lib/i18n";
import type { HuntItem } from "@/lib/hunt";
import SectionHeading from "../SectionHeading";

export default function HuntPreview({
  dict,
  items,
  variant = "preview",
}: {
  dict: Dict["hunt"];
  items: HuntItem[];
  variant?: "preview" | "page";
}) {
  const [activeTab, setActiveTab] = useState(dict.tabs[0]?.key ?? "match");
  const isPage = variant === "page";

  const visibleItems = useMemo(
    () => items.filter((item) => item.tab === activeTab),
    [activeTab, items]
  );

  return (
    <section
      id="hunt"
      className="snap-section relative flex flex-col justify-center py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {isPage ? (
          <div className="mb-12 grid gap-8 border border-[color:var(--card-border)] bg-[color:var(--card-bg)] p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <div className="mono mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
                <span className="h-px w-8 bg-[color:var(--accent-line)]" />
                {dict.pageEyebrow}
              </div>
              <h1 className="display-font max-w-[14ch] text-[clamp(2.4rem,5vw,4.8rem)] leading-[1.02]">
                {dict.pageTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[color:var(--foreground-dim)]">
                {dict.pageDesc}
              </p>
            </div>
            <div className="grid gap-4 self-end">
              <div className="mono border border-[color:var(--accent-line)] bg-[color:var(--accent-soft)] px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent)]">
                {dict.pageStatus}
              </div>
              <p className="text-[14px] leading-relaxed text-[color:var(--foreground-dim)]">
                {dict.pageNote}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow={dict.eyebrow}
              title={dict.title}
              desc={dict.desc}
            />
            <a
              href="/hunt"
              className="mono inline-flex shrink-0 items-center gap-2 text-[12px] uppercase tracking-wider text-[color:var(--accent)] hover:underline"
            >
              {dict.viewAll}
            </a>
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-3">
          {dict.tabs.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`mono px-4 py-2 text-[12px] uppercase tracking-wider transition-colors ${
                  active
                    ? "hex-chip border border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                    : "border border-[color:var(--card-border)] bg-[color:var(--card-bg)] text-[color:var(--foreground-dim)] hover:text-[color:var(--foreground)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {visibleItems.length ? (
          <div className={`grid gap-5 ${isPage ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"}`}>
            {visibleItems.map((item) => {
              const isInsight = item.type === "insight";
              return (
                <article
                  key={item.id}
                  className="group relative overflow-hidden border border-[color:var(--card-border)] bg-[color:var(--card-bg)] p-6 transition-colors hover:border-[color:var(--accent-line)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="mono flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      <span
                        className={`hex-chip px-3 py-1 ${
                          isInsight
                            ? "bg-[rgba(92,173,255,0.12)] text-[#8fc4ff]"
                            : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span>{item.source}</span>
                    </div>
                    <span className="mono text-[11px] uppercase tracking-wider text-[color:var(--foreground-dim)]">
                      {item.meta}
                    </span>
                  </div>

                  <h3 className="display-font max-w-[18ch] text-[24px] leading-[1.02]">
                    {item.title}
                  </h3>

                  <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-[color:var(--foreground-dim)]">
                    {item.summary}
                  </p>

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <span className="mono text-[11px] uppercase tracking-wider text-[color:var(--muted)]">
                      {isInsight ? dict.secondaryCta : dict.primaryCta}
                    </span>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="mono inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-[color:var(--accent)] transition-colors hover:text-[color:var(--accent-hover)]"
                    >
                      {item.cta}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-[color:var(--card-border)] bg-[color:var(--card-bg)] p-8 text-center">
            <p className="mono text-[12px] uppercase tracking-wider text-[color:var(--muted)]">
              {dict.empty}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
