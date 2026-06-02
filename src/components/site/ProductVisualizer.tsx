import { useState } from "react";
import { Check, ChevronDown, Instagram } from "lucide-react";
import { ThreeVisualizer } from "./ThreeVisualizer";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProductId = "window" | "door" | "acp" | "curtain-wall" | "partition";
type FrameColorId = "silver" | "black" | "bronze" | "white" | "champagne";
type GlassTypeId = "clear" | "blue-tint" | "bronze-tint" | "frosted" | "reflective";
type SeriesId = "standard" | "premium" | "heavy";
type OpeningStyleId = "fixed" | "sliding" | "casement" | "tilt-turn";
type ACPFinishId = "silver-metallic" | "brushed" | "copper" | "white-matt" | "charcoal";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: "window" as ProductId, label: "Aluminium Window", desc: "Sliding, casement & fixed systems" },
  { id: "door" as ProductId, label: "Aluminium Door", desc: "Swing, folding & sliding doors" },
  { id: "acp" as ProductId, label: "ACP Cladding", desc: "Aluminium composite panels" },
  { id: "curtain-wall" as ProductId, label: "Curtain Wall", desc: "Structural glass facade systems" },
  { id: "partition" as ProductId, label: "Glass Partition", desc: "Office & commercial partitions" },
];

const FRAME_COLORS = [
  { id: "silver" as FrameColorId, label: "Anodized Silver", hex: "#A8B0BC" },
  { id: "black" as FrameColorId, label: "Matte Black", hex: "#1C1C1E" },
  { id: "bronze" as FrameColorId, label: "Warm Bronze", hex: "#7A5C2E" },
  { id: "white" as FrameColorId, label: "Pearl White", hex: "#EEF0F2" },
  { id: "champagne" as FrameColorId, label: "Champagne Gold", hex: "#C9A84C" },
];

const GLASS_TYPES = [
  { id: "clear" as GlassTypeId, label: "Clear Glass", fill: "rgba(180,215,240,0.18)", stroke: "rgba(180,215,240,0.5)" },
  { id: "blue-tint" as GlassTypeId, label: "Blue Tinted", fill: "rgba(37,99,235,0.32)", stroke: "rgba(96,165,250,0.5)" },
  { id: "bronze-tint" as GlassTypeId, label: "Bronze Tinted", fill: "rgba(120,80,30,0.38)", stroke: "rgba(180,130,60,0.5)" },
  { id: "frosted" as GlassTypeId, label: "Frosted", fill: "rgba(210,225,235,0.48)", stroke: "rgba(210,225,235,0.6)" },
  { id: "reflective" as GlassTypeId, label: "Reflective", fill: "rgba(80,100,120,0.52)", stroke: "rgba(140,170,200,0.5)" },
];

const SERIES = [
  { id: "standard" as SeriesId, label: "Standard", detail: "40 mm profile" },
  { id: "premium" as SeriesId, label: "Premium", detail: "55 mm profile" },
  { id: "heavy" as SeriesId, label: "Heavy Duty", detail: "75 mm profile" },
];

const OPENING_STYLES = [
  { id: "fixed" as OpeningStyleId, label: "Fixed" },
  { id: "sliding" as OpeningStyleId, label: "Sliding" },
  { id: "casement" as OpeningStyleId, label: "Casement" },
  { id: "tilt-turn" as OpeningStyleId, label: "Tilt & Turn" },
];

const ACP_FINISHES = [
  { id: "silver-metallic" as ACPFinishId, label: "Silver Metallic", hex: "#B8BEC8" },
  { id: "brushed" as ACPFinishId, label: "Brushed Aluminum", hex: "#8A9099" },
  { id: "copper" as ACPFinishId, label: "Copper Metallic", hex: "#B07040" },
  { id: "white-matt" as ACPFinishId, label: "White Matt", hex: "#EDEEF0" },
  { id: "charcoal" as ACPFinishId, label: "Charcoal Matt", hex: "#3A3E48" },
];

// ─── Selector Button ──────────────────────────────────────────────────────────
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
        active
          ? "bg-accent/20 border-accent/60 text-accent shadow-glow"
          : "glass border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────
function Swatch({ hex, active, label, onClick }: { hex: string; active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      title={label}
      onClick={onClick}
      className="relative flex-shrink-0 group"
    >
      <div
        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
          active ? "border-accent scale-110 ring-2 ring-accent/30" : "border-border/40 hover:border-border hover:scale-105"
        }`}
        style={{ backgroundColor: hex }}
      />
      {active && (
        <Check className="absolute inset-0 m-auto w-3.5 h-3.5 text-accent drop-shadow" />
      )}
    </button>
  );
}

// ─── Accordion Panel ──────────────────────────────────────────────────────────
function Panel({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function ProductVisualizer() {
  const [product, setProduct] = useState<ProductId>("window");
  const [frameColor, setFrameColor] = useState<FrameColorId>("silver");
  const [glassType, setGlassType] = useState<GlassTypeId>("clear");
  const [series, setSeries] = useState<SeriesId>("premium");
  const [opening, setOpening] = useState<OpeningStyleId>("sliding");
  const [acpFinish, setACPFinish] = useState<ACPFinishId>("silver-metallic");
  const [isOpen, setIsOpen] = useState(false);

  const frame = FRAME_COLORS.find((c) => c.id === frameColor)!;
  const glass = GLASS_TYPES.find((g) => g.id === glassType)!;
  const acp = ACP_FINISHES.find((a) => a.id === acpFinish)!;
  const ser = SERIES.find((s) => s.id === series)!;
  const openStyle = OPENING_STYLES.find((o) => o.id === opening)!;
  const prod = PRODUCTS.find((p) => p.id === product)!;

  const isGlazed = product !== "acp";
  const hasOpening = product === "window";
  const interactable = ["window", "door", "partition"].includes(product);

  const quoteMsg =
    `Hi ARM Edifice! I'd like a quote for the following configuration:\n` +
    `• Product: ${prod.label}\n` +
    `• Frame: ${frame.label}\n` +
    (isGlazed ? `• Glass: ${glass.label}\n` : `• ACP Finish: ${acp.label}\n`) +
    `• Series: ${ser.label} (${ser.detail})\n` +
    (hasOpening ? `• Opening Style: ${openStyle.label}\n` : "") +
    `\nPlease share dimensions and pricing. Thank you!`;

  return (
    <section id="visualizer" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Interactive 3D Customizer</div>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight">
            Visualize &amp; customize your{" "}
            <span className="text-silver">perfect product</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Configure your setup, rotate and zoom in photorealistic 3D, and see profile materials rendering live.
            Toggle animations to interact, then send your configuration directly to our team on WhatsApp.
          </p>
        </div>

        {/* Product tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProduct(p.id);
                setIsOpen(false); // Reset animation state on change
              }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                product === p.id
                  ? "bg-accent/20 border-accent/60 text-accent shadow-glow"
                  : "glass border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6 items-start">
          {/* ── Left: Frame & Glass ──────────────────────────────────────── */}
          <div className="space-y-4">
            <Panel title="Frame / Profile Colour" defaultOpen>
              <div className="flex flex-wrap gap-2 mt-1">
                {FRAME_COLORS.map((c) => (
                  <Swatch key={c.id} hex={c.hex} active={frameColor === c.id} label={c.label} onClick={() => setFrameColor(c.id)} />
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{frame.label}</p>
            </Panel>

            {isGlazed ? (
              <Panel title="Glass Type" defaultOpen>
                <div className="space-y-1.5 mt-1">
                  {GLASS_TYPES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGlassType(g.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        glassType === g.id
                          ? "bg-accent/15 text-accent border border-accent/30"
                          : "hover:bg-foreground/5 text-muted-foreground border border-transparent"
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded border border-border/50 flex-shrink-0"
                        style={{ backgroundColor: g.fill }}
                      />
                      {g.label}
                    </button>
                  ))}
                </div>
              </Panel>
            ) : (
              <Panel title="ACP Finish" defaultOpen>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACP_FINISHES.map((a) => (
                    <Swatch key={a.id} hex={a.hex} active={acpFinish === a.id} label={a.label} onClick={() => setACPFinish(a.id)} />
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{acp.label}</p>
              </Panel>
            )}
          </div>

          {/* ── Centre: Interactive 3D Canvas ─────────────────────────────── */}
          <div className="relative glass rounded-2xl border border-border/60 flex flex-col items-center justify-center min-h-[460px] overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/4 via-transparent to-transparent pointer-events-none rounded-2xl" />
            <div className="absolute top-3 left-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 z-10">Live 3D Preview</div>

            {/* Open / Close overlay button */}
            {interactable && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-3 right-4 z-10 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border glass border-border/60 text-foreground hover:text-accent hover:border-accent/40 hover:scale-105 transition-smooth flex items-center gap-1.5"
              >
                <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-accent animate-pulse" : "bg-muted-foreground/60"}`} />
                {isOpen ? "Close Opening" : "Test Opening Style"}
              </button>
            )}

            {/* The 3D Render Canvas */}
            <div className="w-full h-[360px] lg:h-[400px] transition-all duration-300">
              <ThreeVisualizer
                product={product}
                frameColor={frameColor}
                glassType={glassType}
                series={series}
                opening={opening}
                acpFinish={acpFinish}
                isOpen={isOpen}
              />
            </div>

            <div className="pb-6 text-center z-10">
              <div className="text-sm font-semibold text-foreground">{prod.label}</div>
              <div className="text-xs text-muted-foreground mt-1 px-4">
                {frame.label} · {isGlazed ? glass.label : acp.label} · {ser.label}
                {hasOpening && ` · ${openStyle.label}`}
              </div>
            </div>
          </div>

          {/* ── Right: Series, Style, CTA ─────────────────────────────────── */}
          <div className="space-y-4">
            <Panel title="Profile Series" defaultOpen>
              <div className="space-y-1.5 mt-1">
                {SERIES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSeries(s.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      series === s.id
                        ? "bg-accent/15 text-accent border border-accent/30"
                        : "hover:bg-foreground/5 text-muted-foreground border border-transparent"
                    }`}
                  >
                    <span className="font-medium">{s.label}</span>
                    <span className="text-xs opacity-60">{s.detail}</span>
                  </button>
                ))}
              </div>
            </Panel>

            {hasOpening && (
              <Panel title="Opening Style" defaultOpen>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {OPENING_STYLES.map((o) => (
                    <Chip
                      key={o.id}
                      active={opening === o.id}
                      onClick={() => {
                        setOpening(o.id);
                        setIsOpen(false); // Reset animation state on change
                      }}
                    >
                      {o.label}
                    </Chip>
                  ))}
                </div>
              </Panel>
            )}

            {/* Config Summary */}
            <div className="glass rounded-xl border border-border p-4 space-y-2.5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Your Configuration</div>
              {[
                ["Product", prod.label],
                ["Frame", frame.label, frame.hex],
                [isGlazed ? "Glass" : "Finish", isGlazed ? glass.label : acp.label],
                ["Series", `${ser.label} · ${ser.detail}`],
                ...(hasOpening ? [["Style", openStyle.label]] : []),
              ].map(([k, v, hex]) => (
                <div key={k} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    {hex && (
                      <span
                        className="w-3 h-3 rounded-full border border-border/50 inline-block flex-shrink-0"
                        style={{ backgroundColor: hex as string }}
                      />
                    )}
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Instagram Portfolio Card */}
            <div className="glass rounded-xl border border-border/50 p-4 text-center">
              <a
                href="https://www.instagram.com/arm.edifice?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex flex-col items-center gap-2 hover:scale-102 transition-smooth"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground group-hover:text-accent transition-smooth">
                  <Instagram className="w-4 h-4 text-accent" />
                  <span>Portfolio on Instagram</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Explore real-world premium architectural installations by @arm.edifice
                </p>
              </a>
            </div>

            {/* CTA */}
            <a
              href={`https://wa.me/919113551616?text=${encodeURIComponent(quoteMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              id="visualizer-quote-btn"
              className="relative overflow-hidden flex items-center justify-center gap-2.5 w-full px-6 py-4 rounded-xl bg-gradient-silver text-jet font-semibold shadow-elegant hover:shadow-glow transition-smooth text-sm animate-shine"
              style={{ color: "var(--jet)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 flex-shrink-0"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Get Quote for This Config
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
