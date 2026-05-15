"use client";

import { useState, useEffect, useRef } from "react";
import type { Dict } from "@/lib/i18n";

/* ── Thin progress bar that drains over `duration` ms ── */
function ProgressBar({ duration, running }: { duration: number; running: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "2px",
        background: "rgba(246,83,16,0.7)",
        width: running ? "100%" : "0%",
        transition: running ? `width ${duration}ms linear` : "none",
      }}
    />
  );
}

export default function Packages({ dict }: { dict: Dict["packages"] }) {
  const INTERVAL = 4000;
  const items = dict.items;
  const [active, setActive] = useState(0);
  const [progKey, setProgKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    setActive(idx);
    setProgKey((k) => k + 1);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, INTERVAL);
  };

  const advance = () => {
    setActive((i) => (i + 1) % items.length);
    setProgKey((k) => k + 1);
  };

  useEffect(() => {
    timerRef.current = setInterval(advance, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <section
      id="packages"
      className="snap-section relative flex flex-col justify-center py-28 md:py-36"
    >
      <div className="container-wide">

        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 xl:gap-24 min-[1920px]:gap-32">

          {/* ── Left: macOS showcase frame ── */}
          <div
            style={{
              backgroundColor: "#0a0908",
              borderRadius: "12px",
              border: "1px solid rgba(246,83,16,0.55)",
              boxShadow:
                "0 0 0 1px rgba(246,83,16,0.15), 0 0 40px rgba(246,83,16,0.18), 0 0 80px rgba(246,83,16,0.08), 0 32px 64px rgba(0,0,0,0.6)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Content area — grid texture only, no text */}
            <div
              style={{
                position: "relative",
                aspectRatio: "16/9",
                overflow: "hidden",
                background: "linear-gradient(135deg, #0f0d0b 0%, #1a1208 50%, #0a0908 100%)",
              }}
            >
              {/* Grid texture */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(246,83,16,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(246,83,16,0.07) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Subtle center radial glow */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(246,83,16,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Bottom progress strip */}
              <ProgressBar key={progKey} duration={INTERVAL} running />
            </div>
          </div>

          {/* ── Right: numbered carousel list ── */}
          <div>
            {/* Eyebrow + title */}
            <div className="mb-12 md:mb-16">
              <div className="mono mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[color:var(--accent)]">
                <span className="h-px w-8 bg-[color:var(--accent-line)]" />
                {dict.eyebrow}
              </div>
              <h2
                className="display-font leading-[1.02] whitespace-nowrap"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}
              >
                {dict.title}
              </h2>
              <p
                className="mt-5 text-[16px] leading-relaxed text-[color:var(--foreground-dim)]"
              >
                {dict.desc}
              </p>
            </div>

            {/* Items */}
            <div className="flex flex-col">
              {items.map((item, idx) => {
                const isActive = idx === active;
                return (
                    <button
                    onClick={() => goTo(idx)}
                    className="group relative w-full text-left"
                    style={{
                      borderTop:
                        idx === 0 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      padding: "24px 0",
                      minHeight: "72px",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    {/* Active indicator line */}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          left: "-16px",
                          top: 0,
                          bottom: 0,
                          width: "2px",
                          background: "var(--accent)",
                          borderRadius: "2px",
                        }}
                      />
                    )}

                    <div className="flex items-start gap-5">
                      {/* Number */}
                      <span
                        className="mono shrink-0 font-bold transition-all duration-300"
                        style={{
                          fontSize: isActive ? "clamp(2rem, 3vw, 2.6rem)" : "1.1rem",
                          color: isActive ? "var(--accent)" : "var(--muted)",
                          opacity: isActive ? 1 : 0.35,
                          lineHeight: 1,
                          paddingTop: isActive ? "2px" : "4px",
                          minWidth: "42px",
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      <div className="flex-1 min-w-0">
                        {/* Name */}
                        <h3
                          className="display-font tracking-wide transition-all duration-300"
                          style={{
                            fontSize: isActive ? "clamp(1rem, 1.5vw, 1.2rem)" : "0.95rem",
                            color: isActive ? "var(--foreground)" : "var(--foreground-dim)",
                            opacity: isActive ? 1 : 0.45,
                            marginBottom: isActive ? "8px" : 0,
                          }}
                        >
                          {item.name}
                        </h3>

                        {/* Type tag — hidden when empty */}
                        {item.type && (
                          <div
                            className="mono transition-all duration-300"
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: isActive ? "var(--accent)" : "var(--muted)",
                              opacity: isActive ? 0.8 : 0.3,
                              marginBottom: isActive ? "8px" : 0,
                            }}
                          >
                            {item.type}
                          </div>
                        )}

                        {/* Description — only active, no collapse */}
                        {isActive && (
                          <p className="text-[13px] leading-relaxed text-[color:var(--foreground-dim)]">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pkg-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
