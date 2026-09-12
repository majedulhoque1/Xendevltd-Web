import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FEATURED_DEVELOPMENTS } from "@/data/projects";
import Lightbox, { useLightbox } from "@/components/ui/Lightbox";
import FramedImage from "@/components/ui/FramedImage";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

// Homepage teaser only ever shows completed work — full write-ups live on /projects.
const DEVELOPMENTS = FEATURED_DEVELOPMENTS.filter((p) => p.status === "Completed");

const ProjectsOverview = () => {
  const lightbox = useLightbox();

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
              className="label-caps mb-2 block"
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
              className="inline-flex items-center justify-center h-12 px-6 rounded text-sm border border-[#727974] font-semibold hover:bg-secondary transition-colors whitespace-nowrap"
            >
              View All Projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
                onClick={(e) => lightbox.open([{ src: project.image, alt: project.name }], 0, e.currentTarget)}
                className="relative block w-full overflow-hidden rounded-sm border border-sage group aspect-[4/5] shadow-lg text-left"
              >
                <FramedImage src={project.image} alt={project.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-[2px] bg-primary/80 text-primary-foreground">
                      Completed
                    </span>
                    <span className="text-white/85 text-xs">{project.location}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold">{project.name}</h3>
                  <p className="text-sm text-white/75 leading-relaxed line-clamp-2">{project.description}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox.state && <Lightbox state={lightbox.state} close={lightbox.close} setIndex={lightbox.setIndex} />}
    </section>
  );
};

export default ProjectsOverview;
