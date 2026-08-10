import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
<<<<<<< HEAD
    <footer className="relative z-10 mt-12 sm:mt-24 border-t border-white/10 px-4 py-6 sm:py-8">
      <div
        className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs sm:flex-row"
        style={{ opacity: 0.65 }}
      >
        <p>© 2026 Surendar. All rights reserved.</p>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link to="/about" className="py-1 hover:opacity-100" style={{ opacity: 0.9 }}>
            About
          </Link>
          <Link to="/projects" className="py-1 hover:opacity-100" style={{ opacity: 0.9 }}>
            Projects
          </Link>
          <Link to="/contact" className="py-1 hover:opacity-100" style={{ opacity: 0.9 }}>
=======
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
>>>>>>> ff8c7d592c716ee34ce90be01f9302b4ea4f9dba
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
