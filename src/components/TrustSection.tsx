import { CheckCircle, Recycle, MapPin, FlaskConical, Ruler, ShieldCheck, Package } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

const TRUST_POINTS = [
  {
    icon: CheckCircle,
    title: "Structural Integrity",
    description:
      "An RCC shear wall runs foundation to lift-core roof — resisting story drift and sway, not just carrying load.",
  },
  {
    icon: Recycle,
    title: "Designed for the Climate",
    description:
      "Seven balconies per residence, cross-ventilation on both faces, and a heat-proofed top-floor roof.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description: "Handpicked addresses in Dhaka's most desirable neighborhoods.",
  },
];

// Code compliance and site approvals are the legal floor, not a selling point —
// they're stated once as the baseline line under this grid. These four are
// things most Dhaka developers can't claim, and each is verifiable: HBRI lab
// testing and BUET engineers come from the brochure, the material brands are
// named in its specification, and REHAB membership is a trade-body credential.
const BADGES = [
  { icon: FlaskConical, title: "HBRI-Tested", caption: "Concrete & steel sampled" },
  { icon: Ruler, title: "BUET Engineers", caption: "Drawings & supervision" },
  { icon: Package, title: "Named Brands", caption: "KSRM · Seven Rings · TOTO" },
  { icon: ShieldCheck, title: "REHAB Member", caption: "Registered developer" },
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
            className="label-caps mb-2 block"
          >
            Our Promise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 1.0, ease: EASE }}
            className="heading-section mb-8"
          >
            Built on Trust. Engineered to Last.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="body-large mb-8"
          >
            Every developer promises quality. We'd rather hand you the receipts —
            independent lab tests, the actual brand on every major material, and
            engineers whose drawings you can check.
          </motion.p>

          <ul className="space-y-4">
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
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
          {BADGES.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
              className="bg-card border border-sage rounded-sm px-6 py-6 sm:py-10 md:py-12 text-center flex flex-col items-center justify-center -mt-px first:mt-0 sm:mt-0"
            >
              <badge.icon className="w-8 h-8 text-primary mb-4" strokeWidth={1.5} />
              <p className="font-serif text-xl sm:text-2xl font-medium">{badge.title}</p>
              <p className="text-sm text-muted-foreground mt-2">{badge.caption}</p>
            </motion.div>
          ))}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="sm:col-span-2 text-xs text-muted-foreground text-center mt-5 leading-relaxed"
          >
            BNBC 2020 structural design · Cantonment Board approved plans — the baseline
            every Xen build starts from.
          </motion.p>
        </div>
      </div>
    </div>
  </section>
);

export default TrustSection;
