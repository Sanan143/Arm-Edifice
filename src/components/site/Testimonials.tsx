import { Star } from "lucide-react";

const items = [
  {
    name: "Ravi Patil",
    role: "Architect, Hubli",
    quote:
      "ARM Edifice delivered our structural glazing two weeks ahead of schedule. The finish on every joint is genuinely surgical.",
  },
  {
    name: "Anita Shenoy",
    role: "Homeowner, Bengaluru",
    quote:
      "We replaced every window in our home with their sliding systems. The acoustic difference alone was worth it.",
  },
  {
    name: "Imran Khan",
    role: "Director, Skyline Builders",
    quote:
      "We've used ARM Edifice across four commercial buildings now. They're the only facade team we trust with a deadline.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-28 lg:py-36 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Trusted by</div>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight">
            Architects, builders and homeowners across Karnataka.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <figure key={t.name} className="glass rounded-xl p-8 flex flex-col">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="text-foreground/90 leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-border">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}