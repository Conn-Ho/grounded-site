import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

export default function Loop({ dict }: { dict: Dict["loop"] }) {
  return (
    <section id="loop" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title}
          desc={dict.desc}
        />

        <div className="grid gap-5 md:grid-cols-3">
          {dict.items.map((l) => (
            <article
              key={l.n}
              className="group relative overflow-hidden border border-[color:var(--card-border)] bg-[color:var(--card-bg)] p-8 transition-colors hover:border-[color:var(--card-border-hover)]"
            >
              <div className="absolute right-6 top-6 mono text-[11px] tracking-widest text-[color:var(--accent)]">
                {l.n}
              </div>
              <div className="mb-6 h-10 w-10 hex-chip bg-[color:var(--accent-soft)]" />
              <h3 className="display-font mb-3 text-[20px] tracking-wide">
                {l.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-[color:var(--foreground-dim)]">
                {l.body}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {l.tags.map((t) => (
                  <span
                    key={t}
                    className="mono border border-[color:var(--card-border)] px-2 py-1 text-[10px] uppercase tracking-wider text-[color:var(--muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
