import { ArrowRight, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import xenLogo from "@/assets/xen-logo.png";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VP = { once: true, margin: "0px 0px -50px 0px", amount: 0.15 } as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#trust" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/XenDevLtd", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container-wide py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-2"
          >
            <a href="/" className="inline-block mb-6">
              <img 
                src={xenLogo} 
                alt="Xen Developments" 
                className="h-14 w-auto brightness-0 invert dark:brightness-100 dark:invert-0"
              />
            </a>
            <p className="text-background/70 max-w-md mb-6">
              Creating premium residential spaces in Dhaka with a focus on
              quality, thoughtful design, and long-term value.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-background/20 rounded-full flex items-center justify-center hover:bg-background/10 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VP}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE }}
                >
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-background/70">
              <li>Dhaka, Bangladesh</li>
              <li>
                <a
                  href="tel:+8801717192730"
                  className="hover:text-background transition-colors"
                >
                  01717-19-27-30
                </a>
              </li>
              <li>
                <a
                  href="mailto:xendevltd@gmail.com"
                  className="hover:text-background transition-colors"
                >
                  xendevltd@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* CTA Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-16 pt-8 border-t border-background/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-background/70">
              Ready to find your dream home?
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-12 px-7 text-sm bg-background text-foreground font-medium transition-opacity hover:opacity-90"
              >
                Schedule a Site Visit
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-12 px-7 text-sm border border-background/30 font-medium transition-colors hover:bg-background/10"
              >
                Download Brochure
              </a>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-12 pt-8 border-t border-background/10 flex items-center justify-between text-sm text-background/50"
        >
          <p>
            © {currentYear} Xen Developments Ltd. All rights reserved.
          </p>
          <a
            href="https://xendevltd.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-background/50 hover:text-background/80 transition-colors text-xs mr-20 md:mr-24"
          >
            Admin Login
          </a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
