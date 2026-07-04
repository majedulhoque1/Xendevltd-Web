import { ArrowLeft, ArrowRight, Waves, MapPin, Calendar, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/WhatsAppButton";
import xenOrionAsset from "@/assets/Xen_Orion_Plot_30__Road_2__DOHS_Chittagong.jpeg";
import xenAndromedaAsset from "@/assets/Xen_Andromeda_Plot_29__Rd_2__DOHS_Chittagong.jpeg";
import xenPegasusAsset from "@/assets/Xen_Pegasus_Plot_1__Road_1__DOHS_Chittagong.jpeg";
import xenNirvanaAsset from "@/assets/Xen_Nirvana.png";
import xenLakeviewTasmeeAsset from "@/assets/Xen_Lakeview_Tasmee.jpeg";
import upcomingBananiAsset from "@/assets/Upcoming_Banani.jpeg";
import upcomingJolshiriAsset from "@/assets/Upcoming_Jolshiri.jpeg";
import project41Asset from "@/assets/Completed_DOHS_Chittagong.jpeg";
import xenCassiopeaAsset from "@/assets/Xen_Cassiopea.jpeg";
import xenSarwarAsset from "@/assets/Xen_Sarwar.jpeg";
import xenScorpiosAsset from "@/assets/Xen_Scorpios.jpeg";
import xenElysiumAsset from "@/assets/Xen_Elysium.jpeg";
import xenPrimaVeraAsset from "@/assets/Xen_Prima_Vera.jpeg";
import project818Asset from "@/assets/Project_818.jpeg";
import project994Asset from "@/assets/Project_994.jpeg";
import project1026Asset from "@/assets/Project_1026.jpeg";

const projects = [
  {
    id: 1,
    slug: "xen-lakeview-tasmee",
    name: "Lakeview Tasmee",
    status: "On-going",
    location: "Plot 38, Rd: 504, Sec: 14, Jolshiri Abashon, Dhaka",
    badge: "Lakeview Project",
    description: "A premium residential development featuring dual-aspect design with open street frontage and uninterrupted lake views. Experience lakeside serenity with modern architectural excellence.",
    features: ["Lake View", "Dual Aspect Design", "Premium Finishes"],
    expectedCompletion: "2026",
    image: xenLakeviewTasmeeAsset,
  },
  {
    id: 11,
    slug: "project-41",
    name: "Project 41",
    status: "On-going",
    location: "Road 2, Plot 41, DOHS Chittagong",
    badge: null,
    description: "Details coming soon.",
    features: ["Quality Construction", "Modern Design"],
    expectedCompletion: "TBD",
    image: project41Asset,
  },
  {
    id: 8,
    slug: "upcoming-banani",
    name: "Project 21",
    status: "Up-coming",
    location: "Block B, Rd 18, Plot 21, Banani, Dhaka",
    badge: null,
    description: "An upcoming residential project in a prime Banani location, featuring modern architectural design.",
    features: ["Prime Location", "Modern Design"],
    expectedCompletion: "TBD",
    image: upcomingBananiAsset,
  },
  {
    id: 9,
    slug: "project-07",
    name: "Project 07",
    status: "On-going",
    location: "Sec 8, Rd 403, Plot 07, Jolshiri, Dhaka",
    badge: null,
    description: "Details coming soon.",
    features: ["Modern Design", "Prime Location"],
    expectedCompletion: "TBD",
    image: upcomingJolshiriAsset,
  },
  {
    id: 3,
    slug: "xen-orion",
    name: "Xen Orion",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "A successfully completed residential project showcasing our commitment to quality construction and timely delivery.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenOrionAsset,
  },
  {
    id: 4,
    slug: "xen-andromeda",
    name: "Xen Andromeda",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "A successfully completed residential project showcasing our commitment to quality construction and timely delivery.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenAndromedaAsset,
  },
  {
    id: 5,
    slug: "xen-pegasus",
    name: "Xen Pegasus",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "A successfully completed residential project showcasing our commitment to quality construction and timely delivery.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenPegasusAsset,
  },
  {
    id: 7,
    slug: "xen-nirvana",
    name: "Xen Nirvana",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "A successfully completed residential project showcasing our commitment to quality construction and timely delivery.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenNirvanaAsset,
  },
  {
    id: 12,
    slug: "xen-cassiopea",
    name: "Xen Cassiopea",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenCassiopeaAsset,
  },
  {
    id: 13,
    slug: "xen-sarwar",
    name: "Xen Sarwar",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenSarwarAsset,
  },
  {
    id: 14,
    slug: "xen-scorpios",
    name: "Xen Scorpios",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenScorpiosAsset,
  },
  {
    id: 15,
    slug: "xen-elysium",
    name: "Xen Elysium",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenElysiumAsset,
  },
  {
    id: 16,
    slug: "xen-prima-vera",
    name: "Xen Prima Vera",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenPrimaVeraAsset,
  },
  {
    id: 17,
    slug: "project-818",
    name: "Project 818",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: project818Asset,
  },
  {
    id: 18,
    slug: "project-994",
    name: "Project 994",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: project994Asset,
  },
  {
    id: 19,
    slug: "project-1026",
    name: "Project 1026",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: project1026Asset,
  },
];

const Projects = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get("filter") || "all";
  
  const { isDark, toggleTheme } = useTheme();
  const [filter, setFilter] = useState<string>(initialFilter);
  const [lightbox, setLightbox] = useState<{ image: string; name: string } | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.status.toLowerCase().replace("-", "") === filter.toLowerCase().replace("-", ""));

  const statusFilters = [
    { label: "All Projects", value: "all" },
    { label: "On-going", value: "ongoing" },
    { label: "Up-coming", value: "upcoming" },
    { label: "Completed", value: "completed" },
  ];

  const bannerGroups = [
    { label: "On-going Projects", value: "ongoing", status: "On-going" },
    { label: "Up-coming Projects", value: "upcoming", status: "Up-coming" },
    { label: "Completed Projects", value: "completed", status: "Completed" },
  ];

  const renderProjectCard = (project: typeof projects[number], index: number) => {
    const isCompleted = project.status === "Completed";

    if (isCompleted) {
      const card = (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative overflow-hidden rounded-lg group aspect-[4/5] shadow-lg h-full"
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Image Coming Soon</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-gruppo font-semibold mb-1">{project.name}</h3>
            <p className="text-sm opacity-90">{project.location}</p>
          </div>
        </motion.div>
      );

      if (!project.image) {
        return <div key={project.id} className="block">{card}</div>;
      }
      return (
        <button
          key={project.id}
          type="button"
          onClick={() => setLightbox({ image: project.image!, name: project.name })}
          className="block text-left w-full"
        >
          {card}
        </button>
      );
    }

    const cardInner = (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={
          isCompleted && !project.image
            ? undefined
            : { y: -8, transition: { duration: 0.3 } }
        }
        className={`card-premium overflow-hidden group h-full ${
          isCompleted && !project.image ? "" : "cursor-pointer"
        }`}
      >
        <div
          className={`relative h-64 md:h-96 overflow-hidden ${
            project.image ? "" : "bg-gradient-to-br from-secondary to-muted"
          }`}
        >
          {project.image ? (
            <motion.img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Image Coming Soon</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center px-3 py-1 text-xs uppercase tracking-wider rounded-full ${
                project.status === "On-going"
                  ? "bg-primary text-primary-foreground"
                  : project.status === "Up-coming"
                  ? "bg-gold text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {project.status}
            </span>
          </div>
          {project.badge && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 text-xs bg-background/90 backdrop-blur-sm rounded-full">
                <Waves className="w-3 h-3 mr-1 text-primary" />
                {project.badge}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-gruppo font-semibold mb-2">{project.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            {project.location}
          </div>
          {!isCompleted && (
            <>
              <p className="text-sm text-muted-foreground mt-3 mb-4 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-secondary rounded-full text-secondary-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                {`Expected: ${project.expectedCompletion}`}
              </div>
              <span className="inline-flex items-center text-sm font-medium text-primary group/link">
                View Details
                <ArrowLeft className="ml-2 w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
              </span>
            </>
          )}
        </div>
      </motion.div>
    );

    return (
      <Link key={project.id} to={`/projects/${project.slug}`} className="block">
        {cardInner}
      </Link>
    );
  };

  const goToFilter = (value: string) => {
    setFilter(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />
      
      <main className="pt-20">
        {/* Compact Header with Filters */}
        <section className="py-6 bg-secondary/30">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
              >
                <Link
                  to="/"
                  className="inline-flex items-center self-start text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Home
                </Link>
                <div className="hidden md:block h-4 w-px bg-border" />
                <h1 className="text-2xl md:text-3xl font-gruppo font-semibold leading-tight">Our Projects</h1>
              </motion.div>

              {/* Filter Tabs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-wrap gap-2"
              >
                {statusFilters.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setFilter(status.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      filter === status.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-8 md:py-12">
          <div className="container-wide">
            {filter === "all" ? (
              <div className="space-y-16">
                {bannerGroups.map((group) => {
                  const items = projects.filter((p) => p.status === group.status).slice(0, 3);
                  if (items.length === 0) return null;
                  return (
                    <div key={group.value}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-end justify-between mb-6 pb-4 border-b border-border"
                      >
                        <div>
                          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Category
                          </span>
                          <h2 className="text-2xl md:text-3xl font-gruppo font-semibold mt-1">
                            {group.label}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => goToFilter(group.value)}
                          className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80 transition-opacity"
                        >
                          See All
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </motion.div>
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {items.map((project, index) => renderProjectCard(project, index))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => renderProjectCard(project, index))}
              </div>
            )}

            {filter !== "all" && filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground">No projects found in this category.</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container-wide text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-section mb-4">Interested in Our Projects?</h2>
              <p className="body-large max-w-xl mx-auto mb-8">
                Schedule a site visit or get in touch with our team to learn more about our developments.
              </p>
              <Link to="/#contact" className="btn-primary">
                Get in Touch
              </Link>
            </motion.div>
          </div>
        </section>
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
          <div
            className="max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image}
              alt={lightbox.name}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />
            <p className="mt-4 text-center text-base md:text-lg font-gruppo font-semibold text-foreground">
              {lightbox.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
