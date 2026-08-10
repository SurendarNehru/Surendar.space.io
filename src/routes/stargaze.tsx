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
<<<<<<< HEAD
    <div className="relative -mt-20 h-[100dvh] w-full overflow-hidden animate-[fadeIn_700ms_ease-out_both]">
=======
    <div className="relative -mt-20 h-screen w-full animate-[fadeIn_700ms_ease-out_both]">
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
      <Suspense fallback={<LoadingOverlay visible />}>
        <Galaxy onReady={handleReady} />
      </Suspense>
      <LoadingOverlay visible={!ready} />
<<<<<<< HEAD
      <div className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-8 flex flex-col items-center gap-1.5 px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Stargaze
        </p>
        <p className="text-xs text-white/50 sm:text-sm">
=======
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Stargaze
        </p>
        <p className="text-sm text-white/50">
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
          Drag to orbit · Pinch to zoom · Double-click a star to focus
        </p>
      </div>
    </div>
  );
}
