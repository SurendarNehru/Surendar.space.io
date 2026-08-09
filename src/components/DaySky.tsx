import { useEffect, useRef } from "react";
import { useReducedMotion, usePerfMode } from "./Starfield";

type Mote = {
  x: number;
  y: number;
  z: number;
  r: number;
  o: number;
  tw: number;
  vy: number;
  vx: number;
};

/**
 * Light-theme counterpart to the Starfield.
 * Same particle language (round, layered, parallax) rendered on a bright
 * dawn-nebula gradient — no photography, so day and night feel like one system.
 */
export function DaySky({ dim = false }: { dim?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const reduced = useReducedMotion();
  const perf = usePerfMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let t = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const perfCap = perf === "low" ? 200 : perf === "medium" ? 420 : 700;
      const density = reduced ? 9000 : perf === "low" ? 6500 : 2800;
      const count = Math.min(reduced ? 180 : perfCap, Math.floor((w * h) / density));
      motes = Array.from({ length: count }, (_, i) => {
        const p = i / Math.max(1, count);
        const layer = p < 0.6 ? 0 : p < 0.88 ? 1 : 2;
        const base = layer === 0 ? 0.05 : layer === 1 ? 0.42 : 0.78;
        const span = layer === 0 ? 0.32 : layer === 1 ? 0.3 : 0.22;
        const z = base + Math.random() * span;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.5 + z * 1.8,
          o: 0.18 + Math.random() * 0.5,
          tw: Math.random() * Math.PI * 2,
          vy: reduced ? 0.01 + z * 0.05 : 0.02 + z * 0.28,
          vx: (Math.random() - 0.5) * (reduced ? 0.05 : 0.22),
        };
      });
    };

    const setPointer = (cx: number, cy: number) => {
      pointerRef.current.tx = (cx / w - 0.5) * 2;
      pointerRef.current.ty = (cy / h - 0.5) * 2;
    };
    const onMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) setPointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const tick = () => {
      const m = pointerRef.current;
      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;
      t += reduced ? 0.002 : 0.006;

      ctx.clearRect(0, 0, w, h);

      // soft nebula blooms — the day-mode echo of the galaxy core
      const blooms: { x: number; y: number; r: number; c: string }[] = [
        {
          x: w * (0.24 + m.x * 0.02) + Math.sin(t) * 12,
          y: h * (0.18 + m.y * 0.02) + Math.cos(t * 0.8) * 10,
          r: Math.max(w, h) * 0.55,
          c: "255,236,196",
        },
        {
          x: w * (0.82 - m.x * 0.015),
          y: h * (0.72 - m.y * 0.015),
          r: Math.max(w, h) * 0.5,
          c: "196,214,255",
        },
      ];
      for (const b of blooms) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const pulse = reduced ? 0.3 : 0.3 + Math.sin(t * 1.6) * 0.06;
        g.addColorStop(0, `rgba(${b.c},${pulse})`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      const parallax = reduced ? 12 : 42;
      for (const s of motes) {
        s.y -= s.vy;
        s.x += s.vx;
        if (!reduced) s.tw += 0.015 + s.z * 0.025;
        if (s.y < -3) {
          s.y = h + 3;
          s.x = Math.random() * w;
        }
        if (s.x < -3) s.x = w + 3;
        if (s.x > w + 3) s.x = -3;

        const depth = s.z * s.z;
        const px = s.x + m.x * depth * parallax;
        const py = s.y + m.y * depth * parallax;
        const twinkle = reduced ? 1 : 0.7 + Math.sin(s.tw) * 0.3;
        const alpha = Math.min(1, s.o * twinkle * (0.32 + depth * 0.68));

        const sx = Math.round(px * dpr) / dpr;
        const sy = Math.round(py * dpr) / dpr;
        const radius = Math.max(0.5, Math.round(s.r * dpr) / dpr / 2);

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    seed();
    tick();
    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [reduced, perf]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 transition-opacity duration-700 ease-out"
      style={{
        zIndex: -10,
        background:
          "linear-gradient(165deg, #cfe0fb 0%, #e6ecfb 38%, #f6f1ea 68%, #dfe7f7 100%)",
        opacity: dim ? 0 : 1,
      }}
      aria-hidden
    />
  );
}
