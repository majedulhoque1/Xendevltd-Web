import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { MapPin, ArrowLeft, ArrowRight, Info, MapPinned, CheckSquare, Layout, Waves } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/WhatsAppButton";
import { getProjectBySlug, PROJECTS } from "@/data/projects";
import projectLakeside from "@/assets/project-lakeside.jpg";
import projectRoadsideFront from "@/assets/project-roadside-front.jpg";
import projectRoadsidePerspective from "@/assets/project-roadside-perspective.png";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const TABS = [
  { id: "about", label: "About", icon: Info },
  { id: "location", label: "Location", icon: MapPinned },
  { id: "features", label: "Key Features", icon: CheckSquare },
  { id: "floor", label: "Floor Plans", icon: Layout },
] as const;

const FALLBACK_GALLERY = [projectLakeside, projectRoadsideFront, projectRoadsidePerspective];

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("about");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const otherProjects = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 6);
  const gallery = project.gallery ?? FALLBACK_GALLERY;

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  const tabContent: Record<(typeof TABS)[number]["id"], string[]> = {
    about: project.vision ?? [project.description],
    location: [
      `Located within ${project.location}, ${project.name} is positioned in one of the area's most sought-after residential zones.`,
    ],
    features:
      project.features.length > 0
        ? project.features
        : ["Quality construction throughout", "Modern architectural design"],
    floor: ["Detailed floor plans are available on request — contact our team for the full unit layout brochure."],
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="pt-28 md:pt-32 pb-20 md:pb-28">
        <div className="container-wide">
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{project.name}</span>
          </nav>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative rounded-2xl overflow-hidden min-h-[460px] sm:min-h-0 sm:aspect-[16/10] md:aspect-[2/1]"
          >
            <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
              <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider mb-4">
                {project.status}
              </span>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <h1 className="font-serif text-white text-4xl sm:text-5xl leading-tight">{project.name}</h1>
                  <div className="flex items-center gap-2 text-white/80 mt-3">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <Link to="/schedule-visit" className="btn-primary">
                    Schedule a Visit
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center h-12 px-7 rounded-lg text-sm border border-white/60 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Download Brochure
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Body */}
          <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-10 mt-10 min-w-0">
            {/* Left rail */}
            <div className="flex flex-col gap-6 min-w-0">
              {project.specs && (
                <div className="bg-ink text-white rounded-xl p-6">
                  <h3 className="font-serif text-xl mb-4">Project Specifications</h3>
                  <div className="border-t border-white/10 divide-y divide-white/10">
                    {Object.entries(project.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-3 text-sm">
                        <span className="text-white/50 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.badge && (
                <div className="border border-border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Waves className="w-4 h-4 text-primary" />
                    <h3 className="font-serif text-lg">{project.badge}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Strategically positioned to maximize open frontage, with residences
                    enjoying uninterrupted views and a design that responds directly to the
                    natural topography.
                  </p>
                </div>
              )}
            </div>

            {/* Right — tabs + content */}
            <div className="min-w-0">
              <div className="flex gap-6 border-b border-border overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="py-8 min-h-[140px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {activeTab === "features" ? (
                      <ul className="space-y-3">
                        {tabContent.features.map((f) => (
                          <li key={f} className="flex items-center gap-3 text-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      tabContent[activeTab].map((para, i) => (
                        <p key={i} className="text-muted-foreground leading-relaxed">
                          {para}
                        </p>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl mb-6">Gallery</h2>
              <div className="columns-2 gap-4 [column-fill:_balance]">
                {gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${project.name} — view ${i + 1}`}
                    className="w-full rounded-lg mb-4 break-inside-avoid"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Explore more */}
        {otherProjects.length > 0 && (
          <section className="container-wide mt-16 md:mt-20 pt-12 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl">Explore More Portfolios</h2>
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => scroll(-1)}
                  aria-label="Scroll left"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(1)}
                  aria-label="Scroll right"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={scrollerRef}
              className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {otherProjects.map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="shrink-0 w-[300px] snap-start rounded-xl overflow-hidden border border-border group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-background/90 text-foreground">
                      {p.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg mb-1.5">{p.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {p.description || "A Xen Developments project."}
                    </p>
                    <div className="border-t border-border pt-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{p.location}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-primary uppercase tracking-wide">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <ChatBotButton />
    </div>
  );
};

export default ProjectDetail;
