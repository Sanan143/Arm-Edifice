import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Instagram } from "lucide-react";

type NavLink =
  | { label: string; href: string; route?: undefined }
  | { label: string; route: string; href?: undefined };

const links: NavLink[] = [
  { label: "Services",      href: "/#services" },
  { label: "Visualizer",   href: "/#visualizer" },
  { label: "Projects",     route: "/projects" },
  { label: "Process",      href: "/#process" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ",          href: "/#faq" },
  { label: "Contact",      href: "/#contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-elegant py-0"
          : "bg-transparent py-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/logo.png"
            alt="ARM Edifice"
            className="h-12 w-auto object-contain group-hover:opacity-85 transition-opacity"
          />
          <span
            className="hidden sm:block text-sm font-semibold tracking-[0.06em] text-silver"
          >
            ARM Edifice
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) =>
            l.route ? (
              <Link
                key={l.label}
                to={l.route}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-smooth group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-silver group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-smooth group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-silver group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            ),
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://www.instagram.com/arm.edifice"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/8 text-muted-foreground hover:text-accent hover:border-accent/30 glass transition-smooth"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/919113551616?text=Hi%20ARM%20Edifice%2C%20I%20need%20a%20quotation%20for%20aluminium%20work."
            target="_blank"
            rel="noopener"
            className="relative overflow-hidden text-sm px-5 py-2.5 rounded-lg bg-gradient-silver text-jet font-semibold hover:shadow-silver transition-smooth animate-shine"
            style={{ color: "var(--jet)" }}
          >
            Get Free Quote
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg glass border border-white/8 text-foreground hover:text-accent transition-smooth"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed left-0 right-0 top-[72px] border-b border-white/6 transition-all duration-350 ease-out z-40 ${
          open
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-3 invisible pointer-events-none"
        }`}
        style={{ background: "oklch(0.07 0.003 260 / 0.97)", backdropFilter: "blur(24px)" }}
      >
        <div className="px-6 py-8 flex flex-col gap-1 max-h-[calc(100svh-72px)] overflow-y-auto">
          {links.map((l) =>
            l.route ? (
              <Link
                key={l.label}
                to={l.route}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground py-3 border-b border-white/4 last:border-0 transition-smooth"
              >
                <span className="silver-dot opacity-0 group-hover:opacity-100" />
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground py-3 border-b border-white/4 last:border-0 transition-smooth"
              >
                {l.label}
              </a>
            ),
          )}
          <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-white/6">
            <a
              href="https://www.instagram.com/arm.edifice"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl glass border border-white/8 text-muted-foreground hover:text-accent hover:border-accent/30 font-medium transition-smooth"
            >
              <Instagram className="w-5 h-5" />
              Follow on Instagram
            </a>
            <a
              href="https://wa.me/919113551616"
              className="py-3.5 rounded-xl bg-gradient-silver text-jet font-semibold text-center hover:shadow-silver transition-smooth"
              style={{ color: "var(--jet)" }}
            >
              Get Free Quote
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
