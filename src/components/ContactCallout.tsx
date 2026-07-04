import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ContactCallout = () => (
  <section id="contact" className="section-padding">
    <div className="container-narrow text-center max-w-2xl mx-auto">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="label-caps mb-4 block"
      >
        Get In Touch
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
        transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
        className="heading-section mb-6"
      >
        Have Questions?
      </motion.h2>
      <div className="accent-line mb-8 mx-auto" />
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="body-large mb-8"
      >
        Whether you're ready to schedule a visit or simply want more information, we're here to
        assist.
      </motion.p>
      <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
        Contact Us <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </section>
);

export default ContactCallout;
