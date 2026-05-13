"use client";

import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  accent: boolean;
};

export default function ParticleField({
  density = 0.00008,
  accentRatio = 0.08,
}: {
  density?: number;
  accentRatio?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(80, Math.floor(w * h * density));
      dots = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.5 + 0.15,
        accent: Math.random() < accentRatio,
      }));
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onLeave = () => {
      pointerRef.current = null;
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const p = pointerRef.current;

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;

        if (p) {
          const dx = d.x - p.x;
          const dy = d.y - p.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 14400) {
            const f = 40 / (dist2 + 200);
            d.x += dx * f;
            d.y += dy * f;
          }
        }

        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        if (d.y > h + 10) d.y = -10;

        if (d.accent) {
          ctx.fillStyle = `rgba(246, 83, 16, ${d.a})`;
        } else {
          ctx.fillStyle = `rgba(245, 241, 234, ${d.a * 0.45})`;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    tick();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [density, accentRatio]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
