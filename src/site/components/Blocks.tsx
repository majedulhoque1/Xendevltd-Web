import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { waLink } from "../data/site";
import { IcWa } from "./icons";

/** "Be a proud owner…" band (client feedback #4). */
export function ProudBand({ children, actions, reveal = true }: { children: ReactNode; actions: ReactNode; reveal?: boolean }) {
  return (
    <section className="proud" aria-label="Own in Jolshiri">
      <div className="wrap">
        <div className={reveal ? "reveal" : undefined} style={{ display: "grid", gap: 18 }}>{children}</div>
        <div className={`proud-actions${reveal ? " reveal" : ""}`}>{actions}</div>
      </div>
    </section>
  );
}

export const AskPriceWa = ({ className = "btn btn--line" }: { className?: string }) => (
  <a className={className} href={waLink("Hi, please send me the price for Lakeview Tasmee.")} target="_blank" rel="noopener"><IcWa />Ask the price on WhatsApp</a>
);

/** Page header with a faded photo behind it. */
export function PageHead({ bg, eyebrow, title, lede }: { bg: string; eyebrow: string; title: ReactNode; lede: ReactNode }) {
  return (
    <section className="page-head page-head--img" style={{ "--bg": `url(${bg})` } as CSSProperties}>
      <div className="wrap"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="lede">{lede}</p></div>
    </section>
  );
}

/** Sunset-visit nudge: once per visit, only after the visitor has scrolled past the lake
 *  section (never on arrival), dismissible. */
export function Nudge({ watchId }: { watchId: string }) {
  const [show, setShow] = useState(false);
  const done = useRef(false);
  useEffect(() => {
    try { if (sessionStorage.getItem("xen-nudge") === "1") return; } catch { /* storage blocked */ }
    const target = document.getElementById(watchId);
    if (!target) return;
    let t = 0;
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting && !done.current) {
        done.current = true;
        t = window.setTimeout(() => { setShow(true); try { sessionStorage.setItem("xen-nudge", "1"); } catch { /* ignore */ } }, 1500);
        io.disconnect();
      }
    }));
    io.observe(target);
    return () => { io.disconnect(); window.clearTimeout(t); };
  }, [watchId]);
  return (
    <aside className={`nudge${show ? " show" : ""}`} aria-label="Sunset site visit" aria-hidden={!show}>
      <img src="/img/tasmee-evening.webp" alt="" loading="lazy" />
      <div className="nudge-body">
        <b>See the lake at sunset</b>
        <p>Visit Sector 14 in the evening, when the view is at its best. We'll fix a time that suits you.</p>
        <Link className="btn" to="/contact#visit" tabIndex={show ? 0 : -1}>Book a sunset visit</Link>
      </div>
      <button className="nudge-x" type="button" aria-label="Close" tabIndex={show ? 0 : -1} onClick={() => setShow(false)}>×</button>
    </aside>
  );
}

/** Key facts as a <dl>, plus Price/Handover rows with an "Ask" WhatsApp link (prototype factsHTML). */
export function Facts({ facts, price, handover, name }: { facts: [string, string][]; price?: string; handover?: string; name: string }) {
  return (
    <dl className="facts">
      {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      {price && (
        <>
          <div><dt>Price</dt><dd>{price} <a className="link-arrow" style={{ fontSize: ".85rem" }} href={waLink(`Price for ${name}?`)} target="_blank" rel="noopener">Ask</a></dd></div>
          <div><dt>Handover</dt><dd>{handover}</dd></div>
        </>
      )}
    </dl>
  );
}
