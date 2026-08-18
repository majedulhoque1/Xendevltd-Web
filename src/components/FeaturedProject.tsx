import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Info, MapPin, CheckSquare, Layout, Download } from "lucide-react";
import projectLakeside from "@/assets/project-lakeside.jpg";
import projectRoadsideFront from "@/assets/project-roadside-front.jpg";
import projectRoadsidePerspective from "@/assets/project-roadside-perspective.png";
import { getProjectBySlug } from "@/data/projects";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

const THUMBS = [
  { src: projectLakeside, label: "Lakeside View" },
  { src: projectRoadsideFront, label: "Street Front" },
  { src: projectRoadsidePerspective, label: "Perspective View" },
];

const TABS = [
  { id: "about", label: "About", icon: Info },
  { id: "features", label: "Key Features", icon: CheckSquare },
  { id: "location", label: "Location", icon: MapPin },
  { id: "floor", label: "Floor Plans", icon: Layout },
] as const;

const project = getProjectBySlug("xen-lakeview-tasmee")!;
const specRows = [
  { label: "Status", value: "On-going" },
  { label: "Completion", value: project.specs?.completion ?? "Q4 2026" },
  { label: "Total Units", value: project.specs?.totalUnits ?? "G+8 (9 Stories)" },
  { label: "Sizes", value: project.specs?.unitSizes ?? "2,850 Sqft" },
];

const FeaturedProject = () => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("about");
  const [selected, setSelected] = useState(0);

  const tabContent = {
    about: (
      <p className="text-white/70 leading-relaxed">{project.description}</p>
    ),
    features: (
      <ul className="space-y-2.5">
        {project.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    ),
    location: (
      <p className="text-white/70 leading-relaxed">
        Located within {project.location}, this development enjoys a rare dual advantage —
        open street access at the front and uninterrupted lake views at the rear.
      </p>
    ),
    floor: (
      <p className="text-white/70 leading-relaxed">
        3BHK and 4BHK layouts designed to maximize lake-facing views and natural airflow.
        Full floor plans are available on request.
      </p>
    ),
  } as const;

  return (
    <section id="featured" className="section-padding bg-surface">
      <div className="container-wide">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ duration: 0.8, ease: EASE }}
          className="label-caps mb-4 block"
        >
          Featured Development
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 1.0, ease: EASE }}
          className="heading-section pb-6 mb-10 border-b border-border"
        >
          {project.name}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] rounded-sm border border-sage shadow-sm overflow-hidden">
          {/* Left — image + thumbnail selector */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, ease: EASE }}
            className="min-w-0"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selected}
                  src={THUMBS[selected].src}
                  alt={THUMBS[selected].label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <span className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/80 backdrop-blur-sm text-white text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                RAJUK Approved
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 p-4 bg-surface-alt">
              {[...THUMBS, THUMBS[0]].map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i % THUMBS.length)}
                  className={`relative aspect-[8/5] rounded overflow-hidden border-2 transition-colors ${
                    selected === i % THUMBS.length ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View ${thumb.label}`}
                >
                  <img src={thumb.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — dark tabbed panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="min-w-0 bg-ink text-white p-6 md:p-8 flex flex-col"
          >
            <div className="flex gap-6 border-b border-white/10 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#CCE9D8] text-[#CCE9D8]"
                      : "border-transparent text-white/50 hover:text-white/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-6 min-h-[110px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
              {specRows.map((row) => (
                <div key={row.label}>
                  <p className="text-white/45 text-xs font-bold mb-1">{row.label}</p>
                  <p className="font-medium">{row.value}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 mt-auto flex flex-col gap-4">
              <div>
                <p className="text-white/45 text-xs font-bold mb-1.5">Starting From</p>
                <p className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl text-[#CCE9D8]">
                    ৳ {project.specs?.priceRange?.replace(/^From\s+/i, "").replace(/\s+BDT$/i, "") ?? "—"}
                  </span>
                  <span className="text-white/70 text-sm font-semibold">BDT</span>
                </p>
              </div>
              <Link
                to={`/projects/${project.slug}`}
                className="w-full inline-flex items-center justify-center h-12 px-7 rounded text-sm bg-primary text-primary-foreground font-semibold tracking-wide hover:bg-primary/90 transition-colors"
              >
                <Download className="mr-2 w-4 h-4" />
                Download Brochure
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
