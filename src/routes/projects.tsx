import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { X, ArrowUpRight, Grid3x3, SlidersHorizontal } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { useServerFn } from "@tanstack/react-start";
import { listProjects, type Project } from "@/lib/projects.functions";
import { projectCategories } from "@/data/projects";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects — ARM Edifice Aluminium & Facade Portfolio" },
      {
        name: "description",
        content:
          "Explore ARM Edifice projects: ACP facades, structural & spider glazing, sliding & casement windows, curtain walls and office partitions across Karnataka.",
      },
      { property: "og:title", content: "ARM Edifice — Project Portfolio" },
      {
        property: "og:description",
        content: "Selected aluminium, glazing and facade projects delivered by ARM Edifice.",
      },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
});

function ProjectsPage() {
  const [active, setActive] = useState<(typeof projectCategories)[number]>("All");
  const [lightbox, setLightbox] = useState<Project | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchProjects = useServerFn(listProjects);

  useEffect(() => {
    fetchProjects()
      .then(({ projects }) => setProjectsList(projects))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchProjects]);

  const handleOpenLightbox = (p: Project) => {
    setActiveSlideIndex(0);
    setLightbox(p);
  };

  const lightboxSlides = useMemo(() => {
    if (!lightbox) return [];
    const slides: {
      type: "image" | "before-after";
      url: string;
      label?: string;
      beforeUrl?: string;
    }[] = [];

    if (lightbox.img_before) {
      slides.push({
        type: "before-after",
        url: lightbox.img,
        beforeUrl: lightbox.img_before,
        label: "Comparison",
      });
    }

    slides.push({
      type: "image",
      url: lightbox.img,
      label: lightbox.img_before ? "After Photo" : "Main Photo",
    });

    if (lightbox.additional_images && lightbox.additional_images.length > 0) {
      lightbox.additional_images.forEach((url, i) => {
        slides.push({
          type: "image",
          url,
          label: `Photo ${i + 1}`,
        });
      });
    }

    return slides;
  }, [lightbox]);

  const filtered = useMemo(
    () => (active === "All" ? projectsList : projectsList.filter((p) => p.category === active)),
    [active, projectsList],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        {/* Page Hero */}
        <div className="relative pt-40 pb-20 overflow-hidden">
          {/* Top silver glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, oklch(0.82 0.010 248 / 0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="silver-dot" />
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground font-medium">
                Portfolio
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.02] max-w-3xl">
              Projects engineered{" "}
              <span className="text-silver">to last.</span>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
              A selection of aluminium, glazing and facade work delivered for residences, offices,
              showrooms and commercial towers across Karnataka.
            </p>
          </div>

          {/* Bottom silver divider */}
          <div className="absolute bottom-0 inset-x-0">
            <span className="silver-line block" />
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24 pt-12">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-12 items-center">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground/50 shrink-0" />
            {projectCategories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm border transition-smooth font-medium ${
                  active === c
                    ? "bg-gradient-silver border-transparent shadow-silver"
                    : "border-white/8 text-muted-foreground hover:text-foreground hover:border-accent/20 glass"
                }`}
                style={active === c ? { color: "var(--jet)" } : undefined}
              >
                {c}
              </button>
            ))}
            {!loading && (
              <span className="ml-auto text-xs text-muted-foreground/60 flex items-center gap-1">
                <Grid3x3 className="w-3.5 h-3.5" />
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Skeleton while loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-secondary/30 aspect-[4/3] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleOpenLightbox(p)}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 text-left aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-accent/40 glow-card-hover"
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={1280}
                    height={960}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0"
                  />

                  {/* Before/after badge */}
                  {p.img_before && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold bg-accent/90 text-jet px-2 py-0.5 rounded-full z-10">
                      Before / After
                    </span>
                  )}

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Silver shimmer on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 40%, oklch(0.82 0.010 248 / 0.05) 50%, transparent 60%)",
                    }}
                  />

                  {/* Caption */}
                  <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 translate-y-0.5 group-hover:translate-y-0 transition-transform duration-400">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-silver/70 mb-1 font-medium">
                      {p.category} · {p.location} · {p.year}
                    </div>
                    <div className="text-base lg:text-lg font-bold text-white leading-snug">
                      {p.title}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-silver/50 group-hover:text-silver transition-smooth">
                      <span>View details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full glass border border-white/8 flex items-center justify-center">
                <Grid3x3 className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground">No projects in this category yet.</p>
            </div>
          )}

          {/* CTA strip */}
          <div className="mt-20 glass-card border border-white/5 rounded-2xl p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elegant">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="silver-dot" />
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">
                  Have a project in mind?
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                Let's engineer your <span className="text-silver">facade.</span>
              </div>
            </div>
            <Link
              to="/"
              hash="contact"
              className="relative overflow-hidden shrink-0 px-7 py-4 rounded-xl bg-gradient-silver text-jet font-semibold text-sm hover:shadow-silver transition-smooth animate-shine"
              style={{ color: "var(--jet)" }}
            >
              Request a Quote
            </Link>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10 animate-fade-in"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-foreground hover:text-accent hover:border-accent/30 transition-smooth z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="max-w-5xl w-full glass-card border border-white/8 rounded-2xl overflow-hidden shadow-elegant flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image viewer */}
            {lightboxSlides[activeSlideIndex]?.type === "before-after" ? (
              <div className="w-full aspect-[4/3] relative">
                <BeforeAfterSlider
                  before={lightboxSlides[activeSlideIndex].beforeUrl!}
                  after={lightboxSlides[activeSlideIndex].url}
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] relative bg-secondary/20 flex items-center justify-center">
                <img
                  src={lightboxSlides[activeSlideIndex]?.url || lightbox.img}
                  alt={lightbox.title}
                  width={1600}
                  height={1200}
                  className="max-w-full max-h-full w-auto h-auto object-contain transition-smooth animate-fade-in"
                />
              </div>
            )}

            {/* Thumbnail gallery */}
            {lightboxSlides.length > 1 && (
              <div className="px-6 py-4 lg:px-8 border-b border-white/6">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {lightboxSlides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeSlideIndex === idx
                          ? "border-accent shadow-silver scale-[1.03]"
                          : "border-white/10 hover:border-accent/40 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={slide.url}
                        alt={slide.label}
                        className="w-full h-full object-cover"
                      />
                      {slide.type === "before-after" && (
                        <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                          <span className="text-[9px] bg-accent text-jet font-bold px-1 py-0.5 rounded">
                            B/A
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-6 lg:p-8">
              <div className="text-xs uppercase tracking-[0.22em] text-silver/70 mb-2 font-medium">
                {lightbox.category} · {lightbox.location} · {lightbox.year}
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
                {lightbox.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{lightbox.scope}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
