import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Instagram } from "lucide-react";

type NavLink =
  | { label: string; href: string; route?: undefined }
  | { label: string; route: string; href?: undefined };

const links: NavLink[] = [
  { label: "Services", href: "/#services" },
  { label: "Visualizer", href: "/#visualizer" },
  { label: "Projects", route: "/projects" },
  { label: "Process", href: "/#process" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-smooth ${
        scrolled ? "glass-strong" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img
            src="/logo.png"
            alt="ARM Edifice – the preferred installer"
            className="h-14 w-auto object-contain drop-shadow-sm group-hover:opacity-90 transition-opacity"
          />
          <span className="site-title ml-2" aria-hidden="true">ARM Edifice</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) =>
            l.route ? (
              <Link
                key={l.label}
                to={l.route}
                className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://www.instagram.com/arm.edifice?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-md border border-border/80 text-muted-foreground hover:text-accent hover:border-accent/40 glass transition-smooth"
            title="Follow us on Instagram"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="w-4.5 h-4.5" />
          </a>
          <a
            href="https://wa.me/919113551616?text=Hi%20ARM%20Edifice%2C%20I%20need%20a%20quotation%20for%20aluminium%20work."
            target="_blank"
            rel="noopener"
            className="text-sm px-5 py-2.5 rounded-md bg-gradient-silver text-jet font-medium hover:opacity-90 transition-smooth"
            style={{ color: "var(--jet)" }}
          >
            Get Free Quote
          </a>
        </div>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-border">
          <div className="px-6 py-6 flex flex-col gap-4">
            {links.map((l) =>
              l.route ? (
                <Link
                  key={l.label}
                  to={l.route}
                  onClick={() => setOpen(false)}
                  className="text-base text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </a>
              ),
            )}
            <div className="mt-2 flex flex-col gap-3">
              <a
                href="https://www.instagram.com/arm.edifice?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-md border border-border text-muted-foreground hover:text-accent hover:border-accent/40 glass font-medium text-center"
              >
                <Instagram className="w-5 h-5" />
                <span>Follow us on Instagram</span>
              </a>
              <a
                href="https://wa.me/919113551616"
                className="px-5 py-3 rounded-md bg-gradient-silver text-jet font-medium text-center"
                style={{ color: "var(--jet)" }}
              >
                Get Free Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}