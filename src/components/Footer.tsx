import { Link } from "react-router-dom";
import xenLogo from "@/assets/xen-logo.png";

const PROPERTY_LINKS = [
  { label: "Residential Projects", to: "/projects" },
  { label: "Commercial Hubs", to: "/projects" },
  { label: "Our Locations", to: "/contact" },
];

const CORPORATE_LINKS = [
  { label: "Legal Compliance", to: "/about" },
  { label: "Privacy Policy", to: "/about" },
  { label: "Contact Support", to: "/contact" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-10 md:gap-8">
          {/* Brand */}
          <div className="min-w-0">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 shrink-0">
                <img src={xenLogo} alt="" className="w-full h-full object-contain" />
              </span>
              <span className="font-serif text-2xl text-white leading-tight">
                Xen Developments Ltd.
              </span>
            </Link>
            <p className="text-white/50 text-sm">
              © {currentYear} Xen Developments. RAJUK Approved.
            </p>
          </div>

          {/* Properties */}
          <div className="min-w-0">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">Properties</h4>
            <ul className="space-y-3">
              {PROPERTY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-white/60 hover:text-white transition-colors text-base">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate */}
          <div className="min-w-0">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">Corporate</h4>
            <ul className="space-y-3">
              {CORPORATE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-white/60 hover:text-white transition-colors text-base">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">Xen Developments Limited — Dhaka, Bangladesh</p>
          <Link to="/admin/login" className="text-white/40 hover:text-white/70 transition-colors text-xs">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
