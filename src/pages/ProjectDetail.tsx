// One template for every project; layout depends on status (spec §5). Port of renderProject().
import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/site/layout/SiteLayout";
import { Film } from "@/site/components/Film";
import { JolshiriMap } from "@/site/components/Drawings";
import { FloorTower } from "@/site/components/FloorTower";
import { ProjectCard } from "@/site/components/Cards";
import { ContactList, LeadForm } from "@/site/components/Contact";
import { Facts } from "@/site/components/Blocks";
import { IcDoc, IcWa } from "@/site/components/icons";
import { BROCHURE, FEATURED, PROJECTS, SHOW_INTERNAL_NOTES, STATUS_LABEL, getProject, projectPath, statusPath, waLink, type Project } from "@/site/data/site";
import NotFound from "./NotFound";

const Tbc = ({ children }: { children: ReactNode }) => (SHOW_INTERNAL_NOTES ? <p className="note-tbc">{children}</p> : null);

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = getProject(slug);
  if (!p) return <NotFound />;
  return <ProjectPage key={p.slug} p={p} />;
}

function ProjectPage({ p }: { p: Project }) {
  const status = STATUS_LABEL[p.status];
  const gallery = p.gallery ?? [{ src: p.image, cap: p.name }];
  const isFeat = !!p.specs, isUp = p.status === "upcoming", isDone = p.status === "completed";
  const hasFilm = !!p.film;
  const [shown, setShown] = useState(0);
  const [active, setActive] = useState("overview");
  const intro = p.summary ?? (isDone ? `${p.name} is a residential building at ${p.address}, built and handed over by Xen Developments Ltd. Owners live here today.` : "");
  const waText = isDone ? `Hi, I'd like to know more about ${p.name}.` : `Hi, please send me details and the price for ${p.name}.`;
  const facts: [string, string][] = p.facts ?? [["Location", p.address], ["Area", p.area], ["Status", isDone ? "Handed over to owners" : status], ["Developer", "Xen Developments Ltd."]];
  const others = PROJECTS.filter((x) => x.slug !== p.slug && (x.status === p.status || x.featured)).slice(0, 3);

  const sections: [id: string, label: string][] = [["overview", "Overview"]];
  if (isFeat) sections.push(["film", hasFilm ? "Film" : "Renders"], ["plans", "Floor plans"], ["location", "Location"], ["specs", "Specifications"], ["payment", "Payment"]);
  sections.push(["enquire", isDone ? "Contact" : "Enquire"]);

  // Scroll-spy for the sub-nav.
  useEffect(() => {
    const spy = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); }), { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(([id]) => { const el = document.getElementById(id); if (el) spy.observe(el); });
    return () => spy.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.slug]);

  const primary = isDone
    ? <Link className="btn" to={statusPath("ongoing")}>See projects for sale</Link>
    : isUp ? <Link className="btn" to="#enquire" replace>Register interest</Link>
    : <Link className="btn" to="/contact#visit">Book a site visit</Link>;

  return (
    <SiteLayout page="projects" crumbs={[{ label: "Home", to: "/" }, { label: "Projects", to: statusPath(p.status) }, { label: status, to: statusPath(p.status) }, { label: p.name }]}>
      <section className="p-hero" id="p-hero">
        <div className="wrap">
          <div className="copy">
            <span className={`badge badge--${p.status}`} style={{ position: "static", justifySelf: "start" }}>{status}{isFeat ? " · Now booking" : ""}</span>
            <h1>{p.name}</h1>
            <p className="addr">{p.address}</p>
            <p className="lede" style={{ color: "#c9d3cc" }}>{intro}</p>
            <div className="ctas">
              {primary}
              <a className="btn btn--wa" href={waLink(waText)} target="_blank" rel="noopener"><IcWa /> WhatsApp</a>
              {isFeat && <a className="btn btn--ghost" href={BROCHURE}><IcDoc /> Brochure</a>}
            </div>
          </div>
          <div className="gallery">
            <figure className="gallery-main" style={{ margin: 0 }}>
              <img key={gallery[shown].src} src={gallery[shown].src} alt={`${p.name}: ${gallery[shown].cap}`} />
              <figcaption>{gallery[shown].cap}</figcaption>
            </figure>
            {gallery.length > 1 && (
              <div className="thumbs">
                {gallery.map((g, i) => (
                  <button key={g.src} type="button" aria-pressed={i === shown} aria-label={`Show ${g.cap}`} onClick={() => setShown(i)}><img src={g.src} alt="" loading="lazy" /></button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <nav className="subnav" id="p-subnav" aria-label="On this page">
        <div className="wrap">
          {sections.map(([id, label]) => <Link key={id} to={`#${id}`} replace className={active === id ? "is-active" : undefined}>{label}</Link>)}
          {!isDone && <Link className="btn" to="#enquire" replace>{isUp ? "Register" : "Get price"}</Link>}
        </div>
      </nav>

      <section className="band" id="overview">
        <div className="wrap glance">
          <div className="stack">
            <div className="section-head" style={{ margin: 0 }}>
              <span className="eyebrow">At a glance</span>
              <h2>{isFeat ? "Lakeside living, one home per floor." : isDone ? "Built, handed over and lived in." : isUp ? `Coming soon to ${p.area}.` : `Under construction in ${p.area}.`}</h2>
            </div>
            {p.facts ? <Facts facts={p.facts} price={p.price} handover={p.handover} name={p.name} /> : <Facts facts={facts} name={p.name} />}
            {isFeat && <div className="guarantee"><b>৳40,000</b><span>a month paid to you for every month of late handover, written into the Deed of Agreement.</span></div>}
          </div>
          <div className="stack">
            {isFeat ? <FloorTower />
              : isDone ? (
                <div className="panel">
                  <h3>What owners got</h3>
                  <p style={{ color: "var(--muted)" }}>Every Xen building uses the same standard: BUET-designed structure to BNBC, HBRI-tested materials, KSRM steel, TOTO sanitary fittings and Hatil doors.</p>
                  <Tbc>To add: handover year, number of apartments, sizes and an owner's quote</Tbc>
                  <Link className="link-arrow" to={projectPath(FEATURED)}>See our current project at Jolshiri</Link>
                </div>
              ) : isUp ? (
                <div className="panel">
                  <h3>Be first in line</h3>
                  <p style={{ color: "var(--muted)" }}>Registered buyers see floor plans and prices before the public launch and get first choice of floors.</p>
                  <Tbc>To add: land size (katha), storeys, apartment sizes, expected launch date</Tbc>
                  <Link className="btn btn--green" to="#enquire" replace>Register interest</Link>
                </div>
              ) : (
                <div className="panel">
                  <h3>Ask about this building</h3>
                  <p style={{ color: "var(--muted)" }}>Built to the same specification as Lakeview Tasmee. Call or WhatsApp us for apartment sizes, open floors and prices.</p>
                  <Tbc>To add: storeys, sizes, price, handover date and progress photos</Tbc>
                  <Link className="btn btn--green" to="#enquire" replace>Ask for details</Link>
                </div>
              )}
          </div>
        </div>
      </section>

      {isFeat && (
        <>
          <section className="band band--dark" id="film">
            <div className="wrap film-grid">
              <div className="section-head" style={{ margin: 0 }}>
                {/* DEVIATIONS.md A1 */}
                <span className="eyebrow">{hasFilm ? "Project film" : "The project"}</span>
                <h2>{hasFilm ? "See the lake from Level 8." : "See Lakeview Tasmee from every side."}</h2>
                <p className="lede">{hasFilm ? "A drone and walkthrough film of the plot, the lake edge and the finished look." : "Renders of the lakeside, the road front and the evening view."}</p>
              </div>
              <div>
                <Film reel={gallery.slice(0, 4).map((g) => g.src)} video={p.film} title={p.name} sub={hasFilm ? "Project film" : "Artist's impressions"} label="Play project film" />
              </div>
            </div>
          </section>

          <section className="band band--tint" id="plans">
            <div className="wrap">
              <div className="section-head"><span className="eyebrow">Floor plans</span><h2>4 bedrooms, 5 baths, 7 balconies.</h2><p className="lede">Bedrooms and the living room open to the lake on the north-east. You can ask for layout changes before you sign the Deed of Agreement.</p></div>
              <div className="plans">
                {(p.plans ?? []).map((pl) => (
                  <figure key={pl.src}>
                    <a href={pl.src} target="_blank" rel="noopener"><img src={pl.src} alt={pl.cap} loading="lazy" /></a>
                    <figcaption>{pl.cap}<a className="link-arrow" style={{ fontSize: ".85rem" }} href={waLink(`Price for ${p.name}, ${pl.cap}?`)} target="_blank" rel="noopener">Ask price</a></figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className="band band--dusk" id="location">
            <div className="wrap jol-grid">
              <div className="stack">
                <span className="eyebrow">Location</span><h2>Sector 14, on Jolshiri Lake.</h2>
                <p className="lede">Close to Jolshiri Central Park and the Central Business District. Enter from the 300 ft Purbachal expressway in the north or Madani Avenue in the south.</p>
                <div className="amen"><span>NE: 30 ft green + 8 ft track + 200 ft lake</span><span>SW: 60 ft road</span><span>Near Central Park</span><span>Near CBD</span></div>
                <Link className="link-arrow" to="/jolshiri-abashon">Why Jolshiri Abashon</Link>
              </div>
              <figure className="map-card" style={{ margin: 0 }}>
                <JolshiriMap />
                {SHOW_INTERNAL_NOTES && <figcaption>Google Map pin to be added on the live site.</figcaption>}
              </figure>
            </div>
          </section>

          <section className="band" id="specs">
            <div className="wrap">
              <div className="section-head"><span className="eyebrow">Building specifications</span><h2>Every brand named, every sample tested.</h2></div>
              <dl className="spec-list">{(p.specs ?? []).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          </section>

          <section className="band band--tint" id="payment">
            <div className="wrap">
              <div className="section-head"><span className="eyebrow">Booking &amp; payment</span><h2>Clear terms, written into your agreement.</h2></div>
              <div className="terms">
                <div><b>৳5 lakh booking</b><span>Non-refundable. Your apartment is allotted and a receipt issued.</span></div>
                <div><b>30% at agreement</b><span>Paid when the Deed of Agreement is signed, less the booking money.</span></div>
                <div><b>Up to 30 instalments</b><span>Monthly, counted from the start of piling. Join later and the count is shorter.</span></div>
                <div><b>৳40,000 / month if late</b><span>Paid to you for late handover, as long as your instalments are on time.</span></div>
              </div>
              <h3 style={{ margin: "48px 0 20px" }}>Construction progress</h3>
              <ol className="progress">
                {["Booking open", "Piling", "Structure", "Brickwork", "Finishing", "Handover"].map((s, i) => (
                  <li key={s} className={i === 0 ? "done" : undefined}><b>{s}</b>{i === 0 ? "Now" : ""}</li>
                ))}
              </ol>
              {SHOW_INTERNAL_NOTES && <p className="note-tbc" style={{ marginTop: 16 }}>To add: current stage, monthly site photos and projected handover date</p>}
            </div>
          </section>
        </>
      )}

      <section className="band band--dark" id="enquire">
        <div className="wrap enquiry">
          <div>
            <div className="section-head" style={{ margin: 0 }}>
              <span className="eyebrow">{isDone ? "Talk to us" : "Price & visit"}</span>
              <h2>{isDone ? "Want a home like this?" : `Get the price for ${p.name}.`}</h2>
              <p className="lede">{isDone ? "Our new homes are in Jolshiri Abashon. We will show you the plot and the finished buildings." : "We reply within one working day with the price, open floors and a visit time."}</p>
            </div>
            <ContactList />
          </div>
          <LeadForm project={p} source="project" />
        </div>
      </section>

      <section className="band band--tint" id="more">
        <div className="wrap">
          <div className="port-head">
            <div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Keep exploring</span><h2>{isDone ? "More buildings we handed over" : "Other Xen projects"}</h2></div>
            <Link className="link-arrow" to={statusPath(p.status)}>All {status.toLowerCase()} projects</Link>
          </div>
          <div className="cards">{others.map((o) => <ProjectCard key={o.slug} p={o} />)}</div>
        </div>
      </section>
    </SiteLayout>
  );
}
