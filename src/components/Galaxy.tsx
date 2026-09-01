import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion, usePerfMode } from "./Starfield";

const ARMS = 4;
const RADIUS = 6;
const SPIN = 1.1;
const RANDOMNESS = 0.35;
const RANDOM_POW = 3;

const CORE_COLOR = new THREE.Color("#fff3c9");
const EDGE_COLOR = new THREE.Color("#2b4bff");

/** Soft radial sprite used for the galactic core bloom and dust clouds. */
function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,236,190,0.55)");
  g.addColorStop(0.6, "rgba(150,170,255,0.18)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/** Bright galactic core with a breathing bloom plus faint dust haze. */
function CoreBloom({ reduced }: { reduced: boolean }) {
  const tex = useMemo(() => makeGlowTexture(), []);
  const core = useRef<THREE.Sprite>(null);
  const haze = useRef<THREE.Sprite>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * (reduced ? 0.3 : 1);
    const pulse = 1 + Math.sin(t * 0.8) * 0.04;
    core.current?.scale.setScalar(3.2 * pulse);
    haze.current?.scale.setScalar(11 * (1 + Math.sin(t * 0.35) * 0.02));
  });

  return (
    <group>
      <sprite ref={core}>
        <spriteMaterial
          map={tex}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
          opacity={0.9}
        />
      </sprite>
      <sprite ref={haze}>
        <spriteMaterial
          map={tex}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
          opacity={0.18}
        />
      </sprite>
    </group>
  );
}

function GalaxyPoints({
  reduced,
  perf,
  onReady,
}: {
  reduced: boolean;
  perf: "high" | "medium" | "low";
  onReady?: () => void;
}) {
  const ref = useRef<THREE.Points>(null);
  const { camera, size } = useThree();

  const count = reduced ? 12000 : perf === "low" ? 12000 : perf === "medium" ? 28000 : 50000;

  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.5) * RADIUS;
      const branch = ((i % ARMS) / ARMS) * Math.PI * 2;
      const spin = r * SPIN;

      const rx =
        Math.pow(Math.random(), RANDOM_POW) * (Math.random() < 0.5 ? 1 : -1) * RANDOMNESS * r;
      const ry =
        Math.pow(Math.random(), RANDOM_POW) *
        (Math.random() < 0.5 ? 1 : -1) *
        RANDOMNESS *
        r *
        0.35;
      const rz =
        Math.pow(Math.random(), RANDOM_POW) * (Math.random() < 0.5 ? 1 : -1) * RANDOMNESS * r;

      pos[i3] = Math.cos(branch + spin) * r + rx;
      pos[i3 + 1] = ry;
      pos[i3 + 2] = Math.sin(branch + spin) * r + rz;

      const mixed = CORE_COLOR.clone().lerp(EDGE_COLOR, Math.min(r / RADIUS, 1));
      // Real galaxies have hot blue-white giants and cool red dwarfs scattered
      // through the arms: nudge hue/lightness per star for a natural spread.
      const hueShift = (Math.random() - 0.5) * 0.06;
      const lightShift = 0.85 + Math.random() * 0.4;
      mixed.offsetHSL(hueShift, 0.05, 0);
      mixed.multiplyScalar(Math.min(lightShift, 1.25));
      col[i3] = mixed.r;
      col[i3 + 1] = mixed.g;
      col[i3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count]);

  // Signal ready once geometry is built
  const readyFired = useRef(false);
  useEffect(() => {
    if (!readyFired.current && onReady) {
      readyFired.current = true;
      // Defer to next frame so the first draw happens before fade
      requestAnimationFrame(() => onReady());
    }
  }, [onReady, positions]);

  // Global pointer + touch listener for parallax (matches starfield feel)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const setFromXY = (cx: number, cy: number) => {
      mouse.current.tx = (cx / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (cy / window.innerHeight - 0.5) * 2;
    };
    const onPointer = (e: PointerEvent) => setFromXY(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      // Skip when pinch-zoom is happening (2+ fingers)
      if (e.touches.length === 1) setFromXY(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [size.width]);

  const focusTarget = useRef<THREE.Vector3 | null>(null);
  const focusFrom = useRef<THREE.Vector3 | null>(null);
  const focusT = useRef(0);

  useFrame((_, dt) => {
    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.05;
    m.y += (m.ty - m.y) * 0.05;

    if (ref.current) {
      const spin = reduced ? 0.015 : perf === "low" ? 0.02 : 0.04;
      ref.current.rotation.y += dt * spin;
      ref.current.rotation.x += (m.y * 0.25 - ref.current.rotation.x) * 0.04;
      ref.current.rotation.z += (-m.x * 0.15 - ref.current.rotation.z) * 0.04;
    }

    if (focusTarget.current && focusFrom.current) {
      focusT.current = Math.min(1, focusT.current + dt * 0.8);
      const e = 1 - Math.pow(1 - focusT.current, 3);
      camera.position.lerpVectors(focusFrom.current, focusTarget.current, e);
      if (focusT.current >= 1) {
        focusTarget.current = null;
        focusFrom.current = null;
      }
    }
  });

  const onDouble = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const p: THREE.Vector3 = e.point.clone();
    const dir = p.clone().normalize().multiplyScalar(2.5);
    focusFrom.current = camera.position.clone();
    focusTarget.current = p.clone().add(dir);
    focusT.current = 0;
  };

  const pointSize = perf === "low" ? 0.02 : perf === "medium" ? 0.017 : 0.015;

  return (
    <points ref={ref} onDoubleClick={onDouble}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        transparent
      />
    </points>
  );
}

/**
 * Deep-space backdrop: a slowly drifting star shell that surrounds the galaxy
 * so the scene reads as "inside space", not a floating disc.
 */
function DeepStars({ reduced, perf }: { reduced: boolean; perf: "high" | "medium" | "low" }) {
  const ref = useRef<THREE.Group>(null);
  const count = perf === "low" ? 1200 : perf === "medium" ? 3000 : 6000;

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * (reduced ? 0.002 : 0.008);
    ref.current.rotation.x += dt * (reduced ? 0.001 : 0.003);
  });

  return (
    <group ref={ref}>
      <Stars
        radius={70}
        depth={45}
        count={count}
        factor={3.4}
        saturation={0}
        fade
        speed={reduced ? 0.2 : 1}
      />
    </group>
  );
}

/** Comets: a few bright points sweeping past the galaxy on long orbits. */
function Comets({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        r: 9 + i * 2.4,
        speed: 0.16 + Math.random() * 0.18,
        tilt: (Math.random() - 0.5) * 1.2,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * (reduced ? 0.35 : 1);
    seeds.forEach((s, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const a = s.phase + t * s.speed;
      mesh.position.set(
        Math.cos(a) * s.r,
        Math.sin(a * 0.7) * s.r * 0.25 + s.tilt,
        Math.sin(a) * s.r,
      );
    });
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
        >
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

export function Galaxy({ onReady }: { onReady?: () => void }) {
  const reduced = useReducedMotion();
  const perf = usePerfMode();
  const dprMax = perf === "low" ? 1 : perf === "medium" ? 1.5 : 2;

  return (
    <Canvas
      camera={{ position: [0, 3, 8], fov: 60 }}
      style={{ background: "transparent", touchAction: "none" }}
      dpr={[1, dprMax]}
      gl={{ powerPreference: "high-performance", antialias: perf === "high" }}
    >
      <ambientLight intensity={0.4} />
      <DeepStars reduced={reduced} perf={perf} />
      {perf !== "low" && <Comets reduced={reduced} />}
      <GalaxyPoints reduced={reduced} perf={perf} onReady={onReady} />
      <CoreBloom reduced={reduced} />

      {/*
        OrbitControls provides:
        - Swipe inertia via enableDamping + high dampingFactor (rotation glides after release)
        - Pinch-to-zoom on touch via TOUCH.DOLLY_PAN mapping (two-finger pinch)
        - Single-finger rotate via TOUCH.ROTATE
      */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.12}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        enableZoom
        enablePan={false}
        minDistance={2}
        maxDistance={20}
        autoRotate={!reduced}
        autoRotateSpeed={0.3}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />
    </Canvas>
  );
}
