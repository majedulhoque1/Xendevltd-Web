import { Compass, Gem, Clock, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/WhatsAppButton";
import CountUp from "@/components/CountUp";
import craneAsset from "@/assets/project-roadside-perspective.png";
import facadeAsset from "@/assets/project-roadside-front.jpg";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

const STATS = [
  { value: "15+", label: "Years of Excellence" },
  { value: "24", label: "Completed Projects" },
  { value: "500+", label: "Happy Families" },
  { value: "100%", label: "On-time Delivery" },
];

const TENETS = [
  {
    icon: Compass,
    title: "Structural Integrity",
    description:
      "Adherence to strict BNBC Codes and international standards, ensuring buildings that withstand the test of time and elements.",
  },
  {
    icon: Gem,
    title: "Premium Materials",
    description:
      "Sourcing only Grade A materials, from the foundation steel to the finishing tiles, prioritizing durability and aesthetic refinement.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "A transparent construction process and rigorous project management guarantee that timelines are commitments, not estimates.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assurance",
    description:
      "Fully RAJUK approved projects undergoing multi-stage quality checks by independent engineering consultants.",
  },
];

const About = () => {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="pt-28 md:pt-32">
        {/* Breadcrumb + hero */}
        <section className="container-wide">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">About</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.1] max-w-3xl"
          >
            Xen: The Fusion of Executive Vision &amp; Engineering Excellence.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="body-large max-w-2xl mt-6"
          >
            Dedicated to redefining Dhaka's skyline through uncompromising structural
            integrity, premium materials, and a commitment to long-term architectural value.
          </motion.p>
        </section>

        {/* Foundation + Philosophy split */}
        <section className="container-wide mt-14 md:mt-16">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.7, ease: EASE }}
              className="rounded-xl border border-border overflow-hidden flex flex-col h-full"
            >
              <img src={craneAsset} alt="Xen construction site" className="w-full flex-1 min-h-[220px] object-cover" />
              <div className="p-6 md:p-8 shrink-0">
                <h3 className="font-serif text-2xl mb-3">Our Foundation</h3>
                <p className="text-muted-foreground">
                  Built on the premise that true luxury is derived from structural
                  permanence and meticulous planning.
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                className="border-l-2 border-primary bg-surface rounded-r-xl p-6 md:p-8"
              >
                <h3 className="font-serif text-2xl mb-3">The Xen Philosophy</h3>
                <p className="text-muted-foreground">
                  Xen was founded to bridge the gap between ambitious architectural vision
                  and rigorous engineering execution. We view every project not just as a
                  development, but as a long-term contribution to the urban fabric. Our
                  process prioritizes meticulous planning, sourcing only Grade A materials,
                  and adhering strictly to international building codes to ensure
                  generations of stability.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="rounded-xl overflow-hidden flex-1 min-h-[180px]"
              >
                <img src={facadeAsset} alt="Xen facade detail" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="bg-ink text-white mt-16 md:mt-20 py-14 md:py-16">
          <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
              >
                <CountUp value={stat.value} className="font-serif text-4xl md:text-5xl text-sage leading-none" />
                <p className="text-white/60 text-xs uppercase tracking-[0.15em] mt-3">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Core Tenets */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="flex items-end justify-between pb-6 mb-10 border-b border-border">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.8, ease: EASE }}
                className="heading-section"
              >
                Core Tenets
              </motion.h2>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground hidden sm:block">
                The Xen Standard
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TENETS.map((tenet, index) => (
                <motion.div
                  key={tenet.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
                  className="border border-border rounded-xl p-6"
                >
                  <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-surface mb-5">
                    <tenet.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  </span>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-3">{tenet.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tenet.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-wide pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.8, ease: EASE }}
            className="bg-ink text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-3">Interested in a Project?</h2>
              <p className="text-white/60 max-w-md">
                Discuss your requirements with our dedicated executive team to find the
                perfect investment or residential space.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link to="/projects" className="btn-primary">
                Explore Developments
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-12 px-7 rounded-lg text-sm border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
      <ChatBotButton />
    </div>
  );
};

export default About;
