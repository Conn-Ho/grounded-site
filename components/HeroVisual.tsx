"use client";

import { useEffect, useRef } from "react";

/**
 * Isometric hardware-agent stack.
 * Two platform layers (MCP → Agents), container boxes on top,
 * region nodes connected by animated dashed lines.
 * Pulsing orange beacons + flares keep the energy of the original sphere.
 */
export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let w = canvas.clientWidth;
    let h = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    let last = performance.now();
    let flareTimer = 0;
    let flareIdx = -1;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Standard 2:1 isometric projection
    function iso(gx: number, gy: number, gz: number, scale: number, cx: number, cy: number) {
      return {
        sx: cx + (gx - gy) * scale,
        sy: cy + (gx + gy) * scale * 0.5 - gz * scale,
      };
    }

    // ── Beacon positions (pulsing orange dots) ──
    const beacons = [
      { gx: -1.6, gy: 0,    gz: 1.02, phase: 0.0 },
      { gx:  0,   gy: -1.6, gz: 1.02, phase: 1.3 },
      { gx:  1.6, gy: 0,    gz: 1.02, phase: 2.5 },
      { gx:  0,   gy:  1.6, gz: 1.02, phase: 0.7 },
      { gx: -0.7, gy: -0.3, gz: 1.62, phase: 1.8 },
      { gx:  0.6, gy:  0.4, gz: 1.62, phase: 0.4 },
    ];

    const flareSpots = [
      { gx: -1.6, gy: 0,    gz: 1.02 },
      { gx:  1.6, gy: 0,    gz: 1.02 },
      { gx:  0,   gy: -1.6, gz: 1.02 },
      { gx:  0,   gy:  1.6, gz: 1.02 },
    ];

    // ── Draw a flat rhombus platform (top + two side faces) ──
    function drawPlatform(
      t: number, scale: number, cx: number, cy: number,
      hw: number, hh: number,      // half grid-size
      gz: number, depth: number,    // top z, slab thickness
      opts: {
        topFill: string; sideFill: string;
        stroke: string; labelColor: string; label: string;
      }
    ) {
      const { topFill, sideFill, stroke, labelColor, label } = opts;
      const N = iso(0,    -hh,  gz,         scale, cx, cy);
      const E = iso(hw,    0,   gz,         scale, cx, cy);
      const S = iso(0,     hh,  gz,         scale, cx, cy);
      const W = iso(-hw,   0,   gz,         scale, cx, cy);
      const Sb = iso(0,    hh,  gz - depth, scale, cx, cy);
      const Wb = iso(-hw,  0,   gz - depth, scale, cx, cy);
      const Eb = iso(hw,   0,   gz - depth, scale, cx, cy);

      // Left face (W → S → Sb → Wb)
      ctx.beginPath();
      ctx.moveTo(W.sx, W.sy);
      ctx.lineTo(S.sx, S.sy);
      ctx.lineTo(Sb.sx, Sb.sy);
      ctx.lineTo(Wb.sx, Wb.sy);
      ctx.closePath();
      ctx.fillStyle = sideFill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Right face (E → S → Sb → Eb)
      ctx.beginPath();
      ctx.moveTo(E.sx, E.sy);
      ctx.lineTo(S.sx, S.sy);
      ctx.lineTo(Sb.sx, Sb.sy);
      ctx.lineTo(Eb.sx, Eb.sy);
      ctx.closePath();
      ctx.fillStyle = sideFill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Top face (N → E → S → W)
      ctx.beginPath();
      ctx.moveTo(N.sx, N.sy);
      ctx.lineTo(E.sx, E.sy);
      ctx.lineTo(S.sx, S.sy);
      ctx.lineTo(W.sx, W.sy);
      ctx.closePath();
      ctx.fillStyle = topFill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Subtle grid lines on top face
      ctx.strokeStyle = stroke.replace(/[\d.]+\)$/, "0.15)");
      ctx.lineWidth = 0.5;
      for (let i = -1; i <= 1; i++) {
        const a1 = iso(i * hw * 0.5, -hh, gz, scale, cx, cy);
        const a2 = iso(i * hw * 0.5,  hh, gz, scale, cx, cy);
        const b1 = iso(-hw, i * hh * 0.5, gz, scale, cx, cy);
        const b2 = iso( hw, i * hh * 0.5, gz, scale, cx, cy);
        ctx.beginPath(); ctx.moveTo(a1.sx, a1.sy); ctx.lineTo(a2.sx, a2.sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(b1.sx, b1.sy); ctx.lineTo(b2.sx, b2.sy); ctx.stroke();
      }

      // Label on right face
      const labelPos = {
        sx: (E.sx + S.sx + Sb.sx + Eb.sx) / 4,
        sy: (E.sy + S.sy + Sb.sy + Eb.sy) / 4,
      };
      ctx.save();
      ctx.font = `bold ${Math.max(9, scale * 0.22)}px monospace`;
      ctx.fillStyle = labelColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, labelPos.sx, labelPos.sy);
      ctx.restore();

      void t;
    }

    // ── Draw a container box (small rhombus + two side faces) ──
    function drawContainer(
      t: number, scale: number, cx: number, cy: number,
      gx: number, gy: number, gz: number,
      gw: number, gh: number, gd: number,
      active: boolean
    ) {
      const floatZ = gz + (active ? Math.sin(t * 1.8) * 0.06 : 0);
      const hw = gw / 2, hh = gh / 2;
      const N  = iso(gx,      gy - hh, floatZ + gd, scale, cx, cy);
      const E  = iso(gx + hw, gy,      floatZ + gd, scale, cx, cy);
      const S  = iso(gx,      gy + hh, floatZ + gd, scale, cx, cy);
      const W  = iso(gx - hw, gy,      floatZ + gd, scale, cx, cy);
      const Sb = iso(gx,      gy + hh, floatZ,      scale, cx, cy);
      const Wb = iso(gx - hw, gy,      floatZ,      scale, cx, cy);
      const Eb = iso(gx + hw, gy,      floatZ,      scale, cx, cy);

      const accentA = active ? 0.75 : 0.28;
      const strokeC = `rgba(246,83,16,${accentA})`;
      const topC    = active ? "rgba(48,22,8,0.97)"  : "rgba(26,20,14,0.95)";
      const sideC   = active ? "rgba(35,16,6,0.97)"  : "rgba(20,15,10,0.95)";

      // Left face
      ctx.beginPath();
      ctx.moveTo(W.sx, W.sy); ctx.lineTo(S.sx, S.sy);
      ctx.lineTo(Sb.sx, Sb.sy); ctx.lineTo(Wb.sx, Wb.sy);
      ctx.closePath();
      ctx.fillStyle = sideC; ctx.fill();
      ctx.strokeStyle = strokeC; ctx.lineWidth = 0.7; ctx.stroke();

      // Right face
      ctx.beginPath();
      ctx.moveTo(E.sx, E.sy); ctx.lineTo(S.sx, S.sy);
      ctx.lineTo(Sb.sx, Sb.sy); ctx.lineTo(Eb.sx, Eb.sy);
      ctx.closePath();
      ctx.fillStyle = sideC; ctx.fill();
      ctx.strokeStyle = strokeC; ctx.lineWidth = 0.7; ctx.stroke();

      // Top face
      ctx.beginPath();
      ctx.moveTo(N.sx, N.sy); ctx.lineTo(E.sx, E.sy);
      ctx.lineTo(S.sx, S.sy); ctx.lineTo(W.sx, W.sy);
      ctx.closePath();
      ctx.fillStyle = topC; ctx.fill();
      ctx.strokeStyle = strokeC; ctx.lineWidth = 0.7; ctx.stroke();

      // Orange glow under active container
      if (active) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);
        const center = iso(gx, gy, floatZ, scale, cx, cy);
        const grad = ctx.createRadialGradient(center.sx, center.sy, 0, center.sx, center.sy, scale * 0.72);
        grad.addColorStop(0, `rgba(246,83,16,${0.14 + 0.08 * pulse})`);
        grad.addColorStop(1, "rgba(246,83,16,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.ellipse(center.sx, center.sy, scale * 0.72, scale * 0.36, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Icon dot on top center
      const topC2 = iso(gx, gy, floatZ + gd + 0.01, scale, cx, cy);
      ctx.fillStyle = active ? "rgba(246,83,16,0.7)" : "rgba(210,190,160,0.35)";
      ctx.beginPath(); ctx.arc(topC2.sx, topC2.sy, 2.2, 0, Math.PI * 2); ctx.fill();

      // Status dot top corner
      const dotP = iso(gx + hw * 0.55, gy - hh * 0.55, floatZ + gd + 0.01, scale, cx, cy);
      const dp = 0.5 + 0.5 * Math.sin(t * 3.2 + gx);
      ctx.fillStyle = active
        ? `rgba(246,83,16,${dp})`
        : `rgba(80,200,80,${dp * 0.7})`;
      ctx.beginPath(); ctx.arc(dotP.sx, dotP.sy, 1.4, 0, Math.PI * 2); ctx.fill();
    }

    // ── Region node (flat 2D box, sits beside the platform) ──
    function drawRegionNode(
      t: number, scale: number, cx: number, cy: number,
      label: string,
      gx: number, gy: number, gz: number,
      phase: number
    ) {
      const { sx, sy } = iso(gx, gy, gz, scale, cx, cy);
      const bw = Math.max(36, scale * 0.74);
      const bh = Math.max(20, scale * 0.42);

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath(); ctx.rect(sx - bw / 2 + 2, sy - bh / 2 + 2, bw, bh); ctx.fill();

      // Box
      ctx.fillStyle = "rgba(22,17,13,0.95)";
      ctx.strokeStyle = "rgba(110,85,60,0.55)";
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.rect(sx - bw / 2, sy - bh / 2, bw, bh); ctx.fill(); ctx.stroke();

      // Status dot (green)
      const dp = 0.5 + 0.5 * Math.sin(t * 2.1 + phase);
      ctx.fillStyle = `rgba(80,200,80,${0.45 + 0.5 * dp})`;
      ctx.beginPath(); ctx.arc(sx + bw / 2 - 6, sy - bh / 2 + 6, 2, 0, Math.PI * 2); ctx.fill();

      // Label
      ctx.font = `bold ${Math.max(7, scale * 0.16)}px monospace`;
      ctx.fillStyle = "rgba(210,185,155,0.8)";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, sx, sy);

      // Connector circle left
      ctx.strokeStyle = "rgba(110,85,60,0.45)";
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(sx - bw / 2 + 6, sy, 3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(110,85,60,0.3)";
      ctx.beginPath(); ctx.arc(sx - bw / 2 + 6, sy, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // ── Animated dashed connection line ──
    function drawConnection(
      t: number, scale: number, cx: number, cy: number,
      from: { gx: number; gy: number; gz: number },
      to:   { gx: number; gy: number; gz: number },
      phase: number
    ) {
      const f = iso(from.gx, from.gy, from.gz, scale, cx, cy);
      const toP = iso(to.gx, to.gy, to.gz, scale, cx, cy);
      const offset = (t * 18 + phase * 12) % 14;
      ctx.strokeStyle = "rgba(246,83,16,0.38)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 10]);
      ctx.lineDashOffset = -offset;
      ctx.beginPath(); ctx.moveTo(f.sx, f.sy); ctx.lineTo(toP.sx, toP.sy); ctx.stroke();
      ctx.setLineDash([]); ctx.lineDashOffset = 0;

      // Endpoint dot
      ctx.fillStyle = "rgba(246,83,16,0.55)";
      ctx.beginPath(); ctx.arc(f.sx, f.sy, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // ── Main render loop ──
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);

      const scale = Math.min(w, h) * 0.21;
      const cx = w * 0.5;
      const cy = h * 0.52;

      // ── Platforms (back to front: MCP first, then Agents) ──
      drawPlatform(t, scale, cx, cy, 1.7, 1.7, 0.48, 0.48, {
        topFill:   "rgba(24,19,13,0.93)",
        sideFill:  "rgba(18,14,9,0.93)",
        stroke:    "rgba(90,70,50,0.45)",
        labelColor:"rgba(160,130,90,0.55)",
        label: "MCP",
      });

      drawPlatform(t, scale, cx, cy, 1.7, 1.7, 1.02, 0.48, {
        topFill:   "rgba(22,17,11,0.93)",
        sideFill:  "rgba(16,12,8,0.93)",
        stroke:    "rgba(246,83,16,0.28)",
        labelColor:"rgba(246,83,16,0.60)",
        label: "Agents",
      });

      // ── Connections to region nodes ──
      drawConnection(t, scale, cx, cy,
        { gx: -1.7, gy: 0,   gz: 0.75 },
        { gx: -2.6, gy: 0.3, gz: 0.4 }, 0);
      drawConnection(t, scale, cx, cy,
        { gx: -1.3, gy: 1.7, gz: 0.75 },
        { gx: -1.8, gy: 2.6, gz: 0.4 }, 1.5);
      drawConnection(t, scale, cx, cy,
        { gx:  1.7, gy: -0.6, gz: 0.75 },
        { gx:  2.5, gy: -1.1, gz: 0.4 }, 3.0);

      // ── Region nodes ──
      drawRegionNode(t, scale, cx, cy, "US-WEST", -2.6, 0.3, 0.4, 0.0);
      drawRegionNode(t, scale, cx, cy, "EU",      -1.8, 2.6, 0.4, 1.5);
      drawRegionNode(t, scale, cx, cy, "ASIA",     2.5, -1.1, 0.4, 3.0);

      // ── Containers (roughly back → front order) ──
      drawContainer(t, scale, cx, cy, -0.75, -0.35, 1.02, 0.62, 0.62, 0.55, false);
      drawContainer(t, scale, cx, cy,  0.30, -0.70, 1.02, 0.62, 0.62, 0.55, false);
      drawContainer(t, scale, cx, cy,  0.00,  0.10, 1.02, 0.62, 0.62, 0.55, false);
      drawContainer(t, scale, cx, cy, -0.20,  0.72, 1.02, 0.62, 0.62, 0.55, false);
      drawContainer(t, scale, cx, cy,  0.78,  0.32, 1.02, 0.62, 0.62, 0.55, true); // ACTIVE

      // ── "⚡ 127ms startup" label near active container ──
      const labelP = iso(0.78, 0.32, 1.02 + 0.55 + 0.12, scale, cx, cy);
      const flk = 0.82 + 0.18 * Math.sin(t * 3.8);
      ctx.font = `bold ${Math.max(11, scale * 0.20)}px monospace`;
      ctx.fillStyle = `rgba(246,83,16,${flk})`;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText("⚡ 127ms", labelP.sx + 10, labelP.sy - 5);
      ctx.font = `${Math.max(9, scale * 0.17)}px monospace`;
      ctx.fillStyle = `rgba(246,83,16,${flk * 0.65})`;
      ctx.fillText("startup", labelP.sx + 10, labelP.sy + 10);

      // ── Pulsing beacons ──
      for (const b of beacons) {
        const { sx, sy } = iso(b.gx, b.gy, b.gz, scale, cx, cy);
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + b.phase);
        ctx.fillStyle = `rgba(246,83,16,${0.06 + 0.08 * pulse})`;
        ctx.beginPath(); ctx.arc(sx, sy, 9 + pulse * 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(246,83,16,${0.5 + 0.5 * pulse})`;
        ctx.beginPath(); ctx.arc(sx, sy, 2 + pulse * 0.8, 0, Math.PI * 2); ctx.fill();
      }

      // ── Flare ──
      flareTimer += dt;
      if (flareTimer > 1.8) { flareTimer = 0; flareIdx = Math.floor(Math.random() * flareSpots.length); }
      if (flareIdx >= 0) {
        const fp = flareSpots[flareIdx];
        const { sx, sy } = iso(fp.gx, fp.gy, fp.gz, scale, cx, cy);
        const k = 1 - flareTimer / 1.8;
        ctx.fillStyle = `rgba(246,83,16,${k * 0.9})`;
        ctx.beginPath(); ctx.arc(sx, sy, 1 + k * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(246,83,16,${k * 0.2})`;
        ctx.beginPath(); ctx.arc(sx, sy, 5 + k * 10, 0, Math.PI * 2); ctx.fill();
      }

      // corner ticks removed

      rafId = requestAnimationFrame(draw);
    };

    resize();
    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        aria-label="Isometric hardware agent infrastructure"
        className="h-full w-full"
      />
    </div>
  );
}
