import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
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
        content:
          "Selected aluminium, glazing and facade projects delivered by ARM Edifice.",
      },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
});

function ProjectsPage() {
  const [active, setActive] = useState<(typeof projectCategories)[number]>("All");
  const [lightbox, setLightbox] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchProjects = useServerFn(listProjects);

  useEffect(() => {
    fetchProjects()
      .then(({ projects }) => setProjectsList(projects))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchProjects]);

  const filtered = useMemo(
    () =>
      active === "All"
        ? projectsList
        : projectsList.filter((p) => p.category === active),
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
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mb-12">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">
              Portfolio
            </div>
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight">
              Projects engineered to last.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A selection of aluminium, glazing and facade work delivered for
              residences, offices, showrooms and commercial towers across
              Karnataka.
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mb-12">
            {projectCategories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm border transition-smooth ${
                  active === c
                    ? "bg-gradient-silver text-jet border-transparent"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                }`}
                style={active === c ? { color: "var(--jet)" } : undefined}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Skeleton while loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-secondary/30 aspect-[4/3] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setLightbox(p)}
                  className="group relative overflow-hidden rounded-xl bg-card shadow-elegant text-left aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={1280}
                    height={960}
                    className="absolute inset-0 h-full w-full object-cover transition-smooth group-hover:scale-105"
                  />
                  {p.img_before && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold bg-emerald-500/90 text-white px-2 py-0.5 rounded backdrop-blur-sm shadow-sm z-10">
                      Before/After Slider
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/30 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">
                      {p.category} · {p.location} · {p.year}
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {p.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">
              No projects in this category yet.
            </p>
          )}

          {/* CTA strip */}
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl border border-border p-8 lg:p-10 glass">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-accent mb-2">
                Have a project in mind?
              </div>
              <div className="text-2xl font-semibold">
                Let's engineer your facade.
              </div>
            </div>
            <Link
              to="/"
              hash="contact"
              className="px-6 py-3 rounded-md bg-gradient-silver text-jet font-medium hover:opacity-90 transition-smooth"
              style={{ color: "var(--jet)" }}
            >
              Request a quote
            </Link>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-jet/90 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10 animate-fade-in"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-background/20 hover:bg-background/40 text-foreground"
            aria-label="Close"
          >
            <X />
          </button>
          <div
            className="max-w-5xl w-full bg-card rounded-xl overflow-hidden shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.img_before ? (
              <div className="w-full aspect-[4/3] relative">
                <BeforeAfterSlider before={lightbox.img_before} after={lightbox.img} />
              </div>
            ) : (
              <img
                src={lightbox.img}
                alt={lightbox.title}
                width={1600}
                height={1200}
                className="w-full aspect-[4/3] object-cover"
              />
            )}
            <div className="p-6 lg:p-8">
              <div className="text-xs uppercase tracking-[0.25em] text-accent mb-2">
                {lightbox.category} · {lightbox.location} · {lightbox.year}
              </div>
              <h2 className="text-2xl font-semibold mb-3">{lightbox.title}</h2>
              <p className="text-muted-foreground">{lightbox.scope}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}