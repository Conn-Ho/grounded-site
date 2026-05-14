"use client";

import type { Dict } from "@/lib/i18n";
import type { HuntItem } from "@/lib/hunt";

const covers = [
  "from-[#3a2818] to-[#1a1208]",
  "from-[#2a2418] to-[#120e08]",
  "from-[#2a1c10] to-[#150c06]",
];

export default function GalleryHunt({
  galleryDict,
  huntDict,
  huntItems,
}: {
  galleryDict: Dict["gallery"];
  huntDict: Dict["hunt"];
  huntItems: HuntItem[];
}) {

  return (
    <section id="gallery" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16">

        {/* ── 头部 ── */}
        <div className="mb-10 flex items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
              <span className="h-px w-8 bg-[color:var(--accent-line)]" />
              {huntDict.eyebrow}
            </div>
            <h2 className="display-font text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05]">
              {huntDict.title}
            </h2>
            <p
              className="mt-4 font-bold text-[color:var(--foreground-dim)]"
              style={{ fontSize: "clamp(1rem,1.8vw,1.25rem)", lineHeight: 1.3 }}
            >
              {galleryDict.title}
            </p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--foreground-dim)]">
              {galleryDict.desc}
            </p>
          </div>
          <a
            href="/hunt"
            className="hidden shrink-0 items-center gap-2 text-[12px] uppercase tracking-wider text-[color:var(--accent)] hover:underline md:inline-flex"
          >
            {galleryDict.browseAll}
          </a>
        </div>

        {/* ── 统一网格区域 ── */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {/* ── 前段：Gallery 图文卡 ── */}
            {galleryDict.projects.map((p, idx) => (
              <article
                key={p.slug}
                className="group overflow-hidden border border-[color:var(--card-border)] bg-[color:var(--card-bg)] transition-colors hover:border-[color:var(--accent-line)]"
              >
                {/* 封面 — 点阵纹理 */}
                <div
                  className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${covers[idx % covers.length]}`}
                >
                  <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
                    <defs>
                      <pattern
                        id={`dots-${p.slug}`}
                        width="12"
                        height="12"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="1.5" cy="1.5" r="1" fill="var(--accent)" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#dots-${p.slug})`} />
                  </svg>
                  <div className="absolute bottom-3 left-4 text-[10px] uppercase tracking-wider text-[color:var(--foreground-dim)]">
                    {p.category}
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="display-font text-[17px] tracking-wide leading-tight">{p.title}</h3>
                    <span className="hex-chip shrink-0 bg-[color:var(--accent-soft)] px-3 py-1 text-[10px] uppercase tracking-wider text-[color:var(--accent)]">
                      {p.difficulty}
                    </span>
                  </div>
                  <p className="mb-4 text-[13px] leading-relaxed text-[color:var(--foreground-dim)]">
                    {p.description}
                  </p>
                  <div className="mb-4 flex items-center gap-4 text-[11px] uppercase tracking-wider text-[color:var(--muted)]">
                    <span>⏱ {p.hours}</span>
                    <span>💰 {p.cost}</span>
                  </div>
                  <a
                    href="#waitlist"
                    className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-[color:var(--accent)] transition-colors hover:text-[color:var(--accent-hover)]"
                  >
                    {galleryDict.copyToWorkspace}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}

            {/* ── 后段：Hunt project 卡（接续横排）── */}
            {huntItems.filter(i => i.type === "project").map((item, idx) => {
              const cover = covers[(idx + galleryDict.projects.length) % covers.length];
              return (
                <article
                  key={item.id}
                  className="group overflow-hidden border border-[color:var(--card-border)] bg-[color:var(--card-bg)] transition-colors hover:border-[color:var(--accent-line)]"
                >
                  <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${cover}`}>
                    <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
                      <defs>
                        <pattern id={`dots-hunt-${item.id}`} width="12" height="12" patternUnits="userSpaceOnUse">
                          <circle cx="1.5" cy="1.5" r="1" fill="var(--accent)" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#dots-hunt-${item.id})`} />
                    </svg>
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                        {item.source}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 text-[10px] uppercase tracking-wider text-[color:var(--foreground-dim)]">
                      {item.meta}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="display-font mb-3 text-[17px] tracking-wide leading-tight">{item.title}</h3>
                    <p className="mb-4 text-[13px] leading-relaxed text-[color:var(--foreground-dim)]">{item.summary}</p>
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

      </div>
    </section>
  );
}
