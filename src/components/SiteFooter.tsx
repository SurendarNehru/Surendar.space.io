import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/10 px-4 py-8">
      <div
        className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs sm:flex-row"
        style={{ opacity: 0.65 }}
      >
        <p>© 2026 Surendar. All rights reserved.</p>
        <nav className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/about" className="hover:opacity-100" style={{ opacity: 0.9 }}>
            About
          </Link>
          <Link to="/projects" className="hover:opacity-100" style={{ opacity: 0.9 }}>
            Projects
          </Link>
          <Link to="/contact" className="hover:opacity-100" style={{ opacity: 0.9 }}>
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
