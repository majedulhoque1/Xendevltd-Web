import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Globe, Camera, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import xenLogo from "@/assets/xen-logo.png";

interface NavigationProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

const NAV_LINKS = [
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Logo = ({ compact = false }: { compact?: boolean }) => (
  <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Xen Developments — Home">
    <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[#FCF9F8] overflow-hidden shrink-0">
      <img src={xenLogo} alt="" className="w-full h-full object-cover scale-125" />
    </span>
    {!compact && <span className="font-serif text-white text-lg leading-none">Xen</span>}
  </Link>
);

const Navigation = ({ isDark, onThemeToggle }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4">
        <div
          className="mx-auto flex items-center justify-between gap-2 md:gap-6 rounded-full border border-white/10 bg-ink/85 backdrop-blur-md px-3 py-2 md:px-4 md:py-2.5 shadow-lg shadow-black/10 max-w-fit"
        >
          {/* Mobile: hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-white/90 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Logo compact />

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7 px-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to) ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={onThemeToggle}
            className="p-1.5 text-white/80 hover:text-white transition-colors shrink-0"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-ink transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <Logo />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-white/90 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col px-6 pt-10 gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-serif text-4xl text-white py-3 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mx-6 mt-8 border-t border-white/10" />

        <div className="px-6 mt-8 flex flex-col gap-6">
          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5">
            <span className="flex items-center gap-2.5 text-white/90 text-sm font-medium">
              <Moon className="w-4 h-4" /> Appearance
            </span>
            <button
              onClick={onThemeToggle}
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isDark ? "bg-primary" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                  isDark ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <Link
            to="/contact"
            className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </Link>

          <div className="text-center">
            <a href="tel:+8801717192730" className="text-white/70 text-sm tracking-wide hover:text-white transition-colors">
              01717-19-27-30
            </a>
          </div>

          <div className="flex items-center justify-center gap-5">
            <a href="#" aria-label="Website" className="text-white/70 hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors">
              <Camera className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Community" className="text-white/70 hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </a>
          </div>

          <p className="text-center text-white/40 text-xs">© {new Date().getFullYear()} Xen Developments.</p>
        </div>
      </div>
    </>
  );
};

export default Navigation;
