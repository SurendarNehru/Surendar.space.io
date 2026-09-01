import { useEffect, useRef, useState } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  o: number;
  tw: number;
  vy: number;
};

type Shooter = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
};

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Auto performance detection: probes hardware and monitors FPS.
// Returns "high" | "medium" | "low". Downgrades when FPS drops below thresholds.
export function usePerfMode() {
  const [mode, setMode] = useState<"high" | "medium" | "low">("high");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Initial probe: cores, memory, mobile heuristic
    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency || 4;
    const mem = nav.deviceMemory ?? 4;
    const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    let initial: "high" | "medium" | "low" = "high";
    if (cores <= 2 || mem <= 2) initial = "low";
    else if (mobile || cores <= 4 || mem <= 4) initial = "medium";
    setMode(initial);

    // FPS monitor — 2s sampling window
    let raf = 0;
    let frames = 0;
    let start = performance.now();
    let downgraded = false;
    const loop = () => {
      frames++;
      const now = performance.now();
      if (now - start >= 2000) {
        const fps = (frames * 1000) / (now - start);
        if (!downgraded) {
          if (fps < 30) {
            setMode((m) => (m === "high" ? "medium" : m === "medium" ? "low" : "low"));
            downgraded = true;
          } else if (fps < 45) {
            setMode((m) => (m === "high" ? "medium" : m));
            downgraded = true;
          }
        }
        frames = 0;
        start = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return mode;
}

export function Starfield({ dim = false }: { dim?: boolean }) {
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
    let stars: Star[] = [];
    const shooters: Shooter[] = [];
    let raf = 0;
    let lastShoot = 0;

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
      const perfCap = perf === "low" ? 520 : perf === "medium" ? 1200 : 2200;
      const perfDensity = perf === "low" ? 4200 : perf === "medium" ? 1600 : 900;
      const density = reduced ? 9000 : perfDensity;
      const cap = reduced ? 320 : perfCap;

      const count = Math.min(cap, Math.floor((w * h) / density));
      stars = Array.from({ length: count }, (_, i) => {
        // Three discrete parallax layers: far (60%), mid (28%), near (12%).
        // Depth drives radius, drift speed, brightness and parallax offset.
        const t = i / Math.max(1, count);
        const layer = t < 0.6 ? 0 : t < 0.88 ? 1 : 2;
        const base = layer === 0 ? 0.05 : layer === 1 ? 0.42 : 0.78;
        const span = layer === 0 ? 0.32 : layer === 1 ? 0.3 : 0.22;
        const z = base + Math.random() * span;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          // CSS-px radius; rounded stars, scaled by layer depth
          r: 0.35 + z * 1.35,
          o: 0.2 + Math.random() * 0.75,
          tw: Math.random() * Math.PI * 2,
          vy: reduced ? 0.02 + z * 0.08 : 0.03 + z * 0.45,
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

    const spawnShooter = () => {
      const y = Math.random() * h * 0.6;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speed = 8 + Math.random() * 6;
      shooters.push({
        x: dir === 1 ? -20 : w + 20,
        y,
        vx: speed * dir,
        vy: speed * 0.35,
        life: 0,
        max: 60 + Math.random() * 30,
      });
    };

    const tick = () => {
      const m = pointerRef.current;
      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;

      ctx.clearRect(0, 0, w, h);
      const parallax = reduced ? 12 : 42;

      for (const s of stars) {
        s.y -= s.vy;
        if (!reduced) s.tw += 0.02 + s.z * 0.03;
        if (s.y < -2) {
          s.y = h + 2;
          s.x = Math.random() * w;
        }
        // Layered parallax: far stars barely move, near stars swing widest.
        const depth = s.z * s.z;
        const px = s.x + m.x * depth * parallax;
        const py = s.y + m.y * depth * parallax;
        const twinkle = reduced ? 1 : 0.65 + Math.sin(s.tw) * 0.35;
        // depth-based brightness falloff — distant stars stay dim, near stars pop
        const falloff = 0.32 + depth * 0.68;
        const alpha = Math.min(1, s.o * twinkle * falloff);

        // Snap to the device pixel grid so points render identically
        // at dpr 1 (desktop), 1.5 and 2 (mobile / retina).
        const sx = Math.round(px * dpr) / dpr;
        const sy = Math.round(py * dpr) / dpr;
        const radius = Math.max(0.5, Math.round(s.r * dpr) / dpr / 2);

        // round star particle
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();

        // sparkle cross for the brightest foreground stars
        if (!reduced && s.z > 0.86) {
          const len = Math.round((1.5 + s.z * 2.5) * dpr) / dpr;
          const hair = 1 / dpr; // one device pixel, any DPR
          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.4})`;
          ctx.lineWidth = hair;
          ctx.beginPath();
          ctx.moveTo(sx - len - radius, sy);
          ctx.lineTo(sx + len + radius, sy);
          ctx.moveTo(sx, sy - len - radius);
          ctx.lineTo(sx, sy + len + radius);
          ctx.stroke();
        }
      }

      // shooting stars
      if (!reduced && perf !== "low") {
        const now = performance.now();
        if (now - lastShoot > 4200 && Math.random() < 0.02) {
          spawnShooter();
          lastShoot = now;
        }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const s = shooters[i];
          s.x += s.vx;
          s.y += s.vy;
          s.life += 1;
          const a = Math.max(0, 1 - s.life / s.max);
          const tailX = s.x - s.vx * 6;
          const tailY = s.y - s.vy * 6;
          const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(1, `rgba(255,255,255,${a})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
          if (s.life > s.max || s.x < -100 || s.x > w + 100) shooters.splice(i, 1);
        }
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
    // Pause the animation loop entirely while the tab is hidden — saves
    // battery/CPU and prevents a burst of catch-up frames on return.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        lastShoot = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, perf]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 transition-opacity duration-700 ease-out"
      style={{
        zIndex: -10,
        background: "radial-gradient(ellipse at 30% 20%, #0a0a18 0%, #050508 55%, #030307 100%)",
        opacity: dim ? 0 : 1,
      }}
      aria-hidden
    />
  );
}
