import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Monitor, RotateCw, Smartphone, ExternalLink } from "lucide-react";

const ROUTES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
];

/**
 * Live, same-origin preview of the site inside the admin console.
 * `reloadSignal` bumps whenever the AI (or a manual edit) changes data,
 * so the operator sees the result before publishing.
 */
export function LivePreview({ reloadSignal = 0 }: { reloadSignal?: number }) {
  const [path, setPath] = useState("/");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [nonce, setNonce] = useState(0);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (reloadSignal > 0) setNonce((n) => n + 1);
  }, [reloadSignal]);

  // Subtle 3D motion: the preview slab tilts a few degrees with the pointer.
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotateX = useTransform(rx, (v) => v);
  const rotateY = useTransform(ry, (v) => v);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 5);
    rx.set(-py * 4);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const src = `${path}${path.includes("?") ? "&" : "?"}preview=${nonce}`;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ROUTES.map((r) => (
            <button
              key={r.path}
              type="button"
              onClick={() => setPath(r.path)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                path === r.path
                  ? "border-white/25 bg-white/15 text-white"
                  : "border-white/10 bg-white/5 text-white/55 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDevice(device === "desktop" ? "mobile" : "desktop")}
          aria-label={`Preview as ${device === "desktop" ? "mobile" : "desktop"}`}
          className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          {device === "desktop" ? (
            <Smartphone className="h-4 w-4" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          aria-label="Refresh preview"
          className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          <RotateCw className="h-4 w-4" />
        </button>
        <a
          href={path}
          target="_blank"
          rel="noreferrer"
          aria-label="Open preview in a new tab"
          className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="flex flex-1 items-start justify-center overflow-hidden p-3 [perspective:1400px]"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
        >
          <iframe
            ref={frameRef}
            key={`${path}-${nonce}`}
            src={src}
            title="Live site preview"
            className={`h-full border-0 bg-transparent ${
              device === "mobile" ? "mx-auto w-[390px] max-w-full" : "w-full"
            }`}
          />
        </motion.div>
      </div>
      <p className="px-4 pb-3 text-[11px] text-white/45">
        Preview reflects saved edits instantly — publish when it looks right.
      </p>
    </div>
  );
}
