"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n";

const ITEM_IMAGES: (string | null)[] = [
  "/pkg-01.jpg",
  "/pkg-02.jpg",
  "/pkg-03.jpg",
];

export default function Packages({ dict }: { dict: Dict["packages"] }) {
  const items = dict.items;
  const [active, setActive] = useState(0);

  return (
    <section
      id="packages"
      className="snap-section relative flex flex-col justify-center py-28 md:py-36"
    >
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 xl:gap-24 min-[1920px]:gap-32">

          {/* ── Left: stacked card frames ── */}
          <div style={{ position: "relative", paddingBottom: "calc(56.25% + 140px)" }}>
            {items.map((_, idx) => {
              // distance from active, wrapping
              const dist = (idx - active + items.length) % items.length;
              // 0 = front/active, 1 = middle, 2 = back
              const yOffset = dist * 44;
              const scale = 1 - dist * 0.05;
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.6 : 0.35;
              const zIndex = items.length - dist;
              const isActive = dist === 0;

              return (
                <div
                  key={idx}
                  onClick={() => setActive(idx)}
                  style={{
                    position: "absolute",
                    top: `${yOffset}px`,
                    left: 0,
                    right: 0,
                    height: "calc(100% - 100px)",
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                    zIndex,
                    opacity,
                    transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: isActive ? "default" : "pointer",
                    borderRadius: "12px",
                    border: isActive
                      ? "1px solid rgba(246,83,16,0.55)"
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isActive
                      ? "0 0 0 1px rgba(246,83,16,0.15), 0 0 40px rgba(246,83,16,0.18), 0 0 80px rgba(246,83,16,0.08), 0 32px 64px rgba(0,0,0,0.6)"
                      : "0 8px 32px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                    backgroundColor: "#0a0908",
                  }}
                >
                  {/* Grid background */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "linear-gradient(rgba(246,83,16,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(246,83,16,0.07) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                      background: "linear-gradient(135deg, #0f0d0b 0%, #1a1208 50%, #0a0908 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "linear-gradient(rgba(246,83,16,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(246,83,16,0.07) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Image */}
                  {ITEM_IMAGES[idx] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ITEM_IMAGES[idx]!}
                      alt={`Step ${idx + 1} preview`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: idx === 2 ? "contain" : "cover",
                        objectPosition: "center center",
                      }}
                    />
                  )}

                  {/* Number label on left edge */}
                  <div
                    style={{
                      position: "absolute",
                      left: "16px",
                      bottom: "16px",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "clamp(1.4rem, 2vw, 2rem)",
                      color: isActive ? "var(--accent)" : "rgba(255,255,255,0.3)",
                      lineHeight: 1,
                      transition: "color 0.45s ease",
                      pointerEvents: "none",
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
              );
            })}

          </div>

          {/* ── Right: numbered list ── */}
          <div>
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
              <p className="mt-5 text-[16px] leading-relaxed text-[color:var(--foreground-dim)]">
                {dict.desc}
              </p>
            </div>

            <div className="flex flex-col">
              {items.map((item, idx) => {
                const isActive = idx === active;
                return (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className="relative w-full text-left"
                    style={{
                      borderBottom: idx < items.length - 1 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                      padding: "24px 0",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-start gap-5">
                      <span
                        className="mono shrink-0 font-bold transition-all duration-300"
                        style={{
                          fontSize: isActive ? "clamp(2.6rem, 4vw, 3.6rem)" : "clamp(1.1rem, 1.6vw, 1.4rem)",
                          color: isActive ? "var(--accent)" : "var(--foreground-dim)",
                          opacity: isActive ? 1 : 0.45,
                          lineHeight: 1,
                          paddingTop: isActive ? "2px" : "4px",
                          minWidth: "60px",
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="display-font tracking-wide transition-all duration-300"
                          style={{
                            fontSize: isActive ? "clamp(1.25rem, 1.8vw, 1.5rem)" : "clamp(0.85rem, 1.1vw, 1rem)",
                            color: isActive ? "var(--foreground)" : "var(--foreground-dim)",
                            opacity: isActive ? 1 : 0.5,
                            marginBottom: "8px",
                          }}
                        >
                          {item.name}
                        </h3>
                        <p
                          className="text-[13px] leading-relaxed transition-all duration-300"
                          style={{
                            color: "var(--foreground-dim)",
                            opacity: isActive ? 1 : 0.5,
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
