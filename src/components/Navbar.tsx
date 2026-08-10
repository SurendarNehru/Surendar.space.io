import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  User,
  Code2,
  Rss,
  Mail,
  Star,
  Sun,
  Moon,
  SunMoon,
  Lock,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useSkyTheme } from "./ThemeProvider";
import { siteContentQueryOptions } from "@/lib/content.functions";

const baseLinks: { to: string; key: string; label: string; icon: LucideIcon }[] = [
  { to: "/", key: "nav_home", label: "Home", icon: Home },
  { to: "/about", key: "nav_about", label: "About", icon: User },
  { to: "/projects", key: "nav_projects", label: "Projects", icon: Code2 },
  { to: "/blog", key: "nav_blog", label: "Blog", icon: Rss },
  { to: "/contact", key: "nav_contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const { mode, theme, toggle } = useSkyTheme();
  const { data: content } = useQuery(siteContentQueryOptions);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const label = (key: string, fallback: string) => {
    const v = content?.[key];
    return v && v.trim().length > 0 ? v : fallback;
  };

  const links = [
    ...baseLinks,
    theme === "day"
      ? { to: "/skyview", key: "nav_skyview", label: "Skyview", icon: Sun }
      : { to: "/stargaze", key: "nav_stargaze", label: "Stargaze", icon: Star },
    { to: "/admin", key: "nav_admin", label: "Admin", icon: Lock },
  ].map((l) => ({ ...l, label: label(l.key, l.label) }));

  return (
    <header className="sticky inset-x-0 top-0 z-50">
      {/* Desktop & Main Header bar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        {/* Mobile brand header item (shown on mobile screens) */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-white sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-xs tracking-wider backdrop-blur-md">
            S
          </span>
          <span className="text-sm font-medium tracking-tight">Surendar</span>
        </Link>

        {/* Desktop navigation pills */}
        <div className="hidden min-w-0 flex-1 overflow-x-auto sm:block [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-1.5 backdrop-blur-xl sm:mx-auto sm:gap-2 sm:px-4 sm:py-2">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.to} className="shrink-0">
                  <Link
                    to={l.to}
                    activeOptions={{ exact: l.to === "/" }}
                    activeProps={{
                      className:
                        "text-white bg-white/15 border-white/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                    }}
                    inactiveProps={{ className: "text-white/60 border-transparent" }}
                    className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors hover:text-white active:bg-white/10 sm:gap-2 sm:text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Action buttons (Theme toggle & Mobile menu trigger) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            title={
              mode === "auto"
                ? "Auto (follows your local time)"
                : mode === "day"
                  ? "Daytime"
                  : "Night"
            }
            aria-label={`Sky mode: ${mode}. Click to change.`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur-xl transition-colors hover:border-white/30 hover:text-white sm:h-11 sm:w-11"
          >
            {mode === "auto" ? (
              <SunMoon className="h-4 w-4" />
            ) : mode === "day" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile hamburger toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-xl transition-colors hover:border-white/30 hover:text-white sm:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mx-4 mb-4 rounded-2xl border border-white/15 bg-[#0a0a14]/95 p-3 backdrop-blur-2xl shadow-2xl transition-all sm:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    activeOptions={{ exact: l.to === "/" }}
                    onClick={() => setMobileMenuOpen(false)}
                    activeProps={{
                      className: "text-white bg-white/15 border-white/25 font-semibold",
                    }}
                    inactiveProps={{ className: "text-white/70 border-transparent hover:bg-white/5" }}
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-white/80" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

