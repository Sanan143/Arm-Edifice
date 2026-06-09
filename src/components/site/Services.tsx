import {
  Building2,
  PanelTop,
  Layers3,
  Square,
  Hexagon,
  DoorClosed,
  Frame,
  Grid3x3,
  Wrench,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: PanelTop,
    title: "Aluminium Windows",
    desc: "Casement, fixed and tilt-turn systems engineered for thermal comfort and silence.",
  },
  {
    icon: Layers3,
    title: "Sliding Systems",
    desc: "Slim-profile sliding windows and doors with smooth, weather-tight performance.",
  },
  {
    icon: Square,
    title: "ACP Sheet Work",
    desc: "High-grade aluminium composite cladding for sharp, modern building facades.",
  },
  {
    icon: Building2,
    title: "Structural Glazing",
    desc: "Frameless, flush facades that make light the dominant material.",
  },
  {
    icon: Hexagon,
    title: "Spider Glazing",
    desc: "Bolted point-fixed glass systems for transparent, sculptural entrances.",
  },
  {
    icon: Grid3x3,
    title: "Office Partitions",
    desc: "Demountable glass partitions that reshape workspaces without compromise.",
  },
  {
    icon: DoorClosed,
    title: "Glass Doors",
    desc: "Toughened sliding, swing and automatic glass doors with premium hardware.",
  },
  {
    icon: Frame,
    title: "Curtain Walls",
    desc: "Unitised and stick-system curtain walls engineered to wind & water tests.",
  },
  {
    icon: Wrench,
    title: "Custom Fabrication",
    desc: "Bespoke aluminium fabrication — railings, louvers, canopies and more.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="silver-dot" />
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground font-medium">
                What We Do
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              A complete aluminium &amp;{" "}
              <span className="text-silver">glass studio</span> under one roof.
            </h2>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm lg:text-right">
            From a single residential window to an entire structural facade — engineered,
            fabricated and installed by one accountable team.
          </p>
        </div>

        {/* Silver divider line */}
        <span className="silver-line block mb-16" />

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="group glass-card rounded-2xl p-7 border border-white/5 card-hover"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Icon halo */}
              <div className="relative mb-6 w-fit">
                <div className="w-12 h-12 rounded-xl bg-secondary/60 border border-white/6 flex items-center justify-center group-hover:border-accent/20 transition-smooth">
                  <Icon className="h-5 w-5 text-accent group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" strokeWidth={1.5} />
                </div>
                {/* Silver glow behind icon */}
                <div className="absolute inset-0 rounded-xl bg-accent/5 blur-md opacity-0 group-hover:opacity-100 transition-smooth" />
              </div>

              <h3 className="text-lg font-semibold tracking-tight mb-2 text-foreground group-hover:text-silver transition-smooth">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>

              {/* Arrow on hover */}
              <div className="mt-5 flex items-center gap-1 text-xs text-muted-foreground/50 group-hover:text-accent transition-smooth">
                <span>Learn more</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-5 glass-card rounded-2xl border border-white/5 px-8 py-6">
          <p className="text-muted-foreground text-sm">
            Not sure what you need? We'll assess your space for free and recommend the right system.
          </p>
          <a
            href="#contact"
            className="shrink-0 relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-silver text-jet font-semibold text-sm hover:shadow-silver transition-smooth animate-shine"
            style={{ color: "var(--jet)" }}
          >
            Book Free Site Visit
          </a>
        </div>
      </div>
    </section>
  );
}
