import heroImg from "@/assets/hero-facade.jpg";
import projectAcp from "@/assets/project-acp.jpg";
import projectOffice from "@/assets/project-office.jpg";
import projectSpider from "@/assets/project-spider.jpg";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Zap, Award, Clock, Shield } from "lucide-react";

/* ── Animated count-up ── */
function useCountUp(target: number, start: boolean, duration = 2200) {
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

function StatCard({
  value,
  suffix,
  label,
  icon: Icon,
  delay,
}: {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.3,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const n = useCountUp(value, seen);

  return (
    <div
      ref={ref}
      className="group flex flex-col items-center text-center px-4 py-3"
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon className="w-4 h-4 text-accent/60 mb-1.5 group-hover:text-accent transition-smooth" />
      <div className="text-2xl lg:text-3xl font-bold text-silver font-display">
        {n}
        {suffix}
      </div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60 mt-1">
        {label}
      </div>
    </div>
  );
}

/* ── Rotating mini gallery ── */
const galleryImgs = [
  { src: heroImg,      label: "Commercial Facade",  tag: "Structural" },
  { src: projectAcp,   label: "ACP Cladding",       tag: "ACP" },
  { src: projectOffice,label: "Office Partition",   tag: "Interior" },
  { src: projectSpider,label: "Spider Glazing",     tag: "Glazing" },
];

function GalleryStack() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % galleryImgs.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-full select-none">
      {galleryImgs.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            opacity: i === active ? 1 : 0,
            transform: i === active ? "scale(1.00)" : "scale(1.03)",
          }}
        >
          <img
            src={img.src}
            alt={img.label}
            className="h-full w-full object-cover"
          />
          {/* Silver overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

          {/* Label badge */}
          <div className="absolute bottom-5 left-5 flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/20 border border-accent/30 text-silver backdrop-blur-sm">
              {img.tag}
            </span>
            <span className="text-xs text-white/70 font-medium">{img.label}</span>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-5 right-5 flex gap-1.5">
        {galleryImgs.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-silver" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Floating particle dots (CSS-only) ── */
function Particles() {
  const dots = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {dots.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const dur = Math.random() * 12 + 8;
        const delay = Math.random() * 6;
        const opacity = Math.random() * 0.35 + 0.08;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              background: `oklch(0.82 0.010 248 / ${opacity})`,
              boxShadow: `0 0 ${size * 3}px oklch(0.82 0.010 248 / ${opacity * 0.8})`,
              animation: `particle-float ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Animated headline words ── */
const words = ["Windows.", "Facades.", "Glazing.", "Spaces."];

function TypeCycler() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setIdx((v) => (v + 1) % words.length);
        setVisible(true);
      }, 400);
    };
    const id = setInterval(cycle, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-silver block transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {words[idx]}
    </span>
  );
}

/* ── HERO COMPONENT ── */
export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* ── Global floating particles ── */}
      <Particles />

      {/* ── Blueprint grid — more visible ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(1 0 0 / 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(1 0 0 / 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* ── Top center silver halo ── */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, oklch(0.82 0.010 248 / 0.15) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Left edge vertical silver streak ── */}
      <div
        className="absolute top-0 left-0 w-px h-full pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, oklch(0.82 0.010 248 / 0.5) 40%, oklch(0.82 0.010 248 / 0.5) 60%, transparent)",
        }}
      />

      {/* ──────────────────────────────
           MAIN SPLIT LAYOUT
      ────────────────────────────── */}
      <div className="flex-1 grid lg:grid-cols-2 relative z-10">

        {/* LEFT — Content */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 pt-36 pb-16 lg:pt-28 lg:pb-12">

          {/* Top badge */}
          <div
            className="animate-fade-up mb-8 flex items-center gap-3"
            style={{ animationDelay: "0s" }}
          >
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] border"
              style={{
                background: "oklch(0.82 0.010 248 / 0.07)",
                borderColor: "oklch(0.82 0.010 248 / 0.20)",
                color: "oklch(0.82 0.010 248)",
              }}
            >
              <Zap className="w-3 h-3" strokeWidth={2.5} />
              Karnataka's #1 Aluminium Studio
            </div>
          </div>

          {/* Headline — large & bold */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.08s" }}
          >
            <h1 className="font-bold tracking-tight leading-[1.0]">
              {/* Line 1 — huge */}
              <span
                className="block text-foreground"
                style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
              >
                Premium
              </span>
              {/* Line 2 — cycling word */}
              <span
                className="block"
                style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
              >
                <TypeCycler />
              </span>
              {/* Line 3 — smaller */}
              <span
                className="block text-foreground/50 font-light"
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)", marginTop: "0.15em" }}
              >
                engineered to perfection.
              </span>
            </h1>
          </div>

          {/* Thin silver line divider */}
          <div
            className="animate-fade-up my-8 h-px w-24"
            style={{
              animationDelay: "0.18s",
              background: "linear-gradient(90deg, oklch(0.82 0.010 248), transparent)",
            }}
          />

          {/* Sub copy */}
          <div className="animate-fade-up" style={{ animationDelay: "0.22s" }}>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-md">
              Windows · ACP Cladding · Structural &amp; Spider Glazing · Curtain Walls ·
              Partitions — all designed, fabricated and installed in-house across Karnataka.
            </p>
          </div>

          {/* CTA row */}
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Primary CTA */}
            <a
              href="#contact"
              className="group relative overflow-hidden inline-flex items-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-sm transition-smooth"
              style={{
                background: "linear-gradient(135deg, oklch(0.92 0.008 248) 0%, oklch(0.75 0.012 248) 100%)",
                color: "oklch(0.07 0.003 260)",
                boxShadow: "0 0 40px -8px oklch(0.82 0.010 248 / 0.40), 0 8px 24px -8px rgba(0,0,0,0.5)",
              }}
            >
              {/* Shimmer */}
              <span
                className="absolute inset-0 translate-x-[-100%] skew-x-[-20deg] group-hover:translate-x-[220%] transition-transform duration-700 ease-out"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
              />
              Get Free Quote
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919113551616?text=Hi%20ARM%20Edifice%2C%20I%20need%20a%20quotation."
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-2.5 px-6 py-4 rounded-xl font-medium text-sm border transition-smooth hover:border-green-500/40 hover:text-green-400"
              style={{
                background: "oklch(0.10 0.004 265 / 0.5)",
                borderColor: "oklch(1 0 0 / 0.08)",
                backdropFilter: "blur(12px)",
                color: "oklch(0.80 0 0)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500 group-hover:text-green-400">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Now
            </a>
          </div>

          {/* Trust mini-row */}
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-5"
            style={{ animationDelay: "0.38s" }}
          >
            {[
              { icon: Shield,  text: "5-Year Warranty" },
              { icon: Clock,   text: "24hr Response" },
              { icon: Award,   text: "500+ Projects" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground/70">
                <Icon className="w-3.5 h-3.5 text-accent/60" strokeWidth={1.5} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Gallery panel */}
        <div className="hidden lg:flex relative flex-col">
          {/* Full-height image gallery */}
          <div className="relative flex-1 mt-0 overflow-hidden">
            {/* Top & left inner borders */}
            <div
              className="absolute top-0 left-0 w-px h-full z-10"
              style={{ background: "linear-gradient(to bottom, transparent, oklch(0.82 0.010 248 / 0.15) 30%, oklch(0.82 0.010 248 / 0.15) 70%, transparent)" }}
            />
            <GalleryStack />

            {/* Silver corner accents */}
            <div className="absolute top-6 right-6 z-20 pointer-events-none">
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
                <path d="M0,0 L40,0 L40,40" fill="none" stroke="oklch(0.82 0.010 248 / 0.5)" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
                <path d="M40,40 L0,40 L0,0" fill="none" stroke="oklch(0.82 0.010 248 / 0.5)" strokeWidth="1" />
              </svg>
            </div>

            {/* Floating badge over image */}
            <div
              className="absolute top-8 left-8 z-20 flex flex-col gap-2"
              style={{ animation: "float 6s ease-in-out infinite" }}
            >
              <div
                className="px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "oklch(0.07 0.003 260 / 0.85)",
                  border: "1px solid oklch(0.82 0.010 248 / 0.20)",
                  backdropFilter: "blur(16px)",
                  color: "oklch(0.94 0.005 250)",
                }}
              >
                <div className="text-xs text-muted-foreground mb-0.5">Latest Project</div>
                <div className="text-sm font-bold text-silver">Structural Glazing</div>
                <div className="text-[11px] text-muted-foreground">Bengaluru · 2025</div>
              </div>
            </div>
          </div>

          {/* Bottom mini strip — 3 quick stat pills */}
          <div
            className="grid grid-cols-4 border-t"
            style={{ borderColor: "oklch(1 0 0 / 0.06)", background: "oklch(0.08 0.003 260)" }}
          >
            <StatCard value={500} suffix="+"  label="Projects"   icon={Award}  delay={0.4} />
            <StatCard value={10}  suffix="yr" label="Experience" icon={Shield} delay={0.5} />
            <StatCard value={100} suffix="+"  label="Clients"    icon={Zap}    delay={0.6} />
            <StatCard value={24}  suffix="/7" label="Support"    icon={Clock}  delay={0.7} />
          </div>
        </div>
      </div>

      {/* ── Mobile stats bar ── */}
      <div
        className="lg:hidden border-t grid grid-cols-4"
        style={{ borderColor: "oklch(1 0 0 / 0.06)", background: "oklch(0.08 0.003 260)" }}
      >
        <StatCard value={500} suffix="+" label="Projects"   icon={Award}  delay={0} />
        <StatCard value={10}  suffix="yr" label="Experience" icon={Shield} delay={0} />
        <StatCard value={100} suffix="+" label="Clients"    icon={Zap}    delay={0} />
        <StatCard value={24}  suffix="/7" label="Support"    icon={Clock}  delay={0} />
      </div>

      {/* ── Scroll cue ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent/40 to-transparent animate-pulse" />
      </div>

      {/* ── Bottom wave into next section ── */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full hidden lg:block"
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        aria-hidden
        style={{ zIndex: 5 }}
      >
        <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="oklch(0.07 0.003 260)" opacity="0.5" />
      </svg>
    </section>
  );
}
