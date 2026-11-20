// Shared shell for every public page: topbar, sticky header with the Projects dropdown,
// mobile menu, breadcrumb + Back, footer, floating WhatsApp and the mobile action bar.
// Port of the prototype's layout.js (spec §2–§4).
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { COMPANY, FEATURED, STATUS_LABEL, countStatus, projectPath, statusPath, telHref, waLink } from "../data/site";
import { IcBack, IcCal, IcChev, IcMenu, IcPhone, IcWa } from "../components/icons";
import { applySeo, seoFor } from "../seo";
import "../styles/xen.css";

export type SitePage = "home" | "projects" | "jolshiri" | "about" | "contact" | "other";
export interface Crumb { label: string; to?: string }

interface Props {
  page: SitePage;
  /** Breadcrumb trail; the last item is the current page. Omit on the home page. */
  crumbs?: Crumb[];
  children: ReactNode;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function SiteLayout({ page, crumbs, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const ddRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hoverOpenedAt = useRef(0);

  // Body styling for public pages only (admin keeps its own).
  useEffect(() => {
    document.body.classList.add("xen-public");
    document.documentElement.classList.remove("dark");
    setMounted(true);
    return () => document.body.classList.remove("xen-public");
  }, []);

  // The home hero slides up under the see-through header by exactly the header's height.
  // Measure it (top strip + nav, borders included) on the wrapper so no sliver shows (spec §4).
  useIsoLayoutEffect(() => {
    const set = () => {
      const tb = topRef.current, sh = headRef.current, root = rootRef.current;
      if (!tb || !sh || !root) return;
      root.style.setProperty("--head-h", Math.ceil(tb.getBoundingClientRect().height + sh.getBoundingClientRect().height) + "px");
    };
    set();
    window.addEventListener("resize", set);
    document.fonts?.ready.then(set).catch(() => undefined);
    return () => window.removeEventListener("resize", set);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Title, description, canonical, OG and JSON-LD for this route (spec §6.6).
  useEffect(() => { applySeo(seoFor(location.pathname)); }, [location.pathname]);

  // Close menus on navigation.
  useEffect(() => { setDdOpen(false); setMenuOpen(false); }, [location.pathname, location.hash]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setDdOpen(false); setMenuOpen(false); } };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  const hoverCapable = useRef(false);
  useEffect(() => { hoverCapable.current = window.matchMedia("(hover:hover) and (min-width:1081px)").matches; }, []);
  const leaveTimer = useRef<number>();
  // Track "open" in a ref too: React may apply the hover update after the click that follows
  // it, so the hover-then-click guard must be recorded synchronously (prototype behaviour).
  const ddOpenRef = useRef(false);
  useEffect(() => { ddOpenRef.current = ddOpen; }, [ddOpen]);
  const onDdEnter = () => {
    if (!hoverCapable.current) return;
    window.clearTimeout(leaveTimer.current);
    if (!ddOpenRef.current) hoverOpenedAt.current = Date.now();
    ddOpenRef.current = true;
    setDdOpen(true);
  };
  const onDdLeave = () => {
    if (!hoverCapable.current) return;
    leaveTimer.current = window.setTimeout(() => setDdOpen(false), 180);
  };
  const onDdClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (Date.now() - hoverOpenedAt.current < 600) return;
    setDdOpen((o) => !o);
  };

  useReveal(rootRef, location.pathname);

  const cls = ["xen", mounted ? "js" : "", page === "home" ? "pano" : ""].filter(Boolean).join(" ");
  const cur = (p: SitePage) => (page === p ? { "aria-current": "page" as const } : {});

  return (
    <div ref={rootRef} className={cls} data-page={page}>
      <div className="topbar" ref={topRef}>
        <div className="wrap">
          <div><span className="hide-sm">REHAB member</span><span className="hide-sm">Plans approved by Cantonment Board</span></div>
          <div>
            <span>Hotline <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phones[0]}</a></span>
            <span className="hide-sm"><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></span>
          </div>
        </div>
      </div>
      <header ref={headRef} className={["site-header", scrolled ? "is-scrolled" : "", menuOpen ? "menu-open" : ""].filter(Boolean).join(" ")} id="top">
        <div className="wrap">
          <Link className="brand" to="/" aria-label={`${COMPANY.name} home`}>
            <img src="/img/xen-logo-mark.png" alt="" width={40} height={40} />
            <span className="brand-name"><b>Xen Developments Ltd.</b><small>Builders in Dhaka &amp; Chattogram</small></span>
          </Link>
          <nav className="nav" aria-label="Main">
            <Link to="/" {...cur("home")}>Home</Link>
            <div ref={ddRef} className={["nav-dd", page === "projects" ? "is-current" : "", ddOpen ? "open" : ""].filter(Boolean).join(" ")} onMouseEnter={onDdEnter} onMouseLeave={onDdLeave}>
              <button type="button" aria-expanded={ddOpen} aria-controls="dd-projects" onClick={onDdClick}>Projects <IcChev /></button>
              <div className="dd-panel" id="dd-projects">
                <Link className="dd-feature" to={projectPath(FEATURED)}>
                  <img src={FEATURED.image} alt="" />
                  <b>{FEATURED.name}</b><small>Now booking · Jolshiri Abashon</small>
                </Link>
                <Link to={statusPath("ongoing")}><b>{STATUS_LABEL.ongoing} <span className="count">{countStatus("ongoing")}</span></b><small>Under construction now</small></Link>
                <Link to={statusPath("upcoming")}><b>{STATUS_LABEL.upcoming} <span className="count">{countStatus("upcoming")}</span></b><small>Register early for first pick</small></Link>
                <Link to={statusPath("completed")}><b>{STATUS_LABEL.completed} <span className="count">{countStatus("completed")}</span></b><small>Handed over to owners</small></Link>
              </div>
            </div>
            <Link to="/jolshiri-abashon" {...cur("jolshiri")}>Jolshiri Abashon</Link>
            <Link to="/about" {...cur("about")}>About</Link>
            <Link to="/contact" {...cur("contact")}>Contact</Link>
          </nav>
          <div className="header-cta">
            <a className="btn btn--ghost" href={COMPANY.whatsapp} target="_blank" rel="noopener" style={{ color: "#fff" }}><IcWa /> WhatsApp</a>
            <Link className="btn btn--glow-sm" to="/contact#visit">Book a site visit</Link>
            <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}><IcMenu /></button>
          </div>
        </div>
      </header>

      {crumbs && crumbs.length > 0 && <CrumbBar crumbs={crumbs} />}

      <main>{children}</main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
              <Link className="brand" to="/"><img src="/img/xen-logo-mark.png" alt="" width={40} height={40} /><span className="brand-name" style={{ color: "#fff" }}><b>Xen Developments Ltd.</b><small>15+ years · REHAB member</small></span></Link>
              <p style={{ maxWidth: "34ch" }}>Residential buildings in Jolshiri, Banani, Mirpur DOHS and DOHS Chattogram. Led by {COMPANY.leader}.</p>
            </div>
            <div><h4>Projects</h4><ul>
              <li><Link to={statusPath("ongoing")}>On-going</Link></li>
              <li><Link to={statusPath("upcoming")}>Up-coming</Link></li>
              <li><Link to={statusPath("completed")}>Completed</Link></li>
              <li><Link to={projectPath(FEATURED)}>Lakeview Tasmee</Link></li>
            </ul></div>
            <div><h4>Company</h4><ul>
              <li><Link to="/about">About Xen</Link></li>
              <li><Link to="/jolshiri-abashon">Why Jolshiri</Link></li>
              {/* DEVIATIONS.md C2: goes straight to the payment section */}
              <li><Link to={`${projectPath(FEATURED)}#payment`}>Booking &amp; payment</Link></li>
              <li><Link to="/contact#visit">Book a site visit</Link></li>
            </ul></div>
            <div><h4>Contact</h4><ul>
              {COMPANY.phones.map((p) => <li key={p}><a href={telHref(p)}>{p}</a></li>)}
              <li><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li>{COMPANY.office}</li>
              <li><a href={COMPANY.facebook} target="_blank" rel="noopener">Facebook /XenDevLtd</a></li>
            </ul></div>
          </div>
          <div className="foot-base">
            <span>© {new Date().getFullYear()} {COMPANY.name} All rights reserved. · <Link to="/privacy">Privacy</Link></span>
            <span>Renders are artist's impressions. Specifications may change slightly during construction.</span>
          </div>
        </div>
      </footer>
      <a className="fab-wa" href={waLink("Hi, I'm interested in Xen Lakeview Tasmee, Jolshiri.")} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><IcWa /></a>
      <nav className="mbar" aria-label="Quick contact">
        <a href={`tel:${COMPANY.phoneTel}`}><IcPhone />Call</a>
        <a href={COMPANY.whatsapp} target="_blank" rel="noopener"><IcWa />WhatsApp</a>
        <Link className="go" to="/contact#visit"><IcCal /> Book a visit</Link>
      </nav>
    </div>
  );
}

/** Breadcrumb + Back. Back returns to the previous page when the visitor navigated here
 *  inside the site; a visitor who landed directly goes up one level (spec §2). */
function CrumbBar({ crumbs }: { crumbs: Crumb[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2].to ?? "/" : "/";
  const onBack = useCallback((e: React.MouseEvent) => {
    if (location.key !== "default" && window.history.length > 1) { e.preventDefault(); navigate(-1); }
  }, [location.key, navigate]);
  return (
    <div className="crumbbar"><div className="wrap">
      <Link className="back-btn" to={parent} onClick={onBack}><IcBack /> Back</Link>
      <nav aria-label="Breadcrumb"><ol className="crumbs">
        {crumbs.map((c, i) => (
          <li key={c.label + i}>{i === crumbs.length - 1 || !c.to ? <span aria-current="page">{c.label}</span> : <Link to={c.to}>{c.label}</Link>}</li>
        ))}
      </ol></nav>
    </div></div>
  );
}

/** Reveal-on-scroll: content is visible by default; JS only adds the animation (spec §7).
 *  Watches for .reveal elements added later (tabs, project switch). */
function useReveal(rootRef: React.RefObject<HTMLElement>, key: string) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    const scan = () => root.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    // Safety: never leave content hidden.
    const t = window.setTimeout(() => root.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")), 2500);
    return () => { io.disconnect(); mo.disconnect(); window.clearTimeout(t); };
  }, [rootRef, key]);
}
