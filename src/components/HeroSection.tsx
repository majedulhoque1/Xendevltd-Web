import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImageAsset from "@/assets/Xen_Tasmee_Hero.png";
import heroImageDarkAsset from "@/assets/Xen_Tasmee_Hero_Dark.png";
import CountUp from "@/components/CountUp";

interface HeroSectionProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

const STATS = [
  { value: "15+", label: "Years of Excellence" },
  { value: "24", label: "Completed Projects" },
  { value: "500+", label: "Happy Families" },
  { value: "100%", label: "On-time Delivery" },
];

const HeroSection = ({ isDark }: HeroSectionProps) => {
  return (
    <section className="relative w-full min-h-[820px] flex flex-col overflow-hidden bg-ink">
      {/* Background photo — day/night crossfade */}
      <div className="absolute inset-0">
        <img
          src={heroImageAsset}
          alt="Xen Lakeview Tasmee at dusk"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
          style={{ opacity: isDark ? 0 : 1 }}
        />
        <img
          src={heroImageDarkAsset}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
          style={{ opacity: isDark ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      </div>

      <div className="h-24 md:h-28 shrink-0" />

      <div className="relative z-10 flex-1 flex flex-col justify-center container-wide w-full py-10 md:py-16">
        <div className="lg:max-w-[760px] lg:pb-12">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-serif font-semibold text-white text-[2rem] leading-[1.2] sm:text-6xl sm:leading-[1.08] md:text-[4rem] md:leading-[1.1] max-w-3xl"
          >
            Dhaka's Premium Addresses, Engineered for Generations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="text-white/75 text-base md:text-lg leading-[1.8] md:leading-relaxed max-w-xl mt-6"
          >
            Built on a foundation of structural integrity and uncompromising trust. We create
            enduring investment value through meticulous engineering and premium architectural
            substance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="flex flex-col items-start gap-4 mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:mt-8"
          >
            <Link to="/projects" className="btn-primary">
              Explore Developments
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded text-sm border border-white text-white font-semibold tracking-wide transition-all duration-300 hover:bg-white/10"
            >
              Inquire Now
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        className="relative z-10 container-wide w-full pb-10 md:pb-14"
      >
        <div className="rounded-sm border border-white/15 bg-black/30 backdrop-blur-sm p-6 grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start text-left">
              <CountUp value={stat.value} className="font-serif text-4xl md:text-5xl text-[#CCE9D8] leading-none" />
              <div className="text-xs md:text-sm text-white/70 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
