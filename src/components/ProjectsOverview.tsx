import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import xenOrionAsset from "@/assets/Xen_Orion_Plot_30__Road_2__DOHS_Chittagong.jpeg";
import xenAndromedaAsset from "@/assets/Xen_Andromeda_Plot_29__Rd_2__DOHS_Chittagong.jpeg";
import xenPegasusAsset from "@/assets/Xen_Pegasus_Plot_1__Road_1__DOHS_Chittagong.jpeg";
import xenCassiopeaAsset from "@/assets/Xen_Cassiopea.jpeg";
import xenSarwarAsset from "@/assets/Xen_Sarwar.jpeg";
import xenScorpiosAsset from "@/assets/Xen_Scorpios.jpeg";
import xenElysiumAsset from "@/assets/Xen_Elysium.jpeg";
import xenPrimaVeraAsset from "@/assets/Xen_Prima_Vera.jpeg";
import project818Asset from "@/assets/Project_818.jpeg";
import project994Asset from "@/assets/Project_994.jpeg";
import project1026Asset from "@/assets/Project_1026.jpeg";
import xenNirvanaAsset from "@/assets/Xen_Nirvana.png";

const projects = [
  { id: 1, name: "Xen Orion", location: "Plot 30, Road 2, DOHS Chittagong", image: xenOrionAsset },
  { id: 2, name: "Xen Andromeda", location: "Plot 29, Road 2, DOHS Chittagong", image: xenAndromedaAsset },
  { id: 3, name: "Xen Pegasus", location: "Plot 1, Road 1, DOHS Chittagong", image: xenPegasusAsset },
  { id: 4, name: "Xen Cassiopea", location: "Chittagong DOHS", image: xenCassiopeaAsset },
  { id: 5, name: "Xen Sarwar", location: "Chittagong DOHS", image: xenSarwarAsset },
  { id: 6, name: "Xen Scorpios", location: "Chittagong DOHS", image: xenScorpiosAsset },
  { id: 7, name: "Xen Elysium", location: "Mirpur DOHS, Dhaka", image: xenElysiumAsset },
  { id: 8, name: "Xen Prima Vera", location: "Mirpur DOHS, Dhaka", image: xenPrimaVeraAsset },
  { id: 9, name: "Project 818", location: "Mirpur DOHS, Dhaka", image: project818Asset },
  { id: 10, name: "Project 994", location: "Mirpur DOHS, Dhaka", image: project994Asset },
  { id: 11, name: "Project 1026", location: "Mirpur DOHS, Dhaka", image: project1026Asset },
  { id: 12, name: "Xen Nirvana", location: "Mirpur DOHS, Dhaka", image: xenNirvanaAsset },
];

const ProjectsOverview = () => {
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay.current]
  );
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );
  return (
    <section id="projects" className="section-padding bg-secondary/30">
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
            Our Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
            transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
            className="heading-section mb-4"
          >
            Our Developments
          </motion.h2>
          <div className="accent-line mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="body-large max-w-2xl mx-auto"
          >
            Homes built with care, clarity, and long-term vision.
          </motion.p>
        </div>

        {/* Auto-sliding Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-3"
              >
                <div className="relative overflow-hidden rounded-lg group aspect-[4/5] shadow-lg">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-gruppo font-semibold mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm opacity-90">{project.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-foreground/30 hover:bg-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mt-12"
        >
          <Link to="/projects" className="btn-secondary">
            View All Projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsOverview;
