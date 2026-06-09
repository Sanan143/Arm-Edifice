import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createLead } from "@/lib/leads.functions";
import { toast } from "sonner";
import { Phone, MapPin, MessageCircle, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

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

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    primary: "+91 91135 51616",
    secondary: "+91 80885 43688",
    href: "tel:+919113551616",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    primary: "Chat with us now",
    secondary: "Fastest response",
    href: "https://wa.me/919113551616?text=Hi%20ARM%20Edifice%2C%20I%20need%20a%20quotation.",
  },
  {
    icon: MapPin,
    label: "Workshop",
    primary: "Pendar Galli, Hubli",
    secondary: "Karnataka, India",
    href: "#",
  },
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
    <section id="contact" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="silver-dot" />
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground font-medium">
              Contact
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Tell us about your{" "}
            <span className="text-silver">project.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left info column */}
          <div className="lg:col-span-4 space-y-5">
            <p className="text-muted-foreground text-base leading-relaxed mb-2">
              Send a few details and we'll get back with a precise quote and a site visit
              within 24 hours.
            </p>

            {contactInfo.map(({ icon: Icon, label, primary, secondary, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener" : undefined}
                className="flex items-start gap-4 glass-card border border-white/5 rounded-xl p-5 card-hover group"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary/60 border border-white/6 flex items-center justify-center shrink-0 group-hover:border-accent/20 transition-smooth">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">
                    {label}
                  </div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-silver transition-smooth">
                    {primary}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{secondary}</div>
                </div>
              </a>
            ))}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { v: "5 yr", l: "Warranty" },
                { v: "24 hr", l: "Response" },
                { v: "500+", l: "Projects" },
                { v: "Free", l: "Site Visit" },
              ].map((b) => (
                <div
                  key={b.l}
                  className="glass-card border border-white/5 rounded-xl p-4 text-center"
                >
                  <div className="text-lg font-bold text-silver">{b.v}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{b.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-8">
            {sent ? (
              <div className="glass-card border border-accent/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-5 shadow-silver">
                <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Request Received!</h3>
                <p className="text-muted-foreground max-w-sm">
                  Our team will call you within 24 hours to discuss your project and arrange
                  a free site visit.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-3 rounded-xl glass border border-white/8 text-sm font-medium text-foreground hover:text-accent hover:border-accent/20 transition-smooth"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="glass-card border border-white/5 rounded-2xl p-7 lg:p-10 shadow-elegant"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field name="name"  label="Your Name"         required />
                  <Field name="phone" label="Phone Number" type="tel" required />
                  <Field name="email" label="Email (optional)"  type="email" />
                  <Field name="city"  label="City" />
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Project Type
                    </label>
                    <select
                      name="project_type"
                      defaultValue=""
                      className="field-input"
                    >
                      <option value="" disabled className="bg-[oklch(0.10_0.004_265)]">
                        Select a service…
                      </option>
                      {projectTypes.map((p) => (
                        <option key={p} value={p} className="bg-[oklch(0.10_0.004_265)]">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Tell Us About the Project
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Describe your project, dimensions, timeline…"
                      className="field-input resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative overflow-hidden flex-1 sm:flex-none px-8 py-4 rounded-xl bg-gradient-silver text-jet font-semibold text-sm shadow-silver hover:shadow-glow transition-smooth disabled:opacity-60 animate-shine"
                    style={{ color: "var(--jet)" }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {loading ? "Sending…" : "Send Request"}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </span>
                  </button>
                  <p className="text-xs text-muted-foreground text-center sm:text-left">
                    No spam. We'll only contact you about your project.
                  </p>
                </div>
              </form>
            )}
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
      <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={label}
        className="field-input"
      />
    </div>
  );
}
