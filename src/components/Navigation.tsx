import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import xenLogo from "@/assets/xen-logo.png";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

const Navigation = ({ isDark, onThemeToggle }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const overHero = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scrollspy for the #contact section on the home page
  useEffect(() => {
    if (!isHome) {
      setContactInView(false);
      return;
    }
    const el = document.getElementById("contact");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactInView(entry.isIntersecting),
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHome, location.pathname]);

  const isProjectsActive = location.pathname.startsWith("/projects");
  const isAboutActive = location.pathname.startsWith("/about");
  const isContactActive = isHome && contactInView;

  const linkClass = (active: boolean) =>
    `relative text-sm font-medium transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${
      active ? "after:w-full" : "after:w-0 hover:after:w-full"
    } ${
      active
        ? overHero
          ? "text-white"
          : "text-primary"
        : overHero
        ? "text-white/90 hover:text-white"
        : "text-foreground/80 hover:text-primary"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `block py-2 text-lg font-medium transition-colors ${
      active ? "text-primary" : "text-foreground hover:text-primary"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        overHero
          ? "bg-transparent pt-6 pb-4"
          : "bg-background/95 backdrop-blur-lg border-b border-border/50 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative flex items-center justify-between h-14">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <img
              src={xenLogo}
              alt="Xen Developments"
              className="h-10 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation — Centered Links in Glassmorphic Pill */}
          <div
            className={`hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 rounded-full px-8 py-2.5 backdrop-blur-md border transition-all duration-500 ${
              !overHero
                ? "bg-background/60 border-border/40"
                : "bg-white/5 border-white/10"
            }`}
          >
            <Link to="/projects" className={linkClass(isProjectsActive)}>
              Projects
            </Link>
            <Link to="/about" className={linkClass(isAboutActive)}>
              About
            </Link>
            <Link to="/#contact" className={linkClass(isContactActive)}>
              Contact
            </Link>
          </div>

          {/* Right Side — Theme toggle + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <a
              href="tel:+8801717192730"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Call Now: 01717-19-27-30
            </a>
          </div>

          {/* Mobile Menu Button + Call Now + Theme Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:+8801717192730"
              className="nav-call-mobile inline-flex items-center justify-center px-2.5 py-1.5 bg-primary text-primary-foreground text-[11px] font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Call Now
            </a>
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors ${!overHero ? "text-foreground" : "text-white"}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-4">
            <Link
              to="/projects"
              className={mobileLinkClass(isProjectsActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/about"
              className={mobileLinkClass(isAboutActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/#contact"
              className={mobileLinkClass(isContactActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <a
              href="tel:+8801717192730"
              className="inline-flex items-center justify-center w-full px-5 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors mt-4"
            >
              Call Now: 01717-19-27-30
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
