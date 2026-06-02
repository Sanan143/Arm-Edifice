import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listProjects } from "@/lib/projects.functions";

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
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchProjects]);

  return (
    <section id="projects" className="relative py-28 lg:py-36 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">
              Selected Work
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight">
              Built on precision. Finished in silence.
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            View all projects →
          </Link>
        </div>

        {loading ? (
          /* Skeleton grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`rounded-xl bg-secondary/40 animate-pulse ${
                  i === 0
                    ? "aspect-[4/5] md:row-span-2"
                    : "aspect-[4/3]"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {projectsList.map((p, i) => (
              <figure
                key={p.title}
                className={`group relative overflow-hidden rounded-xl bg-card shadow-elegant ${
                  i === 0
                    ? "md:row-span-2 aspect-[4/5] md:aspect-auto"
                    : "aspect-[4/3]"
                }`}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1280}
                  height={960}
                  className="absolute inset-0 h-full w-full object-cover transition-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/20 to-transparent opacity-90" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-accent mb-2">
                    {p.cat} · {p.loc}
                  </div>
                  <div className="text-xl lg:text-2xl font-semibold text-foreground">
                    {p.title}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}