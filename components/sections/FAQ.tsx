import type { Dict } from "@/lib/i18n";
import SectionHeading from "../SectionHeading";

export default function FAQ({ dict }: { dict: Dict["faq"] }) {
  return (
    <section id="faq" className="snap-section relative flex flex-col justify-center py-24 md:py-28">
      <div className="container-wide">
        <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />

        <div className="divide-y divide-[color:var(--card-border)] border-y border-[color:var(--card-border)]">
          {dict.items.map((it, i) => (
            <details key={i} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-6 px-4 -mx-4 transition-colors hover:bg-[color:var(--card-bg)]">
                {/* 问题文字：未展开 dim → hover 亮白 → 展开 亮白 */}
                <span className="display-font text-[17px] leading-tight text-[color:var(--foreground-dim)] transition-colors group-hover:text-[color:var(--foreground)] group-open:text-[color:var(--foreground)]">
                  {it.q}
                </span>

                {/* 按钮：默认暗描边 → hover 橙色描边+文字 → 选中 橙色实底+白色×  */}
                <span className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center transition-all duration-200",
                  "border border-[color:var(--card-border)] bg-transparent text-[color:var(--foreground-dim)]",
                  "group-hover:border-[color:var(--accent)] group-hover:text-[color:var(--accent)]",
                  "group-open:border-[color:var(--accent)] group-open:bg-[color:var(--accent)] group-open:text-white group-open:rotate-45",
                ].join(" ")}>
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="px-4 -mx-4 pb-6 mt-2 max-w-3xl text-[14px] leading-relaxed text-[color:var(--foreground-dim)]">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
