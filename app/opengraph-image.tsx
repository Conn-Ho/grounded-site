import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Grounded — Vibe Hardware for AI Agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(145deg, #0a0908 0%, #121110 60%, #1a120a 100%)",
          color: "#f5f1ea",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* corner ticks */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            width: 24,
            height: 24,
            borderTop: "2px solid #e8a53f",
            borderLeft: "2px solid #e8a53f",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            width: 24,
            height: 24,
            borderTop: "2px solid #e8a53f",
            borderRight: "2px solid #e8a53f",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 32,
            width: 24,
            height: 24,
            borderBottom: "2px solid #e8a53f",
            borderLeft: "2px solid #e8a53f",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            width: 24,
            height: 24,
            borderBottom: "2px solid #e8a53f",
            borderRight: "2px solid #e8a53f",
            display: "flex",
          }}
        />

        {/* header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#e8a53f",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              background: "#e8a53f",
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <span>Grounded</span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(232,165,63,0.4)",
              marginLeft: 12,
              display: "flex",
            }}
          />
          <span style={{ fontSize: 18, opacity: 0.6 }}>Early Access</span>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.02,
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex" }}>Close the loop</span>
          <span style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <span style={{ color: "#6a6560", textDecoration: "line-through" }}>
              humans
            </span>
            <span style={{ color: "#e8a53f", fontSize: 40 }}>→</span>
            <span style={{ color: "#e8a53f" }}>agents</span>
          </span>
          <span style={{ display: "flex", color: "#b8b1a5", fontSize: 64 }}>
            and the physical world.
          </span>
        </div>

        {/* footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(245,241,234,0.7)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>Vibe Hardware SDK</span>
          <span style={{ color: "#e8a53f" }}>grounded.dev</span>
        </div>
      </div>
    ),
    size
  );
}
