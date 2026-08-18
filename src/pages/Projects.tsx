import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/WhatsAppButton";
import { projectsByStatus } from "@/data/projects";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const CATEGORIES = [
  {
    label: "On-going",
    to: "/projects/ongoing",
    projects: projectsByStatus("On-going"),
  },
  {
    label: "Up-coming",
    to: "/projects/upcoming",
    projects: projectsByStatus("Up-coming"),
  },
  {
    label: "Completed",
    to: "/projects/completed",
    projects: projectsByStatus("Completed"),
  },
];

const Projects = () => {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="pt-28 md:pt-32 pb-20 md:pb-28">
        <div className="container-wide">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Our Projects</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-primary"
          >
            Our Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="body-large max-w-2xl mt-5"
          >
            Ongoing developments, upcoming ventures, completed legacies — explore the
            full portfolio.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-14">
            {CATEGORIES.map((category, index) => {
              const cover = category.projects[0];
              return (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
                >
                  <Link
                    to={category.to}
                    className="relative block overflow-hidden rounded-xl group aspect-[4/5] shadow-lg"
                  >
                    {cover && (
                      <img
                        src={cover.image}
                        alt={category.label}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-full bg-primary text-primary-foreground">
                        {category.label}
                      </span>
                      <span className="text-white text-xs font-medium">
                        {category.projects.length} Projects
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="font-serif text-2xl md:text-3xl font-semibold">{category.label}</h2>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <ChatBotButton />
    </div>
  );
};

export default Projects;
