import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import {
  MapPin,
  Info,
  CheckSquare,
  Layout,
  ArrowRight,
  Download,
  Building2,
  Wind,
  Shield,
  Waves,
  Eye,
  Sparkles,
  Car,
} from "lucide-react";

// Import project images
import projectLakeside from "@/assets/project-lakeside.jpg";
import projectRoadsideFront from "@/assets/project-roadside-front.jpg";
import projectRoadsidePerspective from "@/assets/project-roadside-perspective.png";
import projectDark1 from "@/assets/Project_dark_mode_1.png.asset.json";
import projectDark2 from "@/assets/Project_dark_mode_2.png.asset.json";
import projectDark3 from "@/assets/Project_dark_mode_3.png.asset.json";
import floorPlanImage from "@/assets/Floor_Plan.jpeg.asset.json";
import aboutDark from "@/assets/Featured_About_Dark.png.asset.json";
import featuresDark from "@/assets/Featured_Features_Dark.png.asset.json";

const CrossfadeImage = ({
  light,
  dark,
  alt,
  className = "",
  isDark,
}: {
  light: string;
  dark: string;
  alt: string;
  className?: string;
  isDark: boolean;
}) => (
  <div className={`relative w-full h-full ${className}`}>
    <img
      src={light}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out"
      style={{ opacity: isDark ? 0 : 1 }}
    />
    <img
      src={dark}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out"
      style={{ opacity: isDark ? 1 : 0 }}
    />
  </div>
);

const tabs = [
  { id: "location", label: "Location", icon: MapPin },
  { id: "about", label: "About", icon: Info },
  { id: "features", label: "Key Features", icon: CheckSquare },
  { id: "floorplans", label: "Floor Plans", icon: Layout },
];

const features = [
  {
    icon: Eye,
    title: "Lake View",
    description: "Uninterrupted lake-facing vistas",
  },
  {
    icon: Waves,
    title: "Dual Aspect Design",
    description: "Street-facing front & lake-facing rear",
  },
  {
    icon: Sparkles,
    title: "Premium Finishes",
    description: "High-quality materials throughout",
  },
  {
    icon: Building2,
    title: "Modern Architecture",
    description: "Contemporary design language",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Advanced security systems and personnel",
  },
  {
    icon: Car,
    title: "Covered Parking",
    description: "Dedicated covered parking spaces",
  },
];

const floorPlans = [
  { type: "Type A", size: "1,450 sq ft", bedrooms: "3 Bed" },
  { type: "Type B", size: "1,680 sq ft", bedrooms: "3 Bed" },
  { type: "Type C", size: "2,100 sq ft", bedrooms: "4 Bed" },
];

const FeaturedProject = () => {
  const [activeTab, setActiveTab] = useState("location");
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const { isDark } = useTheme();

  const projectImages = [
    { src: projectLakeside, dark: projectDark1.url, label: "Lakeside View" },
    { src: projectRoadsideFront, dark: projectDark2.url, label: "Street Front" },
    { src: projectRoadsidePerspective, dark: projectDark3.url, label: "Perspective View" },
  ];

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "location":
        return (
          <motion.div
            key="location"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <motion.div
                  className="relative aspect-[4/5] overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CrossfadeImage
                        light={projectImages[selectedImage].src}
                        dark={projectImages[selectedImage].dark}
                        alt={projectImages[selectedImage].label}
                        isDark={isDark}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    {projectImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-1 h-1 rounded-full transition-all ${
                          selectedImage === index
                            ? "bg-primary"
                            : "bg-background/50 hover:bg-background/70"
                        }`}
                        aria-label={`View ${img.label}`}
                      />
                    ))}
                  </div>
                </motion.div>
                <div className="grid grid-cols-3 gap-2">
                  {projectImages.map((img, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <CrossfadeImage
                        light={img.src}
                        dark={img.dark}
                        alt={img.label}
                        isDark={isDark}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="heading-subsection mb-4">
                  Prime Location in Jolshiri Abashon
                </h3>
                <p className="body-large mb-6">
                  Located within Jolshiri Abashon, this project enjoys a rare dual
                  advantage — open street access at the front and uninterrupted lake
                  views at the back.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Open frontage ensures light, visibility, and easy access",
                    "Lake-facing rear creates privacy, calm, and long-term value",
                    "Positioned within a carefully planned residential zone",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3 body-regular"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4">
                  <a href="#contact" className="btn-primary">
                    Schedule a Site Visit
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                  <a href="#contact" className="btn-secondary">
                    Get Location Details
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case "about":
        return (
          <motion.div
            key="about"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image */}
              <motion.div
                className="aspect-[4/5] overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <CrossfadeImage
                  light={projectRoadsidePerspective}
                  dark={aboutDark.url}
                  alt="Jolshiri Residence - Perspective View"
                  isDark={isDark}
                />
              </motion.div>

              {/* Content */}
              <div>
                <h3 className="heading-subsection mb-4">
                  Designed for Modern Living
                </h3>
                <p className="body-large mb-8">
                  Lakeview Tasmee represents the pinnacle of modern living in Dhaka.
                  This exclusive development combines the tranquility of lakeside
                  living with contemporary architectural design. Each residence is
                  thoughtfully crafted to maximize natural light and ventilation
                  while offering stunning views of the surrounding landscape.
                </p>
                <a href="#contact" className="btn-primary">
                  <Download className="mr-2 w-4 h-4" />
                  Download Project Brochure
                </a>
              </div>
            </div>
          </motion.div>
        );
      case "features":
        return (
          <motion.div
            key="features"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image */}
              <motion.div
                className="aspect-[4/5] overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <CrossfadeImage
                  light={projectLakeside}
                  dark={featuresDark.url}
                  alt="Jolshiri Residence - Lakeside View"
                  isDark={isDark}
                />
              </motion.div>

              {/* Content */}
              <div>
                <h3 className="heading-subsection mb-6">Key Characteristics</h3>
                <div className="grid gap-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg"
                    >
                      <feature.icon className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <ul className="space-y-2 mb-8 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Long-term value driven by permanent lake view
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Reduced rear congestion due to open water body
                  </li>
                </ul>
                <a href="#contact" className="btn-primary">
                  Request Full Specifications
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        );
      case "floorplans":
        return (
          <motion.div
            key="floorplans"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="heading-subsection mb-4">Floor Plans</h3>
            <p className="text-muted-foreground mb-6">
              Select layouts designed to maximize lake-facing views and natural
              airflow.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <img
                src={floorPlanImage.url}
                alt="Floor plan"
                className="w-full object-contain rounded mb-8"
                style={{ maxWidth: "560px" }}
              />
              <a
                href={floorPlanImage.url}
                download="Xen-Lakeview-Tasmee-Floor-Plan.jpeg"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Download className="mr-2 w-4 h-4" />
                Download Floor Plan
              </a>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="featured" className="section-padding">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="label-caps mb-4 block"
          >
            Featured Project
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
            transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
            className="heading-section mb-4"
          >
            Lakeview Tasmee
          </motion.h2>
          <div className="accent-line mx-auto mb-6" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="badge-lakeview"
          >
            <Waves className="w-3 h-3 mr-2" />
            Lakeview Project • On-going
          </motion.div>
        </div>

        {/* Tab Layout */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Vertical Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0"
          >
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`tab-vertical flex items-center gap-3 whitespace-nowrap ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
