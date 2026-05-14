import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

/**
 * 每一行解析出 prefix（人类：/ Agent：）和 content，
 * 用 flex 布局让两列内容起始位置对齐，视觉更整洁。
 */
function Line({ text, tone }: { text: string; tone: "dim" | "accent" }) {
  // ⟲ 迭代小结
  if (text.startsWith("⟲")) {
    return (
      <span className="mono text-[14px] text-[color:var(--foreground-dim)]">
        {text}
      </span>
    );
  }

  // ✓ 完成小结
  if (text.startsWith("✓")) {
    return (
      <span className="mono text-[14px] font-semibold text-[color:var(--accent)]">
        {text}
      </span>
    );
  }

  // 解析 "前缀：内容" — 支持中文全角冒号和英文冒号
  const colonIdx = text.search(/[：:]/);
  if (colonIdx !== -1) {
    const prefix  = text.slice(0, colonIdx + 1);          // e.g. "Agent：" "人类："
    const content = text.slice(colonIdx + 1).trimStart();
    const isAgent = prefix.startsWith("Agent");

    return (
      <span className="mono flex items-baseline gap-2 text-[15px]">
        {/* 前缀 — 固定宽度让内容列垂直对齐 */}
        <span
          className={`shrink-0 ${isAgent ? "text-[color:var(--accent)]" : "text-[color:var(--foreground-dim)]"}`}
          style={{ minWidth: "3.8em" }}
        >
          {prefix}
        </span>
        {/* 内容 */}
        <span
          className={
            isAgent && tone === "accent"
              ? "text-[color:var(--foreground)]"
              : "text-[color:var(--foreground-dim)]"
          }
        >
          {content}
        </span>
      </span>
    );
  }

  return (
    <span className="mono text-[15px] text-[color:var(--foreground-dim)]">
      {text}
    </span>
  );
}

export default function Problem({ dict }: { dict: Dict["problem"] }) {
  return (
    <section
      id="problem"
      className="snap-section relative flex flex-col justify-center py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <SectionHeading
          eyebrow={dict.eyebrow}
          title={dict.title}
          desc={dict.desc}
          centered
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-[color:var(--card-border)] bg-[color:var(--card-border)] md:grid-cols-2">

          {/* ── 左列：现在 ── */}
          <div className="px-10 py-12 md:px-14 md:py-14" style={{ background: "#100e0c" }}>

            {/* 列头 */}
            <div className="mono mb-2 flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--muted)]" />
              <span className="text-[16px] font-bold uppercase tracking-[0.1em] text-[color:var(--foreground-dim)]">
                {dict.today.label}
              </span>
            </div>

            {/* 列头分隔线 */}
            <div className="mb-8 mt-5 h-px bg-[color:var(--card-border)]" />

            <ul className="space-y-[18px]">
              {dict.today.lines.map((l, i) => (
                <li key={i} style={{ lineHeight: 1.6 }}>
                  <Line text={l} tone="dim" />
                </li>
              ))}
            </ul>
          </div>

          {/* ── 右列：接入 Amagine ── */}
          <div
            className="relative overflow-hidden px-10 py-12 md:px-14 md:py-14"
            style={{ background: "#100e0c" }}
          >
            {/* 顶部橙色光晕 */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[color:var(--accent)] opacity-[0.07] blur-3xl" />
            {/* 左侧橙色竖线 */}
            <div className="absolute left-0 top-12 bottom-12 w-[2px] bg-gradient-to-b from-transparent via-[color:var(--accent)] to-transparent opacity-60" />

            {/* 列头 */}
            <div className="mono mb-2 flex items-center gap-3 text-[color:var(--accent)]">
              <span className="pulse-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <span className="text-[16px] font-bold uppercase tracking-[0.1em]">
                {dict.closed.label}
              </span>
            </div>

            {/* 列头分隔线 */}
            <div className="mb-8 mt-5 h-px bg-[color:var(--accent-line)]" />

            <ul className="space-y-[18px]">
              {dict.closed.lines.map((l, i) => (
                <li key={i} style={{ lineHeight: 1.6 }}>
                  <Line text={l} tone="accent" />
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
