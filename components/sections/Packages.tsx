import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

export default function Packages({ dict }: { dict: Dict["packages"] }) {
  return (
    <section id="packages" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title}
          desc={dict.desc}
        />

        <div className="grid gap-px overflow-hidden rounded-sm border border-[color:var(--card-border)] bg-[color:var(--card-border)] md:grid-cols-2 lg:grid-cols-3">
          {dict.items.map((p) => (
            <div
              key={p.name}
              className="group relative bg-[color:var(--card-bg)] p-8 transition-colors hover:bg-[color:var(--background-elevated)]"
            >
              <div className="mono mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                {p.type}
              </div>
              <h3 className="display-font mb-3 text-[18px] tracking-wide">
                {p.name}
              </h3>
              <p className="text-[13px] leading-relaxed text-[color:var(--foreground-dim)]">
                {p.desc}
              </p>
              <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17 17 7M9 7h8v8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
