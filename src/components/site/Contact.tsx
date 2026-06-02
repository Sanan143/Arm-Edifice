import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createLead } from "@/lib/leads.functions";
import { toast } from "sonner";
import { Phone, MapPin, MessageCircle, Mail } from "lucide-react";

const projectTypes = [
  "Aluminium Windows",
  "Sliding Systems",
  "ACP Sheet Work",
  "Structural Glazing",
  "Spider Glazing",
  "Office Partitions",
  "Glass Doors",
  "Curtain Walls",
  "Custom Fabrication",
];

export function Contact() {
  const submit = useServerFn(createLead);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submit({
        data: {
          name: String(fd.get("name") || ""),
          phone: String(fd.get("phone") || ""),
          email: String(fd.get("email") || ""),
          city: String(fd.get("city") || ""),
          project_type: String(fd.get("project_type") || ""),
          message: String(fd.get("message") || ""),
          source: "contact-form",
        },
      });
      setSent(true);
      toast.success("Request received — we'll call you within 24 hours.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 lg:py-36 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Contact</div>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight">
              Tell us about your project.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              Send a few details and we'll get back with a precise quote and a
              site visit within 24 hours.
            </p>

            <ul className="mt-12 space-y-6">
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md glass flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Call</div>
                  <a href="tel:+919113551616" className="text-foreground hover:text-accent transition-smooth">
                    +91 91135 51616
                  </a>
                  <span className="text-muted-foreground"> · </span>
                  <a href="tel:+918088543688" className="text-foreground hover:text-accent transition-smooth">
                    +91 80885 43688
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md glass flex items-center justify-center shrink-0">
                  <MessageCircle className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">WhatsApp</div>
                  <a
                    href="https://wa.me/919113551616?text=Hi%20ARM%20Edifice%2C%20I%20need%20a%20quotation%20for%20aluminium%20work."
                    target="_blank"
                    rel="noopener"
                    className="text-foreground hover:text-accent transition-smooth"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md glass flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workshop</div>
                  <div className="text-foreground">Pendar Galli, Hubli, Karnataka</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="glass rounded-2xl p-8 lg:p-10 shadow-elegant"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field name="name" label="Your name" required />
                <Field name="phone" label="Phone" type="tel" required />
                <Field name="email" label="Email (optional)" type="email" />
                <Field name="city" label="City" />
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Project type
                  </label>
                  <select
                    name="project_type"
                    className="mt-2 w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 text-foreground transition-smooth"
                    defaultValue=""
                  >
                    <option value="" className="bg-card">Select a service</option>
                    {projectTypes.map((p) => (
                      <option key={p} value={p} className="bg-card">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Tell us about the project
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-2 w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 text-foreground transition-smooth resize-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || sent}
                className="mt-8 w-full sm:w-auto px-8 py-4 rounded-md bg-gradient-silver text-jet font-medium shadow-elegant hover:shadow-glow transition-smooth disabled:opacity-60"
                style={{ color: "var(--jet)" }}
              >
                {sent ? "✓ Request received" : loading ? "Sending…" : "Send Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 text-foreground transition-smooth"
      />
    </div>
  );
}