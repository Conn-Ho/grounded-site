"use client";

import type { Dict } from "@/lib/i18n";
import type { HuntItem } from "@/lib/hunt";
import SectionHeading from "../SectionHeading";

const covers = [
  "from-[#3a2818] to-[#1a1208]",
  "from-[#2a2418] to-[#120e08]",
  "from-[#2a1c10] to-[#150c06]",
];

export default function HuntPreview({
  dict,
  items,
  variant = "preview",
}: {
  dict: Dict["hunt"];
  items: HuntItem[];
  variant?: "preview" | "page";
}) {
  const isPage = variant === "page";

  return (
    <section
      id="hunt"
      className="snap-section relative flex flex-col justify-center py-24 md:py-28"
    >
      <div className="container-wide">
        {!isPage && (
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

        {items.filter(i => i.type !== "insight").length ? (
          <div className={`grid gap-5 ${isPage ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"}`}>
            {items.filter(i => i.type !== "insight").map((item, idx) => {
              const isInsight = item.type === "insight";
              const cover = covers[idx % covers.length];
              return (
                <article
                  key={item.id}
                  className="group overflow-hidden border border-[color:var(--card-border)] bg-[color:var(--card-bg)] transition-colors hover:border-[color:var(--accent-line)]"
                >
                  {/* 封面 — 点阵纹理 */}
                  <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${cover}`}>
                    <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
                      <defs>
                        <pattern id={`dots-hp-${item.id}`} width="12" height="12" patternUnits="userSpaceOnUse">
                          <circle cx="1.5" cy="1.5" r="1" fill="var(--accent)" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#dots-hp-${item.id})`} />
                    </svg>
                    {/* 类型角标 */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-wider ${
                        isInsight
                          ? "bg-[rgba(92,173,255,0.18)] text-[#8fc4ff]"
                          : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[color:var(--foreground-dim)]">
                        {item.source}
                      </span>
                    </div>
                    {/* meta 信息 */}
                    <div className="absolute bottom-3 left-4 text-[10px] uppercase tracking-wider text-[color:var(--foreground-dim)]">
                      {item.meta}
                    </div>
                  </div>

                  {/* 文字区 */}
                  <div className="p-5">
                    <h3 className="display-font mb-3 text-[17px] tracking-wide leading-tight">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-[13px] leading-relaxed text-[color:var(--foreground-dim)]">
                      {item.summary}
                    </p>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-[color:var(--accent)] transition-colors hover:text-[color:var(--accent-hover)]"
                    >
                      {item.cta}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
