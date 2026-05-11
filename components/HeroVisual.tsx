"use client";

import { useEffect, useRef } from "react";

/**
 * Rotating dotted planet. Fibonacci-distributed points projected to 2D,
 * depth-faded so the back hemisphere hides. Accent beacons and a rim
 * glow give visual "latches" that the CircuitTraces' docking ports line
 * up with, so the whole thing reads as one device, not two decals.
 */

type Dot = {
  x: number;
  y: number;
  z: number;
  intensity: number;
  accent: boolean;
  phase: number;
};

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 2400;
    const dots: Dot[] = new Array(N);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const accentCount = 28;
    const accentStride = Math.floor(N / accentCount);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const noise = seed - Math.floor(seed);
      dots[i] = {
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        intensity: 0.3 + noise * 0.7,
        accent: i % accentStride === 0,
        phase: noise * Math.PI * 2,
      };
    }

    let w = canvas.clientWidth;
    let h = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    let angleY = 0;
    const angleX = -0.28; // slight tilt
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

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      angleY += dt * 0.14;
      const t = now / 1000;

      const cx = w / 2;
      const cy = h / 2;
      // subtle breathing — scale ±1.2% on a slow cycle
      const breathe = 1 + Math.sin(t * 0.55) * 0.012;
      const R = Math.min(w, h) * 0.4 * breathe;

      ctx.clearRect(0, 0, w, h);

      // occasional flare — pick a random dot, make it light up for 1s
      flareTimer += dt;
      if (flareTimer > 1.4) {
        flareTimer = 0;
        flareIdx = Math.floor(Math.random() * N);
      }

      // outer orbit ring with tick marks
      ctx.strokeStyle = "rgba(232, 165, 63, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(232, 165, 63, 0.35)";
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * R * 1.14, cy + Math.sin(a) * R * 1.14);
        ctx.lineTo(cx + Math.cos(a) * R * 1.22, cy + Math.sin(a) * R * 1.22);
        ctx.stroke();
      }

      // rim glow — a soft radial fade along the visible edge of the sphere
      const grad = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.02);
      grad.addColorStop(0, "rgba(232, 165, 63, 0)");
      grad.addColorStop(0.8, "rgba(232, 165, 63, 0.06)");
      grad.addColorStop(1, "rgba(232, 165, 63, 0.28)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
      ctx.fill();

      // inner equator guide (dashed ellipse, compressed by tilt)
      ctx.strokeStyle = "rgba(232, 165, 63, 0.1)";
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, R, R * Math.abs(Math.sin(angleX)), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // project + draw dots
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      for (let i = 0; i < N; i++) {
        const d = dots[i];
        // rotate around Y
        const x1 = d.x * cosY - d.z * sinY;
        const z1 = d.x * sinY + d.z * cosY;
        // rotate around X (tilt)
        const y1 = d.y * cosX - z1 * sinX;
        const z2 = d.y * sinX + z1 * cosX;

        if (z2 < -0.1) continue;
        const depth = (z2 + 1) / 2;
        const sx = cx + x1 * R;
        const sy = cy + y1 * R;
        const onRim = Math.abs(z2) < 0.22; // within a rim band

        // rim-band dots glow a little extra amber, pulling the eye to
        // the cable docking area
        if (d.accent && z2 > 0.05) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 2 + d.phase);
          const alpha = 0.35 + 0.65 * pulse;
          const haloR = 6 + pulse * 3;
          ctx.fillStyle = `rgba(232, 165, 63, ${alpha * 0.18})`;
          ctx.beginPath();
          ctx.arc(sx, sy, haloR, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(232, 165, 63, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.8 + pulse * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (onRim) {
          const alpha = depth * d.intensity * 0.8;
          const warm = 0.3 + Math.abs(z2) * 0.4;
          ctx.fillStyle = `rgba(232, 165, 63, ${alpha * warm})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 0.7 + depth * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const alpha = depth * d.intensity * 0.7;
          const size = 0.5 + depth * 1.4;
          ctx.fillStyle = `rgba(245, 241, 234, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // flare — the chosen dot briefly lights up bright amber
        if (i === flareIdx && z2 > 0) {
          const k = 1 - flareTimer / 1.4;
          ctx.fillStyle = `rgba(232, 165, 63, ${k * 0.9})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 1 + k * 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(232, 165, 63, ${k * 0.18})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 4 + k * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // corner ticks
      ctx.strokeStyle = "rgba(232, 165, 63, 0.55)";
      ctx.lineWidth = 1;
      const pad = 8;
      const tick = 12;
      const corners: Array<[number, number, number, number]> = [
        [pad, pad, 1, 1],
        [w - pad, pad, -1, 1],
        [pad, h - pad, 1, -1],
        [w - pad, h - pad, -1, -1],
      ];
      for (const [x, y, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(x + tick * dx, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + tick * dy);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        aria-label="Rotating hardware planet"
        className="h-full w-full"
      />
    </div>
  );
}
