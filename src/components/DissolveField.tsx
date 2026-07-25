"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** Focal point of the solid mass, as a fraction of the canvas box. */
  focus?: { x: number; y: number };
  cell?: number;
  gap?: number;
  /** Peak cell opacity at the focal point. */
  intensity?: number;
};

/**
 * The studio mark breaks from solid geometry into scattered pixels along one
 * edge. This renders that same transition as a field: cells are near-solid at
 * the focal point and drop out individually as they travel away from it.
 *
 * The dropout is per-cell and random, not a smooth alpha fade — that scatter is
 * the whole point, and it's why this is a canvas rather than a masked gradient.
 */
export function DissolveField({
  className = "",
  focus = { x: 0.72, y: 0.42 },
  cell = 5,
  gap = 12,
  intensity = 0.5,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = cell + gap;

    type Cell = { x: number; y: number; base: number; phase: number; speed: number };
    let cells: Cell[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;

    // Deterministic hash so the pattern is stable across redraws — a field that
    // reshuffles on every resize reads as noise rather than structure.
    const hash = (x: number, y: number) => {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return n - Math.floor(n);
    };

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fx = width * focus.x;
      const fy = height * focus.y;
      // Normalise by the longest reach from focus to a corner so the falloff
      // covers the box regardless of aspect ratio.
      const reach = Math.hypot(Math.max(fx, width - fx), Math.max(fy, height - fy));

      const next: Cell[] = [];
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const d = Math.hypot(x - fx, y - fy) / reach;
          // Density curve: tight solid core with a fast-thinning tail. A gentler
          // curve here turns the field into even wallpaper and loses the scatter
          // that makes it read as the mark's dissolving edge.
          const density = Math.max(0, 1 - d * 1.45) ** 2.8;
          const r = hash(x, y);
          if (r > density) continue; // this cell dissolved
          next.push({
            x,
            y,
            base: density * intensity * (0.55 + hash(y, x) * 0.45),
            phase: hash(x + 7, y + 13) * Math.PI * 2,
            speed: 0.4 + hash(x + 31, y + 17) * 0.7,
          });
        }
      }
      cells = next;
    }

    function draw(t: number) {
      if (!width || !height) return;
      ctx!.clearRect(0, 0, width, height);
      for (const c of cells) {
        // Slow, low-amplitude shimmer — presence, not sparkle.
        const pulse = reduce ? 1 : 0.78 + 0.22 * Math.sin(t * 0.0006 * c.speed + c.phase);
        const a = c.base * pulse;
        if (a <= 0.01) continue;
        ctx!.fillStyle = `rgba(80, 183, 225, ${a.toFixed(3)})`;
        ctx!.fillRect(c.x, c.y, cell, cell);
      }
    }

    function loop(t: number) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    let onScreen = false;

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reduce;
      if (shouldRun && !raf) {
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    build();
    draw(0);

    // Several fields can exist on one page; only the visible ones should be
    // spending frames.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      build();
      if (!raf) draw(0);
    });
    ro.observe(canvas);

    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [cell, gap, focus.x, focus.y, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
