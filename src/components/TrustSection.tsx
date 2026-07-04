import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "@/components/CountUp";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const TrustSection = () => {
  const trustPoints = [
    "Commitment to quality construction and premium materials",
    "Thoughtful design approach prioritizing light and space",
    "Track record of responsible, on-time development",
  ];

  const stats = [
    { value: "15+", label: "Years of Excellence" },
    { value: "20+", label: "Projects Delivered" },
    { value: "500+", label: "Happy Families" },
    { value: "100%", label: "On-time Delivery" },
  ];

  return (
    <section id="trust" className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="label-caps mb-4 block"
            >
              Our Promise
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
              transition={{ duration: 1.0, ease: EASE }}
              className="heading-section mb-6"
            >
              Why Buyers Trust Xen Developments
            </motion.h2>
            <div className="accent-line mb-8" />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="body-large mb-8"
            >
              We focus on rare locations, open layouts, and thoughtful planning
              — selecting sites that offer light, airflow, and long-term
              livability, not just density.
            </motion.p>

            <ul className="space-y-4 mb-10">
              {trustPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.2, ease: EASE }}
                  className="flex items-start gap-3 body-regular"
                >
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
              transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
            >
              <Link
                to="/about"
                className="btn-ghost text-primary p-0 group inline-flex items-center"
              >
                Learn More About Xen
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                transition={{ duration: 0.9, delay: index * 0.15, ease: EASE }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="card-premium p-8 text-center"
              >
                <CountUp
                  value={stat.value}
                  className="text-5xl font-serif font-semibold text-primary"
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
