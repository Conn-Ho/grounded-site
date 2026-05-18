import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

function parseLine(text: string) {
  if (text.startsWith("⟲") || text.startsWith("✓")) {
    return { prefix: null, content: text, isAgent: false, isSummary: true };
  }
  const colonIdx = text.search(/[：:]/);
  if (colonIdx !== -1) {
    const prefix = text.slice(0, colonIdx + 1);
    const content = text.slice(colonIdx + 1).trimStart();
    return { prefix, content, isAgent: prefix.startsWith("Agent"), isSummary: false };
  }
  return { prefix: null, content: text, isAgent: false, isSummary: false };
}

function Card({
  text,
  side,
  isLast,
}: {
  text: string;
  side: "today" | "closed";
  isLast: boolean;
}) {
  const { prefix, content, isAgent, isSummary } = parseLine(text);
  const isAccent = side === "closed";
  const isHighlight = isLast && isAccent;

  const borderColor = isHighlight
    ? "rgba(246,83,16,0.55)"
    : isAccent
    ? "rgba(246,83,16,0.12)"
    : "rgba(255,255,255,0.07)";

  const bgColor = isHighlight
    ? "rgba(246,83,16,0.07)"
    : isAccent
    ? "rgba(246,83,16,0.03)"
    : "rgba(255,255,255,0.02)";

  return (
    <div
      style={{
        borderRadius: "8px",
        border: `1px solid ${borderColor}`,
        background: bgColor,
        padding: "12px 16px",
        lineHeight: 1.6,
      }}
    >
      {isSummary ? (
        <span
          className="mono text-[14px] font-semibold"
          style={{
            color: isHighlight ? "var(--accent)" : "var(--foreground-dim)",
          }}
        >
          {content}
        </span>
      ) : prefix ? (
        <span className="mono flex items-baseline gap-2 text-[15px]">
          <span
            className="shrink-0"
            style={{
              minWidth: "3.8em",
              color: isAgent && isAccent ? "var(--accent)" : "var(--foreground-dim)",
            }}
          >
            {prefix}
          </span>
          <span
            style={{
              color:
                isAgent && isAccent
                  ? "var(--foreground)"
                  : "var(--foreground-dim)",
            }}
          >
            {content}
          </span>
        </span>
      ) : (
        <span className="mono flex items-baseline gap-2 text-[15px]">
          <span className="shrink-0" style={{ minWidth: "3.8em" }} />
          <span style={{ color: isAccent ? "var(--foreground)" : "var(--foreground-dim)" }}>
            {content}
          </span>
        </span>
      )}
    </div>
  );
}

export default function Problem({ dict }: { dict: Dict["problem"] }) {
  return (
    <section
      id="problem"
      className="snap-section relative flex flex-col justify-center py-28 md:py-36"
    >
      <div className="container-wide">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title}
          desc={dict.desc}
          centered
        />

        <div className="mt-16 min-[1920px]:mt-24 grid gap-px overflow-hidden rounded-sm border border-[color:var(--card-border)] bg-[color:var(--card-border)] md:grid-cols-2">

          {/* ── 左列：现在 ── */}
          <div
            className="px-8 py-14 md:px-16 md:py-20 min-[1920px]:px-24 min-[1920px]:py-28"
            style={{ background: "#100e0c" }}
          >
            <div className="mono mb-2 flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--muted)]" />
              <span className="text-[16px] min-[1920px]:text-[20px] font-bold uppercase tracking-[0.1em] text-[color:var(--foreground-dim)]">
                {dict.today.label}
              </span>
            </div>
            <div className="mb-8 mt-5 h-px bg-[color:var(--card-border)]" />
            <ul className="space-y-3">
              {dict.today.lines.map((l, i) => (
                <li key={i}>
                  <Card
                    text={l}
                    side="today"
                    isLast={i === dict.today.lines.length - 1}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* ── 右列：接入 Amagine ── */}
          <div
            className="relative overflow-hidden px-8 py-14 md:px-16 md:py-20 min-[1920px]:px-24 min-[1920px]:py-28"
            style={{ background: "#100e0c" }}
          >
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[color:var(--accent)] opacity-[0.07] blur-3xl" />
            <div className="absolute left-0 top-12 bottom-12 w-[2px] bg-gradient-to-b from-transparent via-[color:var(--accent)] to-transparent opacity-60" />

            <div className="mono mb-2 flex items-center gap-3 text-[color:var(--accent)]">
              <span className="pulse-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span className="text-[16px] min-[1920px]:text-[20px] font-bold uppercase tracking-[0.1em]">
                {dict.closed.label}
              </span>
            </div>
            <div className="mb-8 mt-5 h-px bg-[color:var(--accent-line)]" />
            <ul className="space-y-3">
              {dict.closed.lines.map((l, i) => (
                <li key={i}>
                  <Card
                    text={l}
                    side="closed"
                    isLast={i === dict.closed.lines.length - 1}
                  />
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
