export default function SectionHeading({
  eyebrow,
  title,
  desc,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  centered?: boolean;
}) {
  return (
    <div className={`mb-16 md:mb-20 ${centered ? "mx-auto max-w-4xl text-center" : ""}`}>
      <div className={`mono mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)] ${centered ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-[color:var(--accent-line)]" />
        {eyebrow}
      </div>
      <h2 className="display-font text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.02]">
        {title.split("\n").map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </h2>
      {desc ? (
        <p className="mt-5 text-[16px] leading-relaxed text-[color:var(--foreground-dim)]">
          {desc}
        </p>
      ) : null}
    </div>
  );
}
