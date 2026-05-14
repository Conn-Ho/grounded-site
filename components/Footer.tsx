import type { Dict } from "@/lib/i18n";

export default function Footer({ dict }: { dict: Dict["footer"] }) {
  return (
    <footer className="border-t border-[color:var(--card-border)]">
      <div className="mx-auto flex container-wide flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 2 L18 2 L22 12 L18 22 L6 22 L2 12 Z"
              stroke="var(--accent)"
              strokeWidth="1.5"
              fill="var(--accent-soft)"
            />
            <circle cx="12" cy="12" r="3" fill="var(--accent)" />
          </svg>
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
            {dict.tagline}
          </span>
        </div>
        <div className="mono flex flex-wrap gap-6 text-[11px] uppercase tracking-wider text-[color:var(--muted)]">
          <a href="https://github.com/Conn-Ho/grounded-site" className="hover:text-[color:var(--foreground)]">
            {dict.github}
          </a>
          <a href="https://x.com/amagine_ai" className="hover:text-[color:var(--foreground)]">
            {dict.twitter}
          </a>
          <a href="#faq" className="hover:text-[color:var(--foreground)]">
            {dict.faq}
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
