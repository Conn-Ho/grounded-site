import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

export default function Problem({ dict }: { dict: Dict["problem"] }) {
  const columns = [
    { ...dict.today, tone: "dim" as const },
    { ...dict.closed, tone: "accent" as const },
  ];

  return (
    <section id="problem" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title}
          desc={dict.desc}
        />

        <div className="grid gap-px overflow-hidden rounded-sm border border-[color:var(--card-border)] bg-[color:var(--card-border)] md:grid-cols-2">
          {columns.map((c) => (
            <div
              key={c.label}
              className="relative bg-[color:var(--card-bg)] p-8 md:p-10"
            >
              <div className="mono mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.2em]">
                <span
                  className={
                    c.tone === "accent"
                      ? "text-[color:var(--accent)]"
                      : "text-[color:var(--muted)]"
                  }
                >
                  {c.label}
                </span>
                <span
                  className={`hex-chip px-3 py-1 text-[10px] ${
                    c.tone === "accent"
                      ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                      : "bg-[color:var(--background-elevated)] text-[color:var(--muted)]"
                  }`}
                >
                  {c.chip}
                </span>
              </div>
              <ul className="mono space-y-3 text-[14px] leading-relaxed">
                {c.lines.map((l, i) => (
                  <li
                    key={i}
                    className={
                      c.tone === "accent"
                        ? "text-[color:var(--foreground)]"
                        : "text-[color:var(--foreground-dim)]"
                    }
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
