export default function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-14 max-w-2xl">
      <div className="mono mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
        <span className="h-px w-8 bg-[color:var(--accent-line)]" />
        {eyebrow}
      </div>
      <h2 className="display-font text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.02]">
        {title}
      </h2>
      {desc ? (
        <p className="mt-5 text-[16px] leading-relaxed text-[color:var(--foreground-dim)]">
          {desc}
        </p>
      ) : null}
    </div>
  );
}
