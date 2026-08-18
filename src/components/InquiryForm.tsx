import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { leadSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

interface InquiryFormProps {
  /** "boxed" = fully-bordered rounded inputs (Home). "underline" = bottom-border-only inputs (Contact page). */
  variant?: "boxed" | "underline";
  showProjectSelect?: boolean;
  projectOptions?: string[];
  submitLabel?: string;
  className?: string;
}

const InquiryForm = ({
  variant = "boxed",
  showProjectSelect = false,
  projectOptions = [],
  submitLabel = "Send Inquiry",
  className = "",
}: InquiryFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    project: "",
  });
  const [trap, setTrap] = useState(""); // honeypot — must stay empty; bots auto-fill every input
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldCls =
    variant === "boxed"
      ? "w-full px-4 py-3 rounded bg-surface-alt border border-sage focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 placeholder:text-muted-foreground/70"
      : "w-full px-0 py-3 bg-card/60 border-0 border-b-2 border-foreground/80 focus:border-primary outline-none transition-all duration-300 placeholder:text-muted-foreground/60";

  const labelCls =
    variant === "boxed"
      ? "block text-sm font-semibold mb-2"
      : "block text-sm font-semibold mb-2 font-serif";

  const formSpacingCls = variant === "boxed" ? "space-y-6" : "space-y-5";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (trap) {
      toast({ title: "Thank you for showing interest!", description: "We will get back to you shortly." });
      setFormData({ name: "", phone: "", email: "", message: "", project: "" });
      return;
    }

    const validation = leadSchema.safeParse({
      full_name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
      project: formData.project,
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
        email: validation.data.email || null,
        message: validation.data.message || null,
        details: validation.data.project ? { project: validation.data.project } : {},
      });

      if (dbError) {
        if (import.meta.env.DEV) console.error("Database error:", dbError);
        toast({ variant: "destructive", title: "Submission Failed", description: "Please try again later." });
        return;
      }

      await supabase.functions.invoke("webhook-proxy", {
        body: {
          name: validation.data.full_name,
          phone: validation.data.phone,
          email: validation.data.email,
          project: validation.data.project,
          message: validation.data.message,
          source: "contact_form",
          submitted_at: new Date().toISOString(),
          status: "New",
        },
      });

      toast({ title: "Thank you for showing interest!", description: "We will get back to you shortly." });
      setFormData({ name: "", phone: "", email: "", message: "", project: "" });
    } catch (error) {
      if (import.meta.env.DEV) console.error("Form submission error:", error);
      toast({ variant: "destructive", title: "Something went wrong", description: "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${formSpacingCls} ${className}`}>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="inq-name" className={labelCls}>
            Full Name {variant === "underline" && <span className="text-primary">*</span>}
          </label>
          <input
            id="inq-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={fieldCls}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="inq-phone" className={labelCls}>
            Phone Number {variant === "underline" && <span className="text-primary">*</span>}
          </label>
          <input
            id="inq-phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={fieldCls}
            placeholder="+880..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="inq-email" className={labelCls}>
          Email Address {variant === "underline" && <span className="text-primary">*</span>}
        </label>
        <input
          id="inq-email"
          type="email"
          required={variant === "underline"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={fieldCls}
          placeholder="john@example.com"
        />
      </div>

      {showProjectSelect && (
        <div>
          <label htmlFor="inq-project" className={labelCls}>
            Project of Interest
          </label>
          <select
            id="inq-project"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            className={fieldCls}
          >
            <option value="">Select a project (Optional)</option>
            {projectOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="inq-message" className={labelCls}>
          Your Message
        </label>
        <textarea
          id="inq-message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`${fieldCls} resize-none`}
          placeholder="I am interested in..."
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : submitLabel}
        {isSubmitting ? <Loader2 className="ml-2 w-4 h-4 animate-spin" /> : <Send className="ml-2 w-4 h-4" />}
      </motion.button>
    </form>
  );
};

export default InquiryForm;
