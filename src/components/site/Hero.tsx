import heroImg from "@/assets/hero-facade.jpg";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const n = useCountUp(value, seen);
  return (
    <div ref={ref} className="text-center lg:text-left">
      <div className="text-3xl lg:text-4xl font-semibold tracking-tight text-silver">
        {n}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Modern glass facade tower at dusk — ARM Edifice premium aluminium solutions"
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      {/* animated blueprint SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="blueprint" x1="0" x2="1">
            <stop offset="0" stopColor="oklch(0.72 0.12 235)" stopOpacity="0.6" />
            <stop offset="1" stopColor="oklch(0.86 0.015 240)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#blueprint)"
          strokeWidth="1"
          className="animate-draw"
        >
          <path d="M0,650 L1200,650" />
          <path d="M150,650 L150,200 L450,200 L450,650" />
          <path d="M250,650 L250,350 L350,350 L350,650" />
          <path d="M500,650 L500,150 L800,150 L800,650" />
          <path d="M600,650 L600,250 L700,250 L700,650" />
          <path d="M850,650 L850,300 L1100,300 L1100,650" />
          <path d="M150,400 L800,400" />
          <path d="M500,300 L1100,300" />
        </g>
      </svg>

      {/* floating geometric shape */}
      <div className="absolute top-32 right-12 hidden lg:block animate-float">
        <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
          <polygon
            points="60,5 115,35 115,85 60,115 5,85 5,35"
            fill="none"
            stroke="oklch(0.72 0.12 235 / 0.4)"
            strokeWidth="1"
          />
          <polygon
            points="60,25 95,45 95,75 60,95 25,75 25,45"
            fill="none"
            stroke="oklch(0.86 0.015 240 / 0.3)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-32 pb-20 w-full">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Complete Aluminium &amp; Facade Solutions
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
            Transforming spaces with{" "}
            <span className="text-silver">premium aluminium</span> solutions.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Windows, ACP, partitions, structural &amp; spider glazing, curtain
            walls and complete custom fabrication — engineered for architecture
            that lasts.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="relative overflow-hidden px-7 py-4 rounded-md bg-gradient-silver text-jet font-medium shadow-elegant hover:shadow-glow transition-smooth animate-shine"
              style={{ color: "var(--jet)" }}
            >
              Get Free Quote
            </a>
            <a
              href="#contact"
              className="px-7 py-4 rounded-md glass text-foreground font-medium hover:bg-foreground/5 transition-smooth"
            >
              Request Site Visit
            </a>
            <a
              href="https://wa.me/919113551616?text=Hi%20ARM%20Edifice%2C%20I%20need%20a%20quotation%20for%20aluminium%20work."
              target="_blank"
              rel="noopener"
              className="px-7 py-4 rounded-md border border-border text-foreground font-medium hover:border-accent/60 transition-smooth"
            >
              WhatsApp Now
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl">
            <Stat value={500} suffix="+" label="Projects Delivered" />
            <Stat value={100} suffix="+" label="Happy Clients" />
            <Stat value={10} suffix="+" label="Years Experience" />
            <Stat value={24} suffix="/7" label="Support" />
          </div>
        </div>
      </div>

      {/* wave transition */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,40 C360,80 720,0 1440,40 L1440,80 L0,80 Z"
          fill="oklch(0.14 0.005 270)"
        />
      </svg>
    </section>
  );
}