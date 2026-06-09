import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listProjects } from "@/lib/projects.functions";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  const [projectsList, setProjectsList] = useState<
    { img: string; title: string; cat: string; loc: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const fetchProjects = useServerFn(listProjects);

  useEffect(() => {
    fetchProjects()
      .then(({ projects }) => {
        setProjectsList(
          projects.slice(0, 4).map((p) => ({
            img: p.img,
            title: p.title,
            cat: p.category,
            loc: p.location,
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchProjects]);

  return (
    <section id="projects" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="silver-dot" />
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground font-medium">
                Selected Work
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Built on precision.{" "}
              <span className="text-silver">Finished in silence.</span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-silver transition-smooth border border-white/6 px-5 py-2.5 rounded-xl glass hover:border-accent/20"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Silver divider */}
        <span className="silver-line block mb-12" />

        {loading ? (
          /* Skeleton grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-secondary/40 animate-pulse ${
                  i === 0 ? "aspect-[4/5] md:row-span-2" : "aspect-[4/3]"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {projectsList.map((p, i) => (
              <figure
                key={p.title}
                className={`group relative overflow-hidden rounded-2xl glow-card-hover border border-white/5 ${
                  i === 0 ? "md:row-span-2 aspect-[4/5] md:aspect-auto" : "aspect-[4/3]"
                }`}
              >
                {/* Photo */}
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1280}
                  height={960}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Silver shimmer streak on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 40%, oklch(0.82 0.010 248 / 0.06) 50%, transparent 60%)",
                  }}
                />

                {/* Caption */}
                <figcaption className="absolute inset-x-0 bottom-0 p-6 lg:p-8 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                  <div className="text-xs uppercase tracking-[0.22em] text-silver/70 mb-1.5 font-medium">
                    {p.cat} · {p.loc}
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-white leading-tight">
                    {p.title}
                  </div>
                  {/* View arrow */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-silver/60 group-hover:text-silver transition-smooth">
                    <span>View project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </figcaption>

                {/* Top-right category badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium glass border border-white/10 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {p.cat}
                </div>
              </figure>
            ))}
          </div>
        )}

        {/* View all CTA at bottom for mobile */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/projects"
            className="px-7 py-3.5 rounded-xl bg-gradient-silver text-jet font-semibold text-sm hover:shadow-silver transition-smooth"
            style={{ color: "var(--jet)" }}
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
