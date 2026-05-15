import type { Dict } from "@/lib/i18n";
import ParticleField from "./ParticleField";
import HeroVisual from "./HeroVisual";
import MeteorScroll from "./MeteorScroll";
import DemoVideoFrame from "./DemoVideoFrame";

export default function Hero({ dict }: { dict: Dict["hero"] }) {
  const description = dict.description(
    (w) => `__${w}__` // sentinel — rendered below
  );

  // Split description into parts with emphasized words (wrapped in __...__)
  const parts = description.split(/(__[^_]+__)/g);

  return (
    <section className="snap-section relative flex items-center overflow-hidden pt-20 pb-16">
      <ParticleField />

      <div className="relative z-10 mx-auto grid w-full max-w-[1520px] grid-cols-1 items-stretch gap-12 px-6 md:px-10 lg:px-16 lg:grid-cols-[1fr_1.1fr]">
        <div>

          {/* Eyebrow — 小标签，与标题拉开层次 */}
          <div className="mono mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            <span>{dict.eyebrow}</span>
          </div>

          {/* 主标题 — 两行，行距充足，字重800 */}
          <h1
            className="normal-case font-[800]"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "clamp(2.2rem, 3.6vw, 4.4rem)",
              lineHeight: 1.28,
              letterSpacing: "0em",
            }}
          >
            <span className="block whitespace-nowrap text-[color:var(--foreground)]">{dict.line1}</span>
            <span className="block whitespace-nowrap text-[color:var(--accent)]">{dict.accent}</span>
          </h1>

          {/* 描述段落 — 16px min（UX rule #67），行距1.7（rule #72），65字符宽度（rule #73） */}
          <p
            className="text-[color:var(--foreground-dim)]"
            style={{
              marginTop: "1.75rem",
              fontSize: "16px",
              lineHeight: 1.72,
              maxWidth: "420px",
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
            {/* 加入内测 — 橙色描边 */}
            <a
              href="#waitlist"
              className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-[color:var(--accent)] px-7 mono text-[13px] uppercase tracking-wider text-white font-semibold transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              {dict.joinWaitlist}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* 浏览项目 — 暗色描边 */}
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

        {/* 右栏：演示视频框 */}
        <div className="relative flex items-center justify-center self-stretch min-h-[440px]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--accent-soft)_0%,transparent_65%)] pointer-events-none" />
          <DemoVideoFrame
            label="See how it works"
            // videoSrc="/demo.mp4"          ← 替换为你的视频路径
            // previewSrc="/demo-poster.png"  ← 替换为预览截图路径
          />
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
