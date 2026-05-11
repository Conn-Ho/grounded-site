import type { Dict } from "@/lib/i18n";
import ParticleField from "./ParticleField";
import HeroVisual from "./HeroVisual";
import CircuitTraces from "./CircuitTraces";
import MeteorScroll from "./MeteorScroll";

export default function Hero({ dict }: { dict: Dict["hero"] }) {
  const description = dict.description(
    (w) => `__${w}__` // sentinel — rendered below
  );

  // Split description into parts with emphasized words (wrapped in __...__)
  const parts = description.split(/(__[^_]+__)/g);

  return (
    <section className="snap-section relative flex items-center overflow-hidden pt-24">
      <ParticleField />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 md:px-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mono mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent)]">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            <span>{dict.eyebrow}</span>
            <span className="h-px flex-1 bg-[color:var(--accent-line)]" />
          </div>

          <h1 className="display-font text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.95]">
            {dict.line1}
            <br />
            {dict.between}{" "}
            <span className="strike-diagonal">{dict.strike}</span>{" "}
            <span className="mx-2 inline-flex items-center align-middle text-[color:var(--accent)]">
              <svg
                width="32"
                height="16"
                viewBox="0 0 32 16"
                fill="none"
                aria-hidden
                className="mx-1 inline-block"
              >
                <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
                <path d="M8 8 L22 8" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" />
                <circle cx="26" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>
            <span className="text-[color:var(--accent)]">{dict.accent}</span>
            <br />
            {dict.line3}
          </h1>

          <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-[color:var(--foreground-dim)]">
            {parts.map((p, i) => {
              const m = p.match(/^__([^_]+)__$/);
              if (m) {
                return (
                  <em
                    key={i}
                    className="not-italic text-[color:var(--foreground)]"
                  >
                    {m[1]}
                  </em>
                );
              }
              return <span key={i}>{p}</span>;
            })}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#waitlist"
              className="hex-btn inline-flex h-12 items-center bg-[color:var(--accent)] px-7 mono text-[13px] uppercase tracking-wider text-[color:var(--background)] transition-transform hover:-translate-y-0.5"
            >
              {dict.joinWaitlist}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-2">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#gallery"
              className="inline-flex h-12 items-center gap-2 px-2 mono text-[13px] uppercase tracking-wider text-[color:var(--foreground-dim)] transition-colors hover:text-[color:var(--foreground)]"
            >
              <span className="h-px w-6 bg-[color:var(--foreground-dim)]" />
              {dict.browseProjects}
            </a>
          </div>

          <div className="mono mt-12 grid max-w-md grid-cols-3 gap-6 text-[11px] uppercase tracking-wider text-[color:var(--muted)]">
            <div>
              <div className="text-[color:var(--foreground)] text-xl">
                {dict.stats.packagesValue}
              </div>
              {dict.stats.packagesLabel}
            </div>
            <div>
              <div className="text-[color:var(--foreground)] text-xl">
                {dict.stats.buildsValue}
              </div>
              {dict.stats.buildsLabel}
            </div>
            <div>
              <div className="text-[color:var(--foreground)] text-xl">
                {dict.stats.savedValue}
              </div>
              {dict.stats.savedLabel}
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--accent-soft)_0%,transparent_60%)]" />
          <div className="relative aspect-square w-full max-w-[520px]">
            <HeroVisual />
            <CircuitTraces />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="mono flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
          <span>{dict.scroll}</span>
          <MeteorScroll />
        </div>
      </div>
    </section>
  );
}
