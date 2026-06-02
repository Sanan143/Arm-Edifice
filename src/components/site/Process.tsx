const steps = [
  { n: "01", t: "Consult", d: "Free site visit, measurements and design conversation." },
  { n: "02", t: "Design", d: "Drawings, material spec and a transparent fixed quote." },
  { n: "03", t: "Fabricate", d: "In-house precision fabrication with quality checks at every stage." },
  { n: "04", t: "Install", d: "Clean, on-schedule installation with full handover & warranty." },
];

export function Process() {
  return (
    <section id="process" className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Process</div>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight">
              Four steps, no surprises.
            </h2>
            <p className="mt-5 text-muted-foreground">
              We treat aluminium and glass like architecture, not joinery —
              every project follows the same disciplined path.
            </p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="glass rounded-xl p-8 transition-smooth hover:shadow-glow">
                <div className="text-silver text-3xl font-semibold tracking-tight mb-4">
                  {s.n}
                </div>
                <div className="text-xl font-semibold mb-2">{s.t}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}