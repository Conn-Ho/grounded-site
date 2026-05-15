import type { Dict } from "@/lib/i18n";
import ParticleField from "./ParticleField";
import HeroVisual from "./HeroVisual";
import CircuitTraces from "./CircuitTraces";
import MeteorScroll from "./MeteorScroll";
import DemoVideoFrame from "./DemoVideoFrame";

export default function Hero({ dict }: { dict: Dict["hero"] }) {
  const description = dict.description(
    (w) => `__${w}__` // sentinel — rendered below
  );

  // Split description into parts with emphasized words (wrapped in __...__)
  const parts = description.split(/(__[^_]+__)/g);

  return (
    <section className="snap-section relative flex items-center overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16">
      <ParticleField />

      {/* 响应式画框 — Canvas 全幅背景 + 文字浮动左上 */}
      <div className="relative z-10 container-wide hero-frame">
        {/* Canvas 全幅背景 */}
        <div className="absolute inset-0">
          <HeroVisual />
        </div>

        {/* 文字区域浮动在左侧，垂直居中 */}
        <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-center max-w-[480px] min-[1920px]:max-w-[600px] p-6 md:p-10 lg:p-12 min-[1920px]:p-16">
          <div className="relative z-20">

            {/* Eyebrow */}
            <div className="mono mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              <span>{dict.eyebrow}</span>
            </div>

            {/* 主标题 */}
            <h1
              className="normal-case font-[800]"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "clamp(2.2rem, 3.6vw, 5.5rem)",
                lineHeight: 1.28,
                letterSpacing: "0em",
              }}
            >
              <span className="block whitespace-nowrap text-[color:var(--foreground)]">{dict.line1}</span>
              <span className="block whitespace-nowrap text-[color:var(--accent)]">{dict.accent}</span>
            </h1>

            {/* 描述段落 */}
            <p
              className="text-[color:var(--foreground-dim)]"
              style={{
                marginTop: "1.75rem",
                fontSize: "clamp(16px, 1.2vw, 22px)",
                lineHeight: 1.72,
                maxWidth: "520px",
              }}
            >
              {parts.map((p, i) => {
                const m = p.match(/^__([^_]+)__$/);
                if (m) {
                  return (
                    <em key={i} className="not-italic text-[color:var(--foreground)]">
                      {m[1]}
                    </em>
                  );
                }
                const lines = p.split("\n");
                return (
                  <span key={i}>
                    {lines.map((line, j) => (
                      <span key={j}>
                        {j > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                );
              })}
            </p>

            {/* CTA 按钮组 */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#waitlist"
                className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-[color:var(--accent)] px-7 mono text-[13px] uppercase tracking-wider text-white font-semibold transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                {dict.joinWaitlist}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#gallery"
                className="inline-flex h-12 items-center gap-2.5 rounded-lg border border-[color:var(--card-border)] px-6 mono text-[13px] uppercase tracking-wider text-[color:var(--foreground-dim)] transition-all hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)] hover:-translate-y-0.5"
              >
                {dict.browseProjects}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

          </div>
        </div>

        {/* 黄金比例分割 — 左侧 38.2% 文字区，右侧 61.8% 视觉区 */}
        <div className="absolute inset-0 grid grid-cols-[38.2fr_61.8fr] pointer-events-none">
          <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12 min-[1920px]:p-16">
            {/* 左侧留空，文字由上方 absolute 定位区承载 */}
          </div>

          {/* 右栏：大面积 DemoVideoFrame */}
          <div className="pointer-events-auto flex items-center justify-center p-4 md:p-8 lg:p-12 min-[1920px]:p-16">
            <div className="w-full h-full max-h-[90%]">
              <DemoVideoFrame
                label="See how it works"
                previewSrc="/hero-preview.png"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 滚动指示器 */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="mono flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
          <span>{dict.scroll}</span>
          <MeteorScroll />
        </div>
      </div>
    </section>
  );
}
