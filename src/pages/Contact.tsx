import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LeadCapture from "@/components/LeadCapture";

const Contact = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />
      <main className="pt-24">
        <LeadCapture />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
