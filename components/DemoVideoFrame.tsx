"use client";

import { useState, useRef } from "react";

interface DemoVideoFrameProps {
  videoSrc?: string;
  previewSrc?: string;
  label?: string;
}

export default function DemoVideoFrame({
  videoSrc,
  previewSrc,
  label = "See how it works",
}: DemoVideoFrameProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (!videoSrc) return;
    setPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        borderRadius: "10px",
        /* 顶部白色细线边框，与参考图一致 */
        borderTop: "1px solid rgb(242,242,242)",
        width: "100%",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Traffic-light bar（仅三点，无 URL 栏）── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "10px 14px 9px",
          background: "rgba(0,0,0,0)",
          /* 分割线极淡 */
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "9.54px",
              height: "9.54px",
              borderRadius: "9.54px",
              backgroundColor: "rgb(227,227,227)",
              opacity: 1,
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* ── Content area ── */}
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>

        {/* Preview image or gradient placeholder */}
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="Demo preview"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: playing ? "none" : "block",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #0f0d0b 0%, #1c1510 45%, #0a0908 100%)",
              display: playing ? "none" : "block",
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
            {/* Fake UI skeleton */}
            <div style={{ position: "absolute", inset: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Top bar */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(246,83,16,0.22)", border: "1px solid rgba(246,83,16,0.3)", flexShrink: 0 }} />
                <div style={{ flex: 1, height: "10px", borderRadius: "4px", background: "rgba(255,255,255,0.07)" }} />
                <div style={{ width: "60px", height: "10px", borderRadius: "4px", background: "rgba(255,255,255,0.04)" }} />
              </div>
              {/* Main area */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "12px" }}>
                <div style={{ borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "8px", padding: "12px" }}>
                  {[0.9, 0.6, 0.8, 0.5, 0.7].map((w, i) => (
                    <div key={i} style={{ height: "7px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", width: `${w * 100}%` }} />
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", width: "85%" }} />
                  <div style={{ height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.04)", width: "60%" }} />
                  <div style={{ height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", width: "75%" }} />
                  <div style={{ marginTop: "6px", height: "30px", borderRadius: "7px", background: "rgba(246,83,16,0.16)", border: "1px solid rgba(246,83,16,0.28)", width: "90px" }} />
                  <div style={{ flex: 1, borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video element */}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: playing ? "block" : "none",
              backgroundColor: "transparent",
            }}
          />
        )}

        {/* Dark overlay when paused */}
        {!playing && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.36)" }} />
        )}

        {/* ── Play button + label ── */}
        {!playing && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <button
              onClick={handlePlay}
              aria-label="Play demo video"
              style={{
                position: "relative",
                width: "68px",
                height: "68px",
                background: "none",
                border: "none",
                cursor: videoSrc ? "pointer" : "default",
                padding: 0,
              }}
            >
              {/* Ripple rings */}
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="demo-ring"
                  style={{
                    position: "absolute",
                    inset: `-${i * 6 + 4}px`,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.45)",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
              {/* White disc */}
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "#ffffff",
                  boxShadow: "rgba(0,0,0,0.5) 0px 0px 18px 6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 32 32"
                  fill="none"
                  style={{ marginLeft: "3px", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))" }}
                >
                  <path d="M10 6L26 16L10 26V6Z" fill="#0d0d0d" />
                </svg>
              </span>
            </button>

            {/* Label */}
            <span
              style={{
                color: "#fff",
                fontSize: "14px",
                letterSpacing: "0.01em",
                lineHeight: "24px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes demo-ring-pulse {
          0%   { opacity: 0.5; transform: scale(1); }
          70%  { opacity: 0;   transform: scale(1.6); }
          100% { opacity: 0;   transform: scale(1.6); }
        }
        .demo-ring {
          animation: demo-ring-pulse 1.9s ease-out infinite;
        }
      `}</style>
    </div>
  );
}
