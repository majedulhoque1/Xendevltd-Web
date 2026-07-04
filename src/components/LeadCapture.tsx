import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Download, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { leadSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

const LeadCapture = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [trap, setTrap] = useState(""); // honeypot — must stay empty; bots auto-fill every input

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: a filled trap means a bot — pretend success, write nothing.
    if (trap) {
      toast({
        title: "Thank you for showing interest!",
        description: "We will get back to you shortly.",
      });
      setFormData({ name: "", phone: "", message: "" });
      return;
    }

    // Validate form data
    const validation = leadSchema.safeParse({
      full_name: formData.name,
      phone: formData.phone,
      message: formData.message,
    });

    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.error.errors[0].message,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase.from("inquiries").insert({
        type: "contact",
        name: validation.data.full_name,
        phone: validation.data.phone,
        message: validation.data.message || null,
      });

      if (dbError) {
        if (import.meta.env.DEV) {
          console.error("Database error:", dbError);
        }
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "Please try again later.",
        });
        return;
      }

      // Send to Google Sheets via edge function proxy
      await supabase.functions.invoke("webhook-proxy", {
        body: {
          name: validation.data.full_name,
          phone: validation.data.phone,
          message: validation.data.message,
          source: "contact_form",
          submitted_at: new Date().toISOString(),
          status: "New",
        },
      });

      toast({
        title: "Thank you for showing interest!",
        description: "We will get back to you shortly.",
      });
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Form submission error:", error);
      }
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
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
              Interested in This Project?
            </motion.h2>
            <div className="accent-line mb-8" />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="body-large mb-8"
            >
              Let us help you take the next step. Whether you're ready to
              schedule a visit or simply want more information, we're here to
              assist.
            </motion.p>

            {/* Quick Actions */}
            <div className="space-y-4">
              <motion.a
                href="tel:+8801717192730"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Call Us Directly</p>
                  <p className="text-sm text-muted-foreground">
                    01717-19-27-30
                  </p>
                </div>
              </motion.a>

              <motion.a
                href="#"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Download Brochure</p>
                  <p className="text-sm text-muted-foreground">
                    Get complete project details
                  </p>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Right Content - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
            transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
            className="card-premium p-8 lg:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot: visually hidden, off-screen, not tab-reachable. Leave empty. */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="input-premium"
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="input-premium"
                  placeholder="+880 1XXX XXX XXX"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={4}
                  className="input-premium resize-none"
                  placeholder="How can we help you?"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Request a Call Back"}
                {isSubmitting ? (
                  <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                ) : (
                  <Send className="ml-2 w-4 h-4" />
                )}
              </motion.button>

              {/* Trust Note */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Shield className="w-4 h-4" />
                <span>We respond within 24 hours. No spam.</span>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeadCapture;
