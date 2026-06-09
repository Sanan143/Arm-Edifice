import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How much does aluminium window installation cost?",
    a: "Pricing depends on size, glass type and frame system. Most residential windows fall between ₹450 – ₹1,200 per sq ft fully installed. Send us your dimensions and we'll return a precise quote within 24 hours.",
  },
  {
    q: "Do you provide a warranty?",
    a: "Yes — every installation carries a 5-year structural warranty on frames and hardware, plus the manufacturer warranty on glass and accessories. All warranties are documented and transferred with the property.",
  },
  {
    q: "How long does installation take?",
    a: "A typical residential project is completed in 5 – 10 working days from order confirmation. Facade, ACP and curtain-wall projects vary by scope; we provide a detailed, stage-by-stage schedule with every quote.",
  },
  {
    q: "Which areas do you serve?",
    a: "We're based in Hubli and deliver complete installation services across Mysuru, Bengaluru, Mangalore, Hassan and surrounding districts in Karnataka. Outstation work is assessed case-by-case.",
  },
  {
    q: "Do you handle design and drawings?",
    a: "Absolutely. Our in-house team prepares shop drawings, material specifications and 3D previews before any fabrication begins — ensuring zero surprises at installation.",
  },
  {
    q: "Can I visit your workshop or showroom?",
    a: "Yes, we welcome visits to our workshop in Hubli where you can see our fabrication process, touch material samples and meet the team. Call or WhatsApp us to schedule.",
  },
];

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="silver-dot" />
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground font-medium">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Questions, <span className="text-silver">answered.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`glass-card rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-accent/20 shadow-silver" : "border-white/5"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span
                    className={`text-base font-medium transition-smooth ${
                      isOpen ? "text-silver" : "text-foreground/90 group-hover:text-foreground"
                    }`}
                  >
                    {f.q}
                  </span>
                  <span
                    className={`ml-4 shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "border-accent/30 bg-accent/10 text-accent rotate-0"
                        : "border-white/8 text-muted-foreground group-hover:border-accent/20"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm">
                    {f.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 glass-card border border-white/5 rounded-2xl px-7 py-6 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div>
            <div className="text-base font-semibold text-foreground">Still have questions?</div>
            <div className="text-sm text-muted-foreground mt-1">
              Our team responds within 24 hours on WhatsApp or phone.
            </div>
          </div>
          <a
            href="https://wa.me/919113551616?text=Hi%20ARM%20Edifice%2C%20I%20have%20a%20question."
            target="_blank"
            rel="noopener"
            className="shrink-0 relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-silver text-jet font-semibold text-sm hover:shadow-silver transition-smooth animate-shine"
            style={{ color: "var(--jet)" }}
          >
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
