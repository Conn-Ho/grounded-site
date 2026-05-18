import type { Dict, Locale } from "@/lib/i18n";

export default function Waitlist({
  dict,
}: {
  dict: Dict["waitlist"];
  locale: Locale;
}) {
  return (
    <section id="waitlist" className="snap-section relative flex flex-col justify-center py-28 md:py-36">
      <div className="container-wide text-center">
        <div className="mono mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          {dict.eyebrow}
        </div>
        <h2 className="display-font text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.02]">
          {dict.titleLine1}
          <br />
          <span className="text-[color:var(--accent)]">{dict.titleLine2}</span>
        </h2>
        <p className="mx-auto mt-6 text-[16px] leading-[1.75] text-[color:var(--foreground-dim)]" style={{ maxWidth: "680px" }}>
          {dict.desc.split("\n").map((line, i, arr) => (
            <span key={i} className="whitespace-nowrap">
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>

        <div className="mt-10 mx-auto" style={{ maxWidth: "680px" }}>
          <a
            href="https://tally.so"
            target="_blank"
            rel="noreferrer"
            className="group flex w-full h-14 items-center justify-center gap-3 rounded-xl bg-[color:var(--accent)] mono text-[13px] uppercase tracking-[0.15em] text-white font-semibold shadow-[0_0_32px_rgba(246,83,16,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(246,83,16,0.5)] hover:opacity-95 whitespace-nowrap"
          >
            {dict.submit}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
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
