import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/WhatsAppButton";
import { projectsByStatus, type ProjectStatus } from "@/data/projects";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const COPY: Record<ProjectStatus, { title: string; description: string }> = {
  "On-going": {
    title: "On-going Projects",
    description:
      "Dhaka's premium addresses engineered for generations. Explore our current portfolio of architectural endeavors redefining urban luxury through precision, material honesty, and structural integrity.",
  },
  "Up-coming": {
    title: "Up-coming Projects",
    description:
      "Discover the next generation of architectural landmarks. Our upcoming projects in Dhaka's most coveted locations represent the pinnacle of engineering excellence and future-forward design.",
  },
  Completed: {
    title: "Completed Projects",
    description:
      "Delivered promises across Dhaka & Chittagong. A legacy of structural excellence and architectural vision.",
  },
};

interface ProjectsCategoryProps {
  status: ProjectStatus;
}

const ProjectsCategory = ({ status }: ProjectsCategoryProps) => {
  const { isDark, toggleTheme } = useTheme();
  const projects = projectsByStatus(status);
  const copy = COPY[status];
  const isGallery = status === "Completed";
  const [lightbox, setLightbox] = useState<{ image: string; name: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="pt-28 md:pt-32 pb-20 md:pb-28">
        <div className="container-wide">
          <nav className="text-sm text-muted-foreground mb-8 uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{status}</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl"
          >
            {copy.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="body-large max-w-2xl mt-5"
          >
            {copy.description}
          </motion.p>

          {isGallery ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-14">
              {projects.map((project, index) => (
                <motion.button
                  key={project.slug}
                  type="button"
                  onClick={() => setLightbox({ image: project.image, name: project.name })}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
                  className="relative block overflow-hidden rounded-xl group aspect-[4/3] shadow-md text-left"
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-14">
              {projects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
                  className="rounded-xl overflow-hidden border border-border group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-full bg-primary text-primary-foreground">
                      {status}
                    </span>
                  </div>
                  <div className="bg-ink text-white p-6">
                    <Link to={`/projects/${project.slug}`}>
                      <h3 className="font-serif text-xl mb-3 hover:text-primary/90 transition-colors">
                        {project.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                      Expected {project.expectedCompletion}
                    </div>
                    <div className="border-t border-white/10 mt-5 pt-5">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-white/80 hover:text-white transition-colors"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {projects.length === 0 && (
            <p className="text-muted-foreground mt-14">No projects in this category yet.</p>
          )}
        </div>
      </main>

      <Footer />
      <ChatBotButton />

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
    </div>
  );
};

export default ProjectsCategory;
