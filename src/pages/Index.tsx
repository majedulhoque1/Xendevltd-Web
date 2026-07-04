import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import FeaturedProject from "@/components/FeaturedProject";
import ProjectsOverview from "@/components/ProjectsOverview";
import ContactCallout from "@/components/ContactCallout";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/WhatsAppButton";

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Handle hash navigation (scroll to section)
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />
      <main>
        <HeroSection isDark={isDark} onThemeToggle={toggleTheme} />
        <TrustSection />
        <FeaturedProject />
        <ProjectsOverview />
        <ContactCallout />
      </main>
      <Footer />
      <ChatBotButton />
    </div>
  );
};

export default Index;
