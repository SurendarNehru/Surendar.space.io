import { useEffect, useRef } from "react";
import { useReducedMotion, usePerfMode } from "./Starfield";

type Cloud = {
  x: number;
  y: number;
  z: number;
  r: number;
  puffs: { dx: number; dy: number; r: number }[];
};
type Bird = { x: number; y: number; z: number; v: number; p: number; s: number };
type Mote = { x: number; y: number; z: number; r: number; p: number };

/**
 * Interactive daytime sky. Drag / swipe to pan across the sky,
 * pinch or wheel to zoom, pointer parallax on every layer.
 */
export function SkyScene({ onReady }: { onReady?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    let raf = 0;
    let t = 0;

    // camera
    const cam = { x: 0, y: 0, tx: 0, ty: 0, zoom: 1, tzoom: 1 };
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let vx = 0;
    let vy = 0;
    let pinchDist = 0;

    let clouds: Cloud[] = [];
    let birds: Bird[] = [];
    let motes: Mote[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const cloudCount = reduced ? 8 : perf === "low" ? 10 : perf === "medium" ? 18 : 28;
      clouds = Array.from({ length: cloudCount }, () => {
        const z = 0.25 + Math.random() * 0.9;
        const r = 40 + z * 90;
        const puffCount = 4 + Math.floor(Math.random() * 4);
        return {
          x: Math.random() * w * 2.4 - w * 0.7,
          y: h * (0.05 + Math.random() * 0.62),
          z,
          r,
          puffs: Array.from({ length: puffCount }, (_, i) => ({
            dx: (i - puffCount / 2) * r * 0.55 + (Math.random() - 0.5) * r * 0.3,
            dy: (Math.random() - 0.5) * r * 0.35,
            r: r * (0.55 + Math.random() * 0.5),
          })),
        };
      });

      const birdCount = reduced ? 4 : perf === "low" ? 6 : 14;
      birds = Array.from({ length: birdCount }, () => ({
        x: Math.random() * w * 1.6 - w * 0.3,
        y: h * (0.16 + Math.random() * 0.35),
        z: 0.4 + Math.random() * 0.8,
        v: 0.3 + Math.random() * 0.8,
        p: Math.random() * Math.PI * 2,
        s: 5 + Math.random() * 7,
      }));

      const moteCount = reduced ? 0 : perf === "low" ? 30 : perf === "medium" ? 80 : 150;
      motes = Array.from({ length: moteCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.3 + Math.random(),
        r: 0.6 + Math.random() * 1.8,
        p: Math.random() * Math.PI * 2,
      }));
    };

    // ---- input -------------------------------------------------------
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ptr.tx = ((e.clientX - rect.left) / w - 0.5) * 2;
      ptr.ty = ((e.clientY - rect.top) / h - 0.5) * 2;
      if (!dragging) return;
      vx = e.clientX - lastX;
      vy = e.clientY - lastY;
      cam.tx += vx;
      cam.ty += vy;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cam.tzoom = Math.min(2.4, Math.max(0.7, cam.tzoom - e.deltaY * 0.0015));
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const [a, b] = [e.touches[0], e.touches[1]];
        pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const [a, b] = [e.touches[0], e.touches[1]];
        const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pinchDist > 0) {
          cam.tzoom = Math.min(2.4, Math.max(0.7, cam.tzoom * (d / pinchDist)));
        }
        pinchDist = d;
      } else if (e.touches.length === 1) {
        const rect = canvas.getBoundingClientRect();
        ptr.tx = ((e.touches[0].clientX - rect.left) / w - 0.5) * 2;
        ptr.ty = ((e.touches[0].clientY - rect.top) / h - 0.5) * 2;
      }
    };
    const onTouchEnd = () => {
      pinchDist = 0;
    };

    // ---- draw --------------------------------------------------------
    const drawCloud = (c: Cloud, px: number, py: number, scale: number) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(scale, scale);
      for (const p of c.puffs) {
        const g = ctx.createRadialGradient(p.dx, p.dy - p.r * 0.2, p.r * 0.1, p.dx, p.dy, p.r);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.55, "rgba(245,250,255,0.7)");
        g.addColorStop(1, "rgba(214,232,248,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.dx, p.dy, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const tick = () => {
      t += 0.005;
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;

      // inertia
      if (!dragging) {
        cam.tx += vx;
        cam.ty += vy;
        vx *= 0.94;
        vy *= 0.94;
        if (Math.abs(vx) < 0.01) vx = 0;
        if (Math.abs(vy) < 0.01) vy = 0;
      }
      cam.ty = Math.max(-h * 0.5, Math.min(h * 0.5, cam.ty));
      cam.x += (cam.tx - cam.x) * 0.09;
      cam.y += (cam.ty - cam.y) * 0.09;
      cam.zoom += (cam.tzoom - cam.zoom) * 0.08;

      // sky gradient
      const sky = ctx.createLinearGradient(0, -cam.y * 0.2, 0, h);
      sky.addColorStop(0, "#1668c6");
      sky.addColorStop(0.45, "#63a9e4");
      sky.addColorStop(0.82, "#bcdcf4");
      sky.addColorStop(1, "#eaf5fd");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // sun
      const sunX = w * 0.24 + cam.x * 0.05 + ptr.x * 18;
      const sunY = h * 0.2 + cam.y * 0.08 + ptr.y * 14;
      const pulse = reduced ? 1 : 1 + Math.sin(t * 2.1) * 0.03;
      const rad = Math.min(w, h) * 0.55 * pulse * cam.zoom;
      const halo = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, rad);
      halo.addColorStop(0, "rgba(255,255,255,0.98)");
      halo.addColorStop(0.08, "rgba(255,252,228,0.75)");
      halo.addColorStop(0.3, "rgba(255,240,190,0.25)");
      halo.addColorStop(1, "rgba(190,225,255,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, rad, 0, Math.PI * 2);
      ctx.fill();

      if (!reduced && perf !== "low") {
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(t * 0.16);
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          const len = (rad * 0.75 + Math.sin(t * 2 + i) * rad * 0.12) * 1;
          const g = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len);
          g.addColorStop(0, "rgba(255,255,240,0.28)");
          g.addColorStop(1, "rgba(255,255,240,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = i % 2 === 0 ? 12 : 4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
          ctx.stroke();
        }
        ctx.restore();
      }

      // clouds (depth sorted back -> front)
      for (const c of clouds) {
        if (!reduced) c.x += 0.08 + c.z * 0.22;
        const span = w * 2.4;
        if (c.x - c.r * 3 > w * 1.7) c.x -= span;
        const px = c.x + cam.x * c.z * 0.5 + ptr.x * c.z * 26;
        const py = c.y + cam.y * c.z * 0.35 + ptr.y * c.z * 16;
        drawCloud(c, px, py, c.z * cam.zoom);
      }

      // floating light motes
      if (motes.length) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const m of motes) {
          m.p += 0.012 * m.z;
          const px = (m.x + cam.x * m.z * 0.2 + Math.sin(m.p) * 18 + w) % w;
          const py = m.y + cam.y * m.z * 0.15 + Math.cos(m.p * 0.8) * 12;
          const a = 0.12 + Math.abs(Math.sin(m.p)) * 0.35;
          ctx.fillStyle = `rgba(255,255,240,${a})`;
          ctx.beginPath();
          ctx.arc(px, py, m.r * m.z * cam.zoom, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // birds
      for (const b of birds) {
        if (!reduced) {
          b.x += b.v * b.z;
          b.p += 0.11;
        }
        if (b.x > w * 1.35) b.x = -w * 0.35;
        const px = b.x + cam.x * b.z * 0.7 + ptr.x * b.z * 14;
        const py = b.y + Math.sin(b.p * 0.25) * 8 + cam.y * b.z * 0.5 + ptr.y * b.z * 10;
        const s = b.s * b.z * cam.zoom;
        const flap = Math.sin(b.p) * s * 0.55;
        ctx.strokeStyle = `rgba(20,40,70,${0.25 + b.z * 0.4})`;
        ctx.lineWidth = Math.max(1, 1.3 * b.z);
        ctx.beginPath();
        ctx.moveTo(px - s, py);
        ctx.quadraticCurveTo(px - s / 2, py - flap, px, py);
        ctx.quadraticCurveTo(px + s / 2, py - flap, px + s, py);
        ctx.stroke();
      }

      // soft horizon haze
      const haze = ctx.createLinearGradient(0, h * 0.68, 0, h);
      haze.addColorStop(0, "rgba(255,255,255,0)");
      haze.addColorStop(1, "rgba(255,255,255,0.55)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, h * 0.68, w, h * 0.32);

      raf = requestAnimationFrame(tick);
    };

    resize();
    seed();
    tick();
    onReady?.();

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [reduced, perf, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    />
  );
}
