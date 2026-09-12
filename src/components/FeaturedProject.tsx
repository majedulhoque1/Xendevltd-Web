import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Waves, Info, MapPin, CheckSquare, Layout, Download, Maximize2 } from "lucide-react";
import { getProjectBySlug } from "@/data/projects";
import FramedImage from "@/components/ui/FramedImage";
import Lightbox, { useLightbox } from "@/components/ui/Lightbox";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

// Labels line up 1:1 with this project's own gallery array in
// src/data/projects.ts (Lakeside NE view, then the two Roadside SW views
// from brochure page 5) — not stock images, the real brochure renders.
const THUMB_LABELS = ["Lakeside View", "Street Front", "Perspective View"];

const TABS = [
  { id: "about", label: "About", icon: Info },
  { id: "features", label: "Key Features", icon: CheckSquare },
  { id: "location", label: "Location", icon: MapPin },
  { id: "floor", label: "Floor Plans", icon: Layout },
] as const;

const FeaturedProject = () => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("about");
  const [selected, setSelected] = useState(0);
  const lightbox = useLightbox();

  const project = getProjectBySlug("xen-lakeview-tasmee");

  // Guard rather than crash the homepage at import time if this slug is ever
  // renamed in projects.ts.
  if (!project) return null;

  const gallery = project.gallery ?? [project.image];
  const thumbs = gallery.map((src, i) => ({ src, label: THUMB_LABELS[i] ?? project.name }));
  const galleryImages = gallery.map((src, i) => ({ src, alt: thumbs[i].label }));
  const floorPlanImages = (project.floorPlans ?? []).map((fp) => ({ src: fp.image, alt: fp.label }));

  const specRows = [
    { label: "Status", value: project.status },
    { label: "Completion", value: project.specs?.completion ?? "On request" },
    { label: "Total Units", value: project.specs?.totalUnits ?? "—" },
    { label: "Sizes", value: project.specs?.unitSizes ?? "—" },
  ];

  // "On request" (the real value — no price is published) isn't a number,
  // so it can't be wrapped in currency markup without reading as "৳ On
  // request BDT". Only format it as currency when it actually is one.
  const price = project.specs?.priceRange ?? "On request";
  const isNumericPrice = /\d/.test(price);

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
        Set within {project.location}, with open street access at the front and
        uninterrupted lake views at the rear.
      </p>
    ),
    floor: (
      <p className="text-white/70 leading-relaxed">
        4-bedroom, 5-bath layouts with 7 balconies, designed to maximize lake-facing
        views and natural airflow. Full floor plans are available on request.
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
            <div className="relative aspect-[4/3] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <FramedImage src={thumbs[selected].src} alt={thumbs[selected].label} priority />
                </motion.div>
              </AnimatePresence>
              <span className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-ink/80 backdrop-blur-sm text-white text-[11px] sm:text-xs font-medium">
                <Waves className="w-3.5 h-3.5" />
                200 ft Lake Frontage
              </span>
              <button
                type="button"
                onClick={(e) => lightbox.open(galleryImages, selected, e.currentTarget)}
                aria-label={`View ${thumbs[selected].label} full screen`}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2.5 rounded-full bg-ink/60 backdrop-blur-sm text-white hover:bg-ink/80 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 bg-surface-alt">
              {thumbs.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`relative aspect-[8/5] rounded overflow-hidden border-2 transition-colors ${
                    selected === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
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
            className="min-w-0 bg-ink text-white p-5 sm:p-6 md:p-8 flex flex-col"
          >
            <div className="flex justify-between gap-1.5 sm:gap-6 border-b border-white/10 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-5 mb-6">
              {specRows.map((row) => (
                <div key={row.label}>
                  <p className="text-white/45 text-xs font-bold mb-1">{row.label}</p>
                  <p className="font-medium">{row.value}</p>
                </div>
              ))}
            </div>

            {activeTab === "floor" && project.floorPlans && project.floorPlans.length > 0 && (
              <div className="mb-6">
                <p className="text-white/45 text-xs font-bold mb-2">Floor Plans — tap to enlarge</p>
                <div className="grid grid-cols-2 gap-3">
                  {project.floorPlans.map((fp, i) => (
                    <button
                      key={fp.label}
                      type="button"
                      onClick={(e) => lightbox.open(floorPlanImages, i, e.currentTarget)}
                      aria-label={`View ${fp.label} full screen`}
                      className="block text-left rounded overflow-hidden bg-white border border-white/10 cursor-zoom-in"
                    >
                      <img src={fp.image} alt={fp.label} className="w-full block" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-6 mt-auto flex flex-col gap-4">
              <div>
                <p className="text-white/45 text-xs font-bold mb-1.5">Starting From</p>
                {isNumericPrice ? (
                  <p className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl text-[#CCE9D8]">
                      ৳ {price.replace(/^From\s+/i, "").replace(/\s+BDT$/i, "")}
                    </span>
                    <span className="text-white/70 text-sm font-semibold">BDT</span>
                  </p>
                ) : (
                  <p className="font-serif text-2xl text-[#CCE9D8]">{price}</p>
                )}
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

      {lightbox.state && <Lightbox state={lightbox.state} close={lightbox.close} setIndex={lightbox.setIndex} />}
    </section>
  );
};

export default FeaturedProject;
