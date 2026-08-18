import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

const CONTACT_ROWS = [
  { icon: Phone, label: "Call Us", value: "+880 1234 567 890", href: "tel:+8801234567890" },
  { icon: Mail, label: "Email Us", value: "info@xendevelopments.com", href: "mailto:info@xendevelopments.com" },
  { icon: MapPin, label: "Visit Our Office", value: "Level 5, Xen Tower, Gulshan Avenue, Dhaka", href: undefined },
];

const ContactCallout = () => (
  <section id="contact" className="section-padding bg-surface-alt">
    <div className="container-wide">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left */}
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ duration: 0.8, ease: EASE }}
            className="label-caps mb-2 block"
          >
            Connect With Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 1.0, ease: EASE }}
            className="heading-section mb-4"
          >
            Start Your Journey Home
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="body-large mb-12"
          >
            Looking for a home or a commercial space? Our team is ready to help you find it.
          </motion.p>

          <div className="space-y-6">
            {CONTACT_ROWS.map((row, index) => {
              const content = (
                <>
                  <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 shrink-0">
                    <row.icon className="w-5 h-5 text-primary" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{row.label}</p>
                    <p className="text-muted-foreground text-base mt-0.5">{row.value}</p>
                  </div>
                </>
              );
              const rowCls = "flex items-center gap-4";
              return (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VP}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
                >
                  {row.href ? (
                    <a href={row.href} className={`${rowCls} hover:opacity-80 transition-opacity`}>
                      {content}
                    </a>
                  ) : (
                    <div className={rowCls}>{content}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.9, ease: EASE }}
          className="bg-background border border-sage rounded-2xl p-8"
        >
          <InquiryForm variant="boxed" submitLabel="Send Inquiry" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactCallout;
