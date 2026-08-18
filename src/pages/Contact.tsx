import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/WhatsAppButton";
import InquiryForm from "@/components/InquiryForm";
import { BOOKABLE_PROJECTS } from "@/data/bookableProjects";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const DIRECT_CONTACT = [
  { icon: Phone, label: "Phone", value: "01717-19-27-30", href: "tel:+8801717192730" },
  { icon: MessageCircle, label: "WhatsApp", value: "Message Us", href: "https://wa.me/8801717192730" },
  { icon: Mail, label: "Email", value: "info@xendevelopments.com", href: "mailto:info@xendevelopments.com" },
  { icon: MapPin, label: "Corporate Office", value: "Level 5, Xen Tower\nGulshan Avenue, Dhaka", href: undefined },
];

const Contact = () => {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="pt-28 md:pt-32 pb-20 md:pb-28">
        <div className="container-wide">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Contact</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="body-large max-w-xl mt-5"
          >
            Have a project in mind? Let's talk.
          </motion.p>

          <div className="grid lg:grid-cols-2 gap-6 mt-12">
            {/* Direct Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="border border-border rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-serif text-2xl mb-6">Direct Contact</h2>
              <div className="space-y-6">
                {DIRECT_CONTACT.map((row) => {
                  const content = (
                    <>
                      <row.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                          {row.label}
                        </p>
                        <p className="font-medium whitespace-pre-line mt-0.5">{row.value}</p>
                      </div>
                    </>
                  );
                  return row.href ? (
                    <a
                      key={row.label}
                      href={row.href}
                      target={row.href.startsWith("http") ? "_blank" : undefined}
                      rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-4 hover:opacity-80 transition-opacity"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={row.label} className="flex items-start gap-4">
                      {content}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Send an Inquiry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="border border-border rounded-2xl p-6 md:p-8"
            >
              <h2 className="font-serif text-2xl mb-6">Send an Inquiry</h2>
              <InquiryForm
                variant="underline"
                showProjectSelect
                projectOptions={BOOKABLE_PROJECTS}
                submitLabel="Send Inquiry"
              />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatBotButton />
    </div>
  );
};

export default Contact;
