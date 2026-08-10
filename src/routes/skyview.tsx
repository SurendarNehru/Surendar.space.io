import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useState } from "react";

const SkyScene = lazy(() =>
  import("../components/SkyScene").then((m) => ({ default: m.SkyScene })),
);

export const Route = createFileRoute("/skyview")({
  head: () => ({
    meta: [
      { title: "Skyview — Surendar" },
      {
        name: "description",
        content:
          "A living daytime sky: drifting clouds, a radiant sun and gliding birds. Drag to pan, pinch to zoom.",
      },
      { property: "og:title", content: "Skyview — Surendar" },
      {
        property: "og:description",
        content: "Interactive daytime sky — drag to pan, pinch to zoom, sun and clouds in motion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Skyview,
});

function LoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#bcdcf4] transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border border-[#0b2545]/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-t border-[#0b2545]/70" />
      </div>
      <p className="text-xs uppercase tracking-[0.35em] text-[#0b2545]/70">
        Clearing the sky
      </p>
    </div>
  );
}

function Skyview() {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div className="relative -mt-20 h-[100dvh] w-full overflow-hidden animate-[fadeIn_700ms_ease-out_both]">
      <Suspense fallback={<LoadingOverlay visible />}>
        <SkyScene onReady={handleReady} />
      </Suspense>
      <LoadingOverlay visible={!ready} />
      <div className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-8 flex flex-col items-center gap-1.5 px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#0b2545]/70">
          Skyview
        </p>
        <p className="text-xs text-[#0b2545]/60 sm:text-sm">
          Drag to pan · Pinch to zoom · Move to shift the light
        </p>
      </div>
    </div>
  );
}
