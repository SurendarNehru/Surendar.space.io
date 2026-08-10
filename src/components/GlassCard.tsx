import { useRef, type ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
<<<<<<< HEAD
    if (e.pointerType === "touch") return;
=======
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      data-glass=""
      onPointerMove={onMove}

      onPointerLeave={onLeave}
<<<<<<< HEAD
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/60 p-5 sm:p-8 backdrop-blur-xl transition-[transform,border-color] duration-300 ease-out hover:border-white/25 will-change-transform ${className}`}
=======
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/60 p-8 backdrop-blur-xl transition-[transform,border-color] duration-300 ease-out hover:border-white/25 will-change-transform ${className}`}
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
