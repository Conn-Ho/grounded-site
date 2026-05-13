import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

/* SVG icons — one per loop card */
const icons = [
  /* 设计闭环 — circuit refresh */
  <svg key="design" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>,
  /* 采购闭环 — package / box */
  <svg key="parts" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>,
  /* 实物闭环 — camera / vision */
  <svg key="vision" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" />
    <circle cx="12" cy="13" r="3" />
  </svg>,
];

export default function Loop({ dict }: { dict: Dict["loop"] }) {
  return (
    <section id="loop" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">

        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title}
          desc={dict.desc}
          centered
        />

        <div className="grid gap-5 md:grid-cols-3">
          {dict.items.map((l, idx) => (
            <article
              key={l.n}
              className="group flex flex-col overflow-hidden"
              style={{ background: "#1e1a16" }}
            >

              <div className="flex flex-1 flex-col p-8">
                {/* 标题 + 编号 */}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="display-font text-[20px] tracking-wide leading-tight">
                    {l.title}
                  </h3>
                  <span className="mono shrink-0 text-[11px] tracking-widest text-[color:var(--accent)] opacity-60">
                    {l.n}
                  </span>
                </div>

                {/* 描述 */}
                <p className="flex-1 text-[14px] leading-[1.75] text-[color:var(--foreground-dim)]">
                  {l.body}
                </p>

                {/* 底部：图标 + 标签 */}
                <div className="mt-8 flex items-end justify-between gap-4">
                  {/* 图标 */}
                  <span className="text-[color:var(--accent)] opacity-70">
                    {icons[idx % icons.length]}
                  </span>

                  {/* 标签 */}
                  <div className="flex flex-wrap justify-end gap-2">
                    {l.tags.map((t) => (
                      <span
                        key={t}
                        className="mono border border-[color:var(--card-border)] px-2 py-1 text-[10px] uppercase tracking-wider text-[color:var(--muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
