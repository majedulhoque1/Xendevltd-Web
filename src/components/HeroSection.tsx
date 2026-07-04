import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import heroImageAsset from "@/assets/Xen_Tasmee_Hero.png";
import heroImageDarkAsset from "@/assets/Xen_Tasmee_Hero_Dark.png";
import CountUp from "@/components/CountUp";

interface HeroSectionProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;
const SWAP_EASE = [0.4, 0, 0.2, 1] as const;

const HeroImageLayer = ({
  url,
  active,
  y,
  transitioning,
}: {
  url: string;
  active: boolean;
  y: MotionValue<number>;
  transitioning: boolean;
}) => (
  <motion.div
    aria-hidden
    className="hero-bg-image absolute inset-0 bg-cover bg-[position:center_bottom]"
    style={{
      backgroundImage: `url(${url})`,
      y: active ? y : 0,
      willChange: transitioning ? "transform, opacity" : "auto",
    }}
    animate={{
      opacity: active ? 1 : 0,
      scale: active ? 1 : 1.04,
    }}
    initial={false}
    transition={{ duration: 1.4, ease: SWAP_EASE }}
  />
);

const STATS = [
  { value: "15+", label: "Core Amenities" },
  { value: "500+", label: "Happy Families" },
  { value: "100%", label: "Transparency" },
];

const HeroSection = (_props: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  // Parallax: background moves at 40% of scroll speed
  const bgY = useTransform(scrollY, [0, 1000], [0, 400]);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const isDark = _props.isDark;
  const prevDark = useRef(isDark);

  useEffect(() => {
    if (prevDark.current === isDark) return;
    prevDark.current = isDark;
    setTransitioning(true);
    const t = window.setTimeout(() => setTransitioning(false), 1400);
    return () => window.clearTimeout(t);
  }, [isDark]);

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[800px] w-full flex flex-col justify-between overflow-hidden"
    >
      {/* Background image with Ken Burns zoom + parallax */}
      {/* Stacked day/night image layers — cinematic cross-fade with parallax */}
      <HeroImageLayer url={heroImageAsset} active={!isDark} y={bgY} transitioning={transitioning} />
      <HeroImageLayer url={heroImageDarkAsset} active={isDark} y={bgY} transitioning={transitioning} />

      {/* Global gradient overlay — shifts smoothly between light/dark */}
      <div
        className="hero-gradient-overlay absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)",
          transition: "background 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Forest-green brand shade from behind/back — tinted gradient pulled from the Xen logo */}
      <div
        className="hero-green-shade absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(16,124,65,0.55) 0%, rgba(13,90,48,0.35) 35%, rgba(8,40,22,0.15) 65%, transparent 100%)",
        }}
      />

      {/* Top spacer for fixed nav */}
      <div className="h-24 md:h-28 shrink-0 relative z-10" />

      {/* MAIN SPLIT CONTENT */}
      <motion.div
        animate={{ opacity: transitioning ? 0.3 : 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="hero-main-grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto w-full px-4 md:px-8 flex-1 items-center pt-8 pb-16 z-10 relative"
      >
        {/* LEFT COLUMN */}
        <div className="grid grid-rows-[auto_auto_auto] items-start text-left">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="hero-eyebrow font-gruppo text-white/90 text-xs uppercase tracking-widest mb-4 inline-flex w-fit max-w-fit items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 whitespace-nowrap"
          >
            Featured Development
            <span
              className="inline-block w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] animate-pulse"
              aria-hidden="true"
            />
            Jolshiri Abashon
          </motion.p>
          <h1
            className="hero-h1 font-gruppo text-white uppercase leading-tight text-[97px]"
            style={{ WebkitTextStroke: "1px #FFFFFF" }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: EASE }}
            >
              LAKEVIEW
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.85, ease: EASE }}
            >
              TASMEE
            </motion.span>
          </h1>
          <motion.div
            className="hero-cta-row flex gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
          >
            <Link
              to="/projects/xen-lakeview-tasmee"
              className="hero-cta font-sans inline-flex items-center justify-center h-12 px-7 text-sm bg-primary text-primary-foreground font-medium tracking-wide rounded-full transition-all duration-300 hover:bg-primary/90"
            >
              Explore Xen Tasmee
            </Link>
            <Link
              to="/schedule-visit"
              className="hero-cta font-sans inline-flex items-center justify-center h-12 px-7 text-sm bg-black/30 backdrop-blur-md border border-white/30 text-white font-medium tracking-wide rounded-full transition-all duration-300 hover:bg-black/40"
            >
              Book A Visit
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col justify-center items-end text-right">
          <h2 className="hero-h2 font-gruppo uppercase text-white leading-tight font-bold" style={{ fontSize: "36px" }}>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: EASE }}
            >
              OPEN TO THE LAKE.
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.85, ease: EASE }}
            >
              OPEN TO THE CITY.
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="hero-subtext text-white/80 text-sm md:text-base leading-relaxed max-w-md mt-4"
          >
            A Thoughtfully Designed Lakeside Residence On The Edge Of Jolshiri
            Abashon — Open Horizons, Considered Architecture, And A Calm That
            Meets The City.
          </motion.p>
        </div>
      </motion.div>

      {/* BOTTOM STATS GRID — floating over lake */}
      <div className="w-full max-w-5xl mx-auto mb-16 mt-8 relative z-10 px-4">
        <div className="grid grid-cols-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 + i * 0.2, ease: EASE }}
              className={`flex flex-col items-center justify-center text-center ${
                i > 0 ? "border-l border-white/50 h-16" : ""
              }`}
            >
              <CountUp
                value={stat.value}
                className="text-5xl font-serif font-semibold text-white leading-none"
              />
              <div className="text-sm lg:text-base text-white/80 mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden
        className="absolute bottom-4 left-0 right-0 z-20 flex justify-center pointer-events-none"
      >
        <motion.div
          className="text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolledPast ? 0 : 1, y: [0, 8, 0] }}
          transition={{
            opacity: { duration: 0.6, ease: EASE },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
