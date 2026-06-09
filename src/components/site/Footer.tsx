import { Instagram, Phone, MapPin, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

const services = [
  "Aluminium Windows",
  "Sliding Systems",
  "ACP Sheet Work",
  "Structural Glazing",
  "Spider Glazing",
  "Curtain Walls",
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Top silver divider line */}
      <span className="silver-line block" />

      {/* Main footer body */}
      <div className="bg-background relative">
        {/* Subtle top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top, oklch(0.82 0.010 248 / 0.5) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/logo.png"
                  alt="ARM Edifice"
                  className="h-14 w-auto object-contain"
                />
                <div>
                  <div className="text-base font-bold tracking-tight text-silver">
                    ARM Edifice
                  </div>
                  <div className="text-xs text-muted-foreground tracking-wider">
                    Premium Aluminium &amp; Facade Solutions
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Complete aluminium &amp; facade solutions across Karnataka — windows, ACP,
                structural &amp; spider glazing, partitions, curtain walls and custom
                fabrication. Engineered in-house, installed with precision.
              </p>

              {/* Contact quick-links */}
              <ul className="mt-7 space-y-3">
                <li>
                  <a
                    href="tel:+919113551616"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-accent transition-smooth group"
                  >
                    <Phone className="w-3.5 h-3.5 text-accent/50 group-hover:text-accent transition-smooth" />
                    +91 91135 51616 &nbsp;·&nbsp; +91 80885 43688
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919113551616"
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-accent transition-smooth group"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-accent/50 group-hover:text-accent transition-smooth" />
                    Chat on WhatsApp
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-accent/50" />
                  Pendar Galli, Hubli, Karnataka 580023
                </li>
              </ul>

              {/* Social */}
              <div className="flex gap-3 mt-7">
                <a
                  href="https://www.instagram.com/arm.edifice?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg glass border border-white/6 text-muted-foreground hover:text-accent hover:border-accent/30 transition-smooth"
                  aria-label="Follow ARM Edifice on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/919113551616"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center w-9 h-9 rounded-lg glass border border-white/6 text-muted-foreground hover:text-accent hover:border-accent/30 transition-smooth"
                  aria-label="WhatsApp ARM Edifice"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* Services column */}
            <div className="lg:col-span-3">
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground/70 mb-5 flex items-center gap-2">
                <span className="silver-dot" />
                Services
              </div>
              <ul className="space-y-2.5">
                {services.map((s) => (
                  <li key={s}>
                    <a
                      href="/#services"
                      className="text-sm text-muted-foreground hover:text-silver transition-smooth flex items-center gap-2 group"
                    >
                      <span className="w-3 h-px bg-current opacity-0 group-hover:opacity-100 transition-smooth" />
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation column */}
            <div className="lg:col-span-3">
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground/70 mb-5 flex items-center gap-2">
                <span className="silver-dot" />
                Navigate
              </div>
              <ul className="space-y-2.5">
                {[
                  { label: "Home",         href: "/" },
                  { label: "Projects",     href: "/projects" },
                  { label: "Services",     href: "/#services" },
                  { label: "Our Process",  href: "/#process" },
                  { label: "Testimonials", href: "/#testimonials" },
                  { label: "FAQ",          href: "/#faq" },
                  { label: "Get a Quote",  href: "/#contact" },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground hover:text-silver transition-smooth flex items-center gap-2 group"
                    >
                      <span className="w-3 h-px bg-current opacity-0 group-hover:opacity-100 transition-smooth" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Skyline architectural SVG */}
        <svg
          viewBox="0 0 1440 80"
          className="w-full block"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="skylineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="oklch(0.18 0.006 260)" />
              <stop offset="1" stopColor="oklch(0.09 0.004 262)" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 L0,55 L60,55 L60,30 L120,30 L120,50 L180,50 L180,20 L240,20 L240,45 L300,45 L300,35 L360,35 L360,15 L420,15 L420,50 L480,50 L480,25 L540,25 L540,55 L600,55 L600,40 L660,40 L660,20 L720,20 L720,50 L780,50 L780,30 L840,30 L840,55 L900,55 L900,35 L960,35 L960,15 L1020,15 L1020,45 L1080,45 L1080,25 L1140,25 L1140,50 L1200,50 L1200,30 L1260,30 L1260,55 L1320,55 L1320,40 L1380,40 L1380,20 L1440,20 L1440,80 Z"
            fill="url(#skylineGrad)"
            opacity="0.5"
          />
        </svg>

        {/* Bottom bar */}
        <div
          style={{ background: "oklch(0.06 0.003 260)" }}
          className="border-t border-white/4"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground/60">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>© {new Date().getFullYear()} ARM Edifice. All rights reserved.</span>
              <span className="opacity-40">·</span>
              <Link
                to="/admin"
                className="hover:text-accent transition-smooth"
              >
                Admin Portal
              </Link>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="silver-dot" style={{ width: 4, height: 4 }} />
              Crafted for architecture in Karnataka.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
