import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

export default function FAQ({ dict }: { dict: Dict["faq"] }) {
  return (
    <section id="faq" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16">
        <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />

        <div className="divide-y divide-[color:var(--card-border)] border-y border-[color:var(--card-border)]">
          {dict.items.map((it, i) => (
            <details key={i} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-8">
                <span className="display-font text-[17px] leading-tight">
                  {it.q}
                </span>
                <span className="hex-chip bg-[color:var(--accent-soft)] px-3 py-2 text-[color:var(--accent)] transition-transform group-open:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-[color:var(--foreground-dim)]">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
