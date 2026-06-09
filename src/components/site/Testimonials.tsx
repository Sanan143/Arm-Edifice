import { Star, Quote } from "lucide-react";

const items = [
  {
    name: "Ravi Patil",
    role: "Architect, Hubli",
    company: "Patil & Associates",
    quote:
      "ARM Edifice delivered our structural glazing two weeks ahead of schedule. The finish on every joint is genuinely surgical — we've recommended them to six clients since.",
  },
  {
    name: "Anita Shenoy",
    role: "Homeowner, Bengaluru",
    company: "Residential Project",
    quote:
      "We replaced every window in our home with their sliding systems. The acoustic difference alone was worth every rupee, and the installation team was spotlessly professional.",
  },
  {
    name: "Imran Khan",
    role: "Director",
    company: "Skyline Builders",
    quote:
      "We've used ARM Edifice across four commercial buildings now. They're the only facade team we trust with a fixed deadline and a demanding client.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="silver-dot" />
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground font-medium">
                Trusted By
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Architects, builders and homeowners{" "}
              <span className="text-silver">across Karnataka.</span>
            </h2>
          </div>
          {/* Rating summary badge */}
          <div className="flex items-center gap-3 glass-card border border-white/5 rounded-xl px-5 py-3.5 shrink-0">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">5.0 / 5.0</div>
              <div className="text-xs text-muted-foreground">100+ verified reviews</div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <figure
              key={t.name}
              className="glass-card rounded-2xl border border-white/5 p-8 flex flex-col card-hover group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>

              {/* Large quote mark */}
              <Quote
                className="w-8 h-8 text-accent/20 mb-4 group-hover:text-accent/30 transition-smooth"
                strokeWidth={1}
              />

              {/* Quote text */}
              <blockquote className="text-foreground/85 leading-relaxed flex-1 text-[15px]">
                "{t.quote}"
              </blockquote>

              {/* Divider */}
              <span className="silver-line block my-6" />

              {/* Author */}
              <figcaption className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-secondary border border-white/6 flex items-center justify-center text-sm font-bold text-silver shrink-0"
                  aria-hidden
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
