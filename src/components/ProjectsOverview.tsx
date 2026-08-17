import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { FEATURED_DEVELOPMENTS } from "@/data/projects";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

// Homepage teaser only ever shows completed work — full write-ups live on /projects.
const DEVELOPMENTS = FEATURED_DEVELOPMENTS.filter((p) => p.status === "Completed");

const ProjectsOverview = () => {
  const [lightbox, setLightbox] = useState<{ image: string; name: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <section id="projects" className="section-padding bg-background">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 mb-10 border-b border-border">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VP}
              transition={{ duration: 0.8, ease: EASE }}
              className="label-caps mb-4 block"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 1.0, ease: EASE }}
              className="heading-section"
            >
              Our Developments
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <Link
              to="/projects"
              className="inline-flex items-center justify-center h-12 px-6 rounded-lg text-sm border border-border font-medium hover:bg-secondary transition-colors whitespace-nowrap"
            >
              View All Projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {DEVELOPMENTS.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
              className={index === 1 ? "md:mt-8" : ""}
            >
              <button
                type="button"
                onClick={() => setLightbox({ image: project.image, name: project.name })}
                className="relative block w-full overflow-hidden rounded-xl group aspect-[4/5] shadow-lg text-left"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-full bg-primary text-primary-foreground">
                    Completed
                  </span>
                  <span className="text-white/85 text-xs">{project.location}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold mb-1.5">{project.name}</h3>
                  <p className="text-sm text-white/75 leading-relaxed line-clamp-2">{project.description}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-secondary/80 hover:bg-secondary text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.image}
              alt={lightbox.name}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />
            <p className="mt-4 text-center text-lg font-serif text-foreground">{lightbox.name}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsOverview;
