import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, Component, type ReactNode } from "react";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { Starfield } from "../components/Starfield";
import { Navbar } from "../components/Navbar";
import { DaySky } from "../components/DaySky";
import { SkyThemeProvider, useSkyTheme } from "../components/ThemeProvider";
import { SiteStyle } from "../components/SiteStyle";
import { SiteFooter } from "../components/SiteFooter";

const GalaxyBackdrop = lazy(() =>
  import("../components/GalaxyBackdrop").then((m) => ({ default: m.GalaxyBackdrop })),
);

class SafeBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("Component render error caught:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white/90">Lost in space</h2>
        <p className="mt-2 text-sm text-white/60">
          This coordinate doesn't exist in the known universe.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-white">This page didn't load</h1>
        <p className="mt-2 text-sm text-white/60">
          Something went wrong. Try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Surendar — Full Stack Developer" },
      {
        name: "description",
        content:
          "Surendar is a full stack developer crafting elegant, animated space-inspired web experiences.",
      },
      { property: "og:title", content: "Surendar — Full Stack Developer" },
      {
        property: "og:description",
        content:
          "Portfolio of Surendar — full stack developer, animated space-themed interfaces, and a live 3D galaxy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://db.onlinewebfonts.com/c/b440614f80c8a8abc990ba341ae9ddf0?family=CS+Antlia+Demo",
      },
      {
        rel: "stylesheet",
        href: "https://db.onlinewebfonts.com/c/762a9bb65368774a2ee6737334b50151?family=CS+Robert+Demo",
      },
      {
        rel: "stylesheet",
        href: "https://db.onlinewebfonts.com/c/e3badf656b90773d2c9f499d64b8a015?family=CS+Robert+Mono+Demo",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function SkyBackground({ dim }: { dim: boolean }) {
  const { theme } = useSkyTheme();
  return theme === "day" ? <DaySky dim={dim} /> : <Starfield dim={dim} />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onStargaze = pathname.startsWith("/stargaze") || pathname.startsWith("/skyview");
  return (
    <QueryClientProvider client={queryClient}>
      <SkyThemeProvider>
        <SiteStyle />
        <SkyBackground dim={onStargaze} />
        {!onStargaze && (
          <SafeBoundary>
            <Suspense fallback={null}>
              <GalaxyBackdrop />
            </Suspense>
          </SafeBoundary>
        )}
        <Navbar />
        <main className="relative z-10">
          <SafeBoundary>
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </SafeBoundary>
        </main>
        {!onStargaze && <SiteFooter />}
      </SkyThemeProvider>
    </QueryClientProvider>
  );
}
