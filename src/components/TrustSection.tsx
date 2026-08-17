import { CheckCircle, Recycle, MapPin, Building2, Ruler, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

const TRUST_POINTS = [
  {
    icon: CheckCircle,
    title: "Uncompromising Structural Integrity",
    description: "Engineered beyond standard codes for maximum earthquake resilience.",
  },
  {
    icon: Recycle,
    title: "Sustainable & Green Design",
    description: "Optimized for natural light, cross-ventilation, and energy efficiency.",
  },
  {
    icon: MapPin,
    title: "Prime, Handpicked Locations",
    description: "Strategically situated in Dhaka's most sought-after neighborhoods.",
  },
];

const BADGES = [
  { icon: Building2, title: "BNBC Code", caption: "Strictly Adhered" },
  { icon: Ruler, title: "Grade A", caption: "Materials Used" },
  { icon: ShieldCheck, title: "RAJUK", caption: "100% Approved" },
  { icon: HeartHandshake, title: "Transparent", caption: "Handover Process" },
];

const TrustSection = () => (
  <section id="trust" className="section-padding bg-background">
    <div className="container-wide">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* Left */}
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ duration: 0.8, ease: EASE }}
            className="label-caps mb-4 block"
          >
            Our Promise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 1.0, ease: EASE }}
            className="heading-section mb-6"
          >
            Building Trust Through Structural Integrity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="body-large mb-8"
          >
            We don't just build apartments; we engineer enduring homes. Every Xen Development
            is a testament to our commitment to quality, sustainability, and the long-term
            well-being of our residents.
          </motion.p>

          <ul className="space-y-6">
            {TRUST_POINTS.map((point, index) => (
              <motion.li
                key={point.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VP}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: EASE }}
                className="flex items-start gap-3"
              >
                <point.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{point.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{point.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Badge stack — single column on mobile, 2x2 from sm up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
              className="bg-card border border-sage rounded-xl px-6 py-10 md:py-12 text-center flex flex-col items-center justify-center"
            >
              <badge.icon className="w-8 h-8 text-primary mb-4" strokeWidth={1.5} />
              <p className="font-serif text-xl md:text-2xl font-semibold">{badge.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{badge.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TrustSection;
