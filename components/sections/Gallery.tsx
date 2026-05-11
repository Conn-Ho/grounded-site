import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

const covers = [
  "from-[#3a2818] to-[#1a1208]",
  "from-[#2a2418] to-[#120e08]",
  "from-[#2a1c10] to-[#150c06]",
];

export default function Gallery({ dict }: { dict: Dict["gallery"] }) {
  return (
    <section id="gallery" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-14">
          <SectionHeading
            eyebrow={dict.eyebrow}
            title={dict.title}
            desc={dict.desc}
          />
          <a
            href="/gallery"
            className="mono hidden shrink-0 text-[12px] uppercase tracking-wider text-[color:var(--accent)] hover:underline md:inline-flex"
          >
            {dict.browseAll}
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {dict.projects.map((p, idx) => (
            <article
              key={p.slug}
              className="group relative overflow-hidden border border-[color:var(--card-border)] bg-[color:var(--card-bg)] transition-colors hover:border-[color:var(--accent-line)]"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${
                  covers[idx % covers.length]
                }`}
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
                <div className="absolute bottom-3 left-4 mono text-[10px] uppercase tracking-wider text-[color:var(--foreground-dim)]">
                  {p.category}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="display-font text-[18px] tracking-wide">
                    {p.title}
                  </h3>
                  <span className="mono hex-chip bg-[color:var(--accent-soft)] px-3 py-1 text-[10px] uppercase tracking-wider text-[color:var(--accent)]">
                    {p.difficulty}
                  </span>
                </div>
                <p className="mb-5 text-[13px] leading-relaxed text-[color:var(--foreground-dim)]">
                  {p.description}
                </p>
                <div className="mono mb-5 flex items-center gap-4 text-[11px] uppercase tracking-wider text-[color:var(--muted)]">
                  <span>⏱ {p.hours}</span>
                  <span>💰 {p.cost}</span>
                </div>
                <a
                  href="#waitlist"
                  className="mono inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-[color:var(--accent)] transition-colors hover:text-[color:var(--accent-hover)]"
                >
                  {dict.copyToWorkspace}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
