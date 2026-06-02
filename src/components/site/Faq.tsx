import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How much does aluminium window installation cost?",
    a: "Pricing depends on size, glass type and frame system. Most residential windows fall between ₹450 – ₹1,200 per sq ft fully installed. Send us your dimensions for a precise quote within 24 hours.",
  },
  {
    q: "Do you provide a warranty?",
    a: "Yes — every installation carries a 5-year structural warranty on frames and hardware, and manufacturer warranty on glass and accessories.",
  },
  {
    q: "How long does installation take?",
    a: "A typical residential project is completed in 5 – 10 working days from order confirmation. Facade and ACP projects vary based on scope; we share a detailed schedule with every quote.",
  },
  {
    q: "Which areas do you serve?",
    a: "We're based in Hubli and deliver across Mysuru, Bengaluru, Mangalore, Hassan and surrounding districts in Karnataka.",
  },
  {
    q: "Do you handle design and drawings?",
    a: "Absolutely. Our in-house team prepares shop drawings, material specifications and 3D previews before any fabrication begins.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">FAQ</div>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-12">
          Questions, answered.
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base lg:text-lg font-medium hover:text-accent">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}