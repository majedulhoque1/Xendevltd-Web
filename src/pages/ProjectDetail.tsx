import { ArrowLeft, Waves, MapPin, Calendar, Home, CheckCircle, Building2, Layers, Ruler, Maximize, LayoutGrid, ListChecks, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/WhatsAppButton";
import xenLakeviewTasmeeAsset from "@/assets/Xen_Lakeview_Tasmee.jpeg";
import upcomingBananiAsset from "@/assets/Upcoming_Banani.jpeg";
import upcomingJolshiriAsset from "@/assets/Upcoming_Jolshiri.jpeg";
import project07DesktopAsset from "@/assets/Project_07_Desktop.png";
import project41DesktopAsset from "@/assets/Project_41_Desktop.png";
import project21DesktopAsset from "@/assets/Project_21_Desktop.png";
import lakeviewTasmeeDesktopAsset from "@/assets/Lakeview_Tasmee_Desktop.png";
import project41Asset from "@/assets/Completed_DOHS_Chittagong.jpeg";

const projects = [
  {
    id: 1,
    slug: "xen-lakeview-tasmee",
    name: "Lakeview Tasmee",
    status: "On-going",
    location: "Plot 38, Rd: 504, Sec: 14, Jolshiri Abashon, Dhaka",
    badge: "Lakeview Project",
    description: "A premium residential development featuring dual-aspect design with open street frontage and uninterrupted lake views. Experience lakeside serenity with modern architectural excellence.",
    fullDescription: "Jolshiri Lakeview Residence represents the pinnacle of modern living in Dhaka. This exclusive development combines the tranquility of lakeside living with contemporary architectural design. Each residence is thoughtfully crafted to maximize natural light and ventilation while offering stunning views of the surrounding landscape.",
    features: ["Lake View", "Dual Aspect Design", "Premium Finishes", "Modern Architecture", "24/7 Security", "Covered Parking"],
    amenities: ["Swimming Pool", "Fitness Center", "Children's Play Area", "Community Hall", "Landscaped Gardens"],
    expectedCompletion: "2026",
    image: xenLakeviewTasmeeAsset,
    desktopImage: lakeviewTasmeeDesktopAsset,
    gallery: [xenLakeviewTasmeeAsset],
    buildingType: "Residential Apartment",
    totalFloors: "G+8 (9 Stories)",
    floorArea: "2850 sft",
    configuration: "4 Beds, 5 Baths, 7 Balcony/Verandas",
    frontageNE: "30' Green + 200' Lake + 8' Walking Track",
    frontageSW: "40' Wide Road",
  },
  {
    id: 8,
    slug: "upcoming-banani",
    name: "Project 21",
    status: "Up-coming",
    location: "Block B, Rd 18, Plot 21, Banani, Dhaka",
    badge: null,
    description: "",
    fullDescription: "Details coming soon.",
    features: ["TBD"],
    amenities: ["TBD"],
    expectedCompletion: "TBD",
    image: upcomingBananiAsset,
    desktopImage: project21DesktopAsset,
    gallery: [],
    buildingType: "—",
    totalFloors: "—",
    floorArea: "—",
    configuration: "—",
  },
  {
    id: 9,
    slug: "project-07",
    name: "Project 07",
    status: "On-going",
    location: "Sec 8, Rd 403, Plot 07, Jolshiri, Dhaka",
    badge: null,
    description: "Details coming soon.",
    fullDescription: "Details coming soon.",
    features: ["TBD"],
    amenities: ["TBD"],
    expectedCompletion: "TBD",
    image: upcomingJolshiriAsset,
    desktopImage: project07DesktopAsset,
    gallery: [],
    buildingType: "—",
    totalFloors: "—",
    floorArea: "—",
    configuration: "—",
  },
  {
    id: 10,
    slug: "project-41",
    name: "Project 41",
    status: "On-going",
    location: "Road 2, Plot 41, DOHS Chittagong",
    badge: null,
    description: "",
    fullDescription: "Details coming soon.",
    features: ["TBD"],
    amenities: ["TBD"],
    expectedCompletion: "TBD",
    image: project41Asset,
    desktopImage: project41DesktopAsset,
    gallery: [],
    buildingType: "—",
    totalFloors: "—",
    floorArea: "—",
    configuration: "—",
  },
];

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark, toggleTheme } = useTheme();

  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="pt-20">
        {/* Breadcrumb */}
        <section className="py-4 bg-secondary/30">
          <div className="container-wide">
            <nav className="w-full px-4 py-2 project-breadcrumb">
              <ol className="breadcrumb-row flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-left w-full">
                <li className="flex items-center breadcrumb-mobile-back">
                  <Link to="/projects" aria-label="Back to Projects" className="text-muted-foreground hover:text-foreground" style={{ fontSize: "14px", marginRight: "6px", color: "inherit" }}>
                    ←
                  </Link>
                </li>
                <li className="flex items-center breadcrumb-hide-mobile">
                  <Link to="/" className="text-muted-foreground hover:text-foreground">
                    <Home className="h-3 w-3" />
                  </Link>
                </li>
                <li className="text-muted-foreground breadcrumb-hide-mobile">/</li>
                <li className="flex items-center breadcrumb-hide-mobile">
                  <Link to="/projects" className="text-muted-foreground hover:text-foreground">Projects</Link>
                </li>
                <li className="text-muted-foreground breadcrumb-hide-mobile">/</li>
                <li className="flex items-center">
                  <Link
                    to={`/projects?filter=${
                      project.status === "On-going"
                        ? "ongoing"
                        : project.status === "Up-coming"
                        ? "upcoming"
                        : "completed"
                    }`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {project.status === "On-going"
                      ? "Ongoing"
                      : project.status === "Up-coming"
                      ? "Upcoming"
                      : "Completed"}
                  </Link>
                </li>
                <li className="text-muted-foreground">/</li>
                <li className="flex items-center">
                  <span className="text-foreground font-medium">{project.name}</span>
                </li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative">
          <div
            className={`h-[70vh] md:h-[85vh] overflow-hidden ${
              project.image ? "" : "bg-gradient-to-br from-secondary to-muted"
            }`}
          >
            {project.image ? (
              <>
                <img
                  src={project.image}
                  alt={project.name}
                  className={`w-full h-full object-cover object-center ${
                    (project as any).desktopImage ? "md:hidden" : ""
                  }`}
                />
                {(project as any).desktopImage && (
                  <img
                    src={(project as any).desktopImage}
                    alt={project.name}
                    className="hidden md:block w-full h-full object-cover object-center"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">Image Coming Soon</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Project Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container-wide pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
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
                  {project.badge && (
                    <span className="inline-flex items-center px-3 py-1 text-xs bg-background/90 backdrop-blur-sm rounded-full">
                      <Waves className="w-3 h-3 mr-1 text-primary" />
                      {project.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-gruppo font-semibold text-white drop-shadow-lg">
                  {project.name}
                </h1>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-gruppo font-semibold mb-4">About This Project</h2>
                  <p className="body-large text-muted-foreground mb-6">
                    {project.fullDescription}
                  </p>

                  {/* Features */}
                  <h3 className="text-xl font-gruppo font-semibold mb-4 mt-8">Key Features</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <h3 className="text-xl font-gruppo font-semibold mb-4 mt-8">Amenities</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="card-premium p-6 sticky top-24"
                >
                  <h3 className="text-lg font-gruppo font-semibold mb-4">Project Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Location</span>
                        <p className="text-sm font-medium">{project.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {project.status === "Completed" ? "Status" : "Expected Completion"}
                        </span>
                        <p className="text-sm font-medium">{project.expectedCompletion}</p>
                      </div>
                    </div>

                    {"buildingType" in project && (project as any).buildingType && (
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Building Type</span>
                          <p className="text-sm font-medium">{(project as any).buildingType}</p>
                        </div>
                      </div>
                    )}
                    {"totalFloors" in project && (project as any).totalFloors && (
                      <div className="flex items-start gap-3">
                        <Layers className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Floors</span>
                          <p className="text-sm font-medium">{(project as any).totalFloors}</p>
                        </div>
                      </div>
                    )}
                    {"landArea" in project && (project as any).landArea && (
                      <div className="flex items-start gap-3">
                        <Ruler className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Land Area</span>
                          <p className="text-sm font-medium">{(project as any).landArea}</p>
                        </div>
                      </div>
                    )}
                    {"apartmentSize" in project && (project as any).apartmentSize && (
                      <div className="flex items-start gap-3">
                        <Maximize className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Apartment Size</span>
                          <p className="text-sm font-medium">{(project as any).apartmentSize}</p>
                        </div>
                      </div>
                    )}
                    {"floorArea" in project && (project as any).floorArea && (
                      <div className="flex items-start gap-3">
                        <Maximize className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Floor Area</span>
                          <p className="text-sm font-medium">{(project as any).floorArea}</p>
                        </div>
                      </div>
                    )}
                    {"configuration" in project && (project as any).configuration && (
                      <div className="flex items-start gap-3">
                        <LayoutGrid className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Configuration</span>
                          <p className="text-sm font-medium">{(project as any).configuration}</p>
                        </div>
                      </div>
                    )}
                    {"frontageNE" in project && (project as any).frontageNE && (
                      <div className="flex items-start gap-3">
                        <Compass className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Frontage (NE)</span>
                          <p className="text-sm font-medium">{(project as any).frontageNE}</p>
                        </div>
                      </div>
                    )}
                    {"frontageSW" in project && (project as any).frontageSW && (
                      <div className="flex items-start gap-3">
                        <Compass className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Frontage (SW)</span>
                          <p className="text-sm font-medium">{(project as any).frontageSW}</p>
                        </div>
                      </div>
                    )}
                    {"availableFloors" in project && (project as any).availableFloors && (
                      <div className="flex items-start gap-3">
                        <ListChecks className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Available Floors</span>
                          <p className="text-sm font-medium">{(project as any).availableFloors}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border mt-6 pt-6">
                    <Link to="/#contact" className="btn-primary w-full">
                      {project.status === "Up-coming" ? "Register Interest" : "Schedule a Visit"}
                    </Link>
                    <Link to="/projects" className="btn-secondary w-full mt-3">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Projects
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBotButton />
    </div>
  );
};

export default ProjectDetail;
