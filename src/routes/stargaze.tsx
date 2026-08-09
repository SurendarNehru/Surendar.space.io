import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useState } from "react";

const Galaxy = lazy(() =>
  import("../components/Galaxy").then((m) => ({ default: m.Galaxy })),
);

export const Route = createFileRoute("/stargaze")({
  head: () => ({
    meta: [
      { title: "Stargaze — Surendar" },
      {
        name: "description",
        content:
          "An interactive 3D galaxy with tens of thousands of particles. Drag to orbit, pinch to zoom, double-click a star to focus.",
      },
      { property: "og:title", content: "Stargaze — Surendar" },
      {
        property: "og:description",
        content:
          "Interactive 3D galaxy — drag to orbit, pinch to zoom, double-click to focus.",
      },
    ],
  }),
  component: Stargaze,
});

function LoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#050508] transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border border-white/15" />
        <div className="absolute inset-0 animate-spin rounded-full border-t border-white/70" />
      </div>
      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
        Initializing galaxy
      </p>
    </div>
  );
}

function Stargaze() {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div className="relative -mt-20 h-screen w-full animate-[fadeIn_700ms_ease-out_both]">
      <Suspense fallback={<LoadingOverlay visible />}>
        <Galaxy onReady={handleReady} />
      </Suspense>
      <LoadingOverlay visible={!ready} />
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Stargaze
        </p>
        <p className="text-sm text-white/50">
          Drag to orbit · Pinch to zoom · Double-click a star to focus
        </p>
      </div>
    </div>
  );
}
