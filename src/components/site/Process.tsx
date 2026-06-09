import { MessageSquare, DraftingCompass, Wrench, Building2 } from "lucide-react";

const steps = [
  {
    n: "01",
    t: "Consult",
    d: "Free site visit, measurements and design conversation with our senior engineer.",
    icon: MessageSquare,
  },
  {
    n: "02",
    t: "Design",
    d: "Shop drawings, material spec and a fully transparent fixed-price quote.",
    icon: DraftingCompass,
  },
  {
    n: "03",
    t: "Fabricate",
    d: "In-house precision fabrication with quality checks at every production stage.",
    icon: Wrench,
  },
  {
    n: "04",
    t: "Install",
    d: "Clean, on-schedule installation with full handover documentation and warranty.",
    icon: Building2,
  },
];

export function Process() {
  return (
    <section id="process" className="relative py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-10 mb-20">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="silver-dot" />
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground font-medium">
                Process
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Four steps,{" "}
              <span className="text-silver">no surprises.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-center">
            <p className="text-muted-foreground text-base leading-relaxed lg:text-lg">
              We treat aluminium and glass like architecture, not joinery — every project follows
              the same disciplined path from consultation to handover.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
          {/* Connecting line — desktop only */}
          <div className="absolute hidden lg:block top-12 left-[12.5%] right-[12.5%] h-px">
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.82 0.010 248 / 0.25) 20%, oklch(0.82 0.010 248 / 0.25) 80%, transparent)",
              }}
            />
          </div>

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="relative glass-card rounded-2xl border border-white/5 p-7 card-hover group"
              >
                {/* Step number and icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-bold font-display text-accent/10 group-hover:text-accent/25 transition-smooth select-none">
                    {s.n}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-secondary/40 border border-white/6 flex items-center justify-center text-accent group-hover:border-accent/30 group-hover:scale-105 transition-smooth relative shrink-0">
                    <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-xl bg-accent/5 blur-md opacity-0 group-hover:opacity-100 transition-smooth" />
                  </div>
                </div>

                {/* Connector dot for the line — desktop */}
                {i < steps.length - 1 && (
                  <div className="absolute hidden lg:block top-[50px] -right-2 w-4 h-px bg-gradient-to-r from-transparent to-accent/20" />
                )}

                <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-silver transition-smooth">
                  {s.t}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom assurance bar */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "5-Year Warranty", desc: "On all frames and hardware" },
            { label: "Fixed-Price Quote", desc: "No hidden costs, ever" },
            { label: "On-Time Delivery", desc: "Guaranteed completion schedule" },
          ].map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-4 glass-card border border-white/5 rounded-xl px-6 py-4"
            >
              <div className="silver-dot shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">{a.label}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
