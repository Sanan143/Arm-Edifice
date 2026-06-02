import { Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center mb-4">
            <img
              src="/logo.png"
              alt="ARM Edifice – the preferred installer"
              className="h-16 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Complete aluminium &amp; facade solutions across Karnataka — windows,
            ACP, structural &amp; spider glazing, partitions, curtain walls and
            custom fabrication.
          </p>
          <div className="flex gap-4 mt-6">
            <a
              href="https://www.instagram.com/arm.edifice?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border/60 text-muted-foreground hover:text-accent hover:border-accent/40 glass transition-smooth"
              title="Follow ARM Edifice on Instagram"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Contact
          </div>
          <ul className="space-y-2 text-sm">
            <li><a href="tel:+919113551616" className="hover:text-accent transition-smooth">+91 91135 51616</a></li>
            <li><a href="tel:+918088543688" className="hover:text-accent transition-smooth">+91 80885 43688</a></li>
            <li className="text-muted-foreground">Pendar Galli, Hubli</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Explore
          </div>
          <ul className="space-y-2 text-sm">
            <li><a href="#services" className="hover:text-accent transition-smooth">Services</a></li>
            <li><a href="#projects" className="hover:text-accent transition-smooth">Projects</a></li>
            <li><a href="#contact" className="hover:text-accent transition-smooth">Get a Quote</a></li>
          </ul>
        </div>
      </div>
      {/* skyline */}
      <svg viewBox="0 0 1440 80" className="w-full block" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0,80 L0,55 L60,55 L60,30 L120,30 L120,50 L180,50 L180,20 L240,20 L240,45 L300,45 L300,35 L360,35 L360,15 L420,15 L420,50 L480,50 L480,25 L540,25 L540,55 L600,55 L600,40 L660,40 L660,20 L720,20 L720,50 L780,50 L780,30 L840,30 L840,55 L900,55 L900,35 L960,35 L960,15 L1020,15 L1020,45 L1080,45 L1080,25 L1140,25 L1140,50 L1200,50 L1200,30 L1260,30 L1260,55 L1320,55 L1320,40 L1380,40 L1380,20 L1440,20 L1440,80 Z"
          fill="oklch(0.22 0.006 265)"
        />
      </svg>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} ARM Edifice. All rights reserved.</span>
            <span>·</span>
            <Link to="/admin" className="hover:text-accent transition-smooth">
              Admin Portal
            </Link>
          </div>
          <div>Crafted for architecture.</div>
        </div>
      </div>
    </footer>
  );
}