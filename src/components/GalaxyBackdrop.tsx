import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion, usePerfMode } from "./Starfield";

const RADIUS = 7;
const ARMS = 3;
const SPIN = 1.25;

const CORE = new THREE.Color("#ffe6b0");
const EDGE = new THREE.Color("#2a44ff");

function BackdropPoints({
  reduced,
  perf,
}: {
  reduced: boolean;
  perf: "high" | "medium" | "low";
}) {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const count = reduced ? 3500 : perf === "low" ? 4000 : perf === "medium" ? 9000 : 16000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.6) * RADIUS;
      const branch = ((i % ARMS) / ARMS) * Math.PI * 2;
      const spin = r * SPIN;
      const j = (p: number) => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * p * r;

      pos[i3] = Math.cos(branch + spin) * r + j(0.4);
      pos[i3 + 1] = j(0.14);
      pos[i3 + 2] = Math.sin(branch + spin) * r + j(0.4);

      const mixed = CORE.clone().lerp(EDGE, Math.min(r / RADIUS, 1));
      col[i3] = mixed.r;
      col[i3 + 1] = mixed.g;
      col[i3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const setXY = (cx: number, cy: number) => {
      mouse.current.tx = (cx / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (cy / window.innerHeight - 0.5) * 2;
    };
    const onPointer = (e: PointerEvent) => setXY(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 1) setXY(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useFrame((_, dt) => {
    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.04;
    m.y += (m.ty - m.y) * 0.04;
    const g = ref.current;
    if (!g) return;
    g.rotation.y += dt * (reduced ? 0.008 : 0.022);
    g.rotation.x += (0.42 + m.y * 0.12 - g.rotation.x) * 0.03;
    g.rotation.z += (-m.x * 0.1 - g.rotation.z) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={perf === "low" ? 0.022 : 0.016}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        transparent
        opacity={0.9}
      />
    </points>
  );
}

/** Subtle, non-interactive 3D galaxy motion layered behind all page content. */
export function GalaxyBackdrop() {
  const reduced = useReducedMotion();
  const perf = usePerfMode();
  const dprMax = perf === "low" ? 1 : perf === "medium" ? 1.25 : 1.5;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: reduced ? 0.16 : 0.3 }}
    >
      <Canvas
        camera={{ position: [0, 3.4, 9], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, dprMax]}
        gl={{ powerPreference: "low-power", antialias: false }}
      >
        <BackdropPoints reduced={reduced} perf={perf} />
      </Canvas>
    </div>
  );
}
