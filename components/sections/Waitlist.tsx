import type { Dict, Locale } from "@/lib/i18n";

export default function Waitlist({
  dict,
}: {
  dict: Dict["waitlist"];
  locale: Locale;
}) {
  return (
    <section id="waitlist" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto max-w-[900px] px-6 md:px-10 lg:px-16 text-center">
        <div className="mono mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          {dict.eyebrow}
        </div>
        <h2 className="display-font text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.02]">
          {dict.titleLine1}
          <br />
          <span className="text-[color:var(--accent)]">{dict.titleLine2}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-[1.75] text-[color:var(--foreground-dim)]">
          {dict.desc.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>

        <div className="mt-10">
          <a
            href="https://tally.so"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-[color:var(--accent)] px-7 mono text-[13px] uppercase tracking-wider text-white font-semibold transition-all hover:-translate-y-0.5 hover:opacity-90 whitespace-nowrap"
          >
            {dict.submit}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <p className="mono mt-5 text-[11px] uppercase tracking-wider text-[color:var(--muted)]">
          {dict.privacy}
        </p>
      </div>
    </section>
  );
}
