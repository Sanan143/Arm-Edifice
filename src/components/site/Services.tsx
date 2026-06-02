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
} from "lucide-react";

const services = [
  { icon: PanelTop, title: "Aluminium Windows", desc: "Casement, fixed and tilt-turn systems engineered for thermal comfort and silence." },
  { icon: Layers3, title: "Sliding Systems", desc: "Slim-profile sliding windows and doors with smooth, weather-tight performance." },
  { icon: Square, title: "ACP Sheet Work", desc: "High-grade aluminium composite cladding for sharp, modern building facades." },
  { icon: Building2, title: "Structural Glazing", desc: "Frameless, flush facades that make light the dominant material." },
  { icon: Hexagon, title: "Spider Glazing", desc: "Bolted point-fixed glass systems for transparent, sculptural entrances." },
  { icon: Grid3x3, title: "Office Partitions", desc: "Demountable glass partitions that reshape workspaces without compromise." },
  { icon: DoorClosed, title: "Glass Doors", desc: "Toughened sliding, swing and automatic glass doors with premium hardware." },
  { icon: Frame, title: "Curtain Walls", desc: "Unitised and stick-system curtain walls engineered to wind & water tests." },
  { icon: Wrench, title: "Custom Fabrication", desc: "Bespoke aluminium fabrication — railings, louvers, canopies and more." },
];

export function Services() {
  return (
    <section id="services" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">
            What We Do
          </div>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight">
            A complete aluminium &amp; glass studio under one roof.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg">
            From a single residential window to an entire structural facade —
            engineered, fabricated and installed by one accountable team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-xl overflow-hidden">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative bg-card p-8 lg:p-10 transition-smooth hover:bg-secondary"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
              <div className="h-12 w-12 rounded-md glass flex items-center justify-center mb-6 group-hover:shadow-glow transition-smooth">
                <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}