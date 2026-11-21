// Home (spec §3 section order, decided): hero, film, Jolshiri, Tasmee, buying steps, trust,
// projects, proud owner, enquiry. Copy is verbatim from the approved prototype index.html.
import { Link } from "react-router-dom";
import { SiteLayout } from "@/site/layout/SiteLayout";
import { Hero } from "@/site/components/Hero";
import { Film } from "@/site/components/Film";
import { JolshiriMap, LakeSectionSVG } from "@/site/components/Drawings";
import { FloorTower } from "@/site/components/FloorTower";
import { useStatusTabs } from "@/site/components/Cards";
import { ContactList, LeadForm } from "@/site/components/Contact";
import { AskPriceWa, Facts, Nudge, ProudBand } from "@/site/components/Blocks";
import { IcDoc } from "@/site/components/icons";
import { BROCHURE, FEATURED, projectPath } from "@/site/data/site";

const Index = () => {
  const hasFilm = !!FEATURED.film;
  const portfolio = useStatusTabs({ initial: "ongoing", limit: 6, cardsId: "home-cards" });

  return (
    <SiteLayout page="home">
      <Hero />

      {/* 2. FILM: featured project video */}
      <section className="band band--film-light" id="film" aria-labelledby="film-title">
        <div className="wrap film-grid">
          <div className="section-head reveal" style={{ margin: 0 }}>
            {/* DEVIATIONS.md A1: until the film exists, don't promise "two minutes" of video. */}
            <span className="eyebrow">{hasFilm ? "Project film" : "The project"}</span>
            <h2 id="film-title">Walk through Lakeview Tasmee before you visit.</h2>
            <p className="lede">{hasFilm
              ? "See the lake from the balconies, the walking track below and the 60 ft road behind. Two minutes, then come and stand on the plot."
              : "See the lake side, the road front and the building at dusk. Then come and stand on the plot."}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
              <Link className="btn btn--green" to={projectPath(FEATURED)}>See full project</Link>
              <a className="link-arrow" href={BROCHURE}>Download brochure</a>
            </div>
          </div>
          <div className="reveal">
            <Film
              reel={["/img/tasmee-evening.webp", "/img/project-lakeside.webp", "/img/hero-lakeview-desktop.webp", "/img/project-roadside-perspective.webp"]}
              video={FEATURED.film}
              title="Xen Lakeview Tasmee"
              sub="Sector 14 · Jolshiri Abashon"
              aside="Project film · 2:00"
              label="Play the Lakeview Tasmee project film"
            />
          </div>
        </div>
      </section>

      {/* 3. JOLSHIRI */}
      <section className="band band--dusk" id="jolshiri" aria-labelledby="jol-title">
        <div className="wrap">
          <div className="jol-grid">
            <div className="stack reveal">
              <span className="eyebrow">Dhaka's newest address</span>
              <h2 id="jol-title">Why families are moving to Jolshiri Abashon.</h2>
              <p className="lede">A planned township built under the supervision of the Bangladesh Army, beside Purbachal. Nearly half the land is kept for lakes, parks, roads and playing fields, and every utility line runs underground.</p>
              <div className="stats">
                <div><b>2,100+</b><small>acres planned as one township</small></div>
                <div><b>48%</b><small>kept for lakes, parks, roads and open space</small></div>
                <div><b>300 ft</b><small>Purbachal expressway on the north side</small></div>
                <div><b>6 km</b><small>to Gulshan and the US Embassy via Madani Avenue</small></div>
              </div>
              <div className="amen"><span>Central Park</span><span>Lakes &amp; walking tracks</span><span>Schools &amp; colleges</span><span>Central Business District</span><span>Mosques &amp; markets</span><span>Underground utilities</span><span>Planned golf course</span></div>
              <Link className="link-arrow" to="/jolshiri-abashon">Read the full Jolshiri guide</Link>
            </div>
            <div className="stack reveal">
              <Film
                youtube="5zIpEeqKeBI"
                poster="https://i.ytimg.com/vi/5zIpEeqKeBI/hqdefault.jpg"
                posterFallback="/img/jolshiri-masterplan.webp"
                title="Jolshiri Abashon from the air"
                sub="Drone view · June 2024"
                aside="YouTube"
                label="Play: Jolshiri Abashon drone view"
              />
              <figure className="map-card" style={{ margin: 0 }} id="jol-map">
                <JolshiriMap />
                <figcaption>Plot 038 sits on the lake in Sector 14, close to Central Park and the CBD.</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TASMEE at a glance + floors + lake section */}
      <section className="band" id="tasmee" aria-labelledby="tasmee-title">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Now booking · Xen Lakeview Tasmee</span>
            <h2 id="tasmee-title">On the lake, not near it.</h2>
            <p className="pull">In most of Dhaka a lake view is a rare luxury. Here it comes with every home.</p>
            <p className="lede">The building faces north-east over a 30 ft green belt, an 8 ft walking track and the 200 ft wide Jolshiri Lake. The 60 ft road runs behind it, so the master bedroom, a second bedroom and the family living room face the water.</p>
          </div>
          <div className="glance">
            <div className="stack reveal">
              <Facts facts={FEATURED.facts ?? []} price={FEATURED.price} handover={FEATURED.handover} name={FEATURED.name} />
              <div className="guarantee"><b>৳40,000</b><span>We pay you ৳40,000 a month for every month we hand over late, as written in your Deed of Agreement, as long as your instalments are on time.</span></div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link className="btn btn--green" to={projectPath(FEATURED)}>Floor plans &amp; specifications</Link>
                <a className="btn btn--ghost" href={BROCHURE} style={{ color: "var(--forest)" }}><IcDoc />Brochure (PDF)</a>
              </div>
            </div>
            <div className="stack reveal">
              <FloorTower />
            </div>
          </div>
          <figure className="lake-section reveal">
            <div className="section-draw"><LakeSectionSVG level={3} light /></div>
            <figcaption><b>Nothing between you and the water.</b> Drawn to scale in front of the building: 30 ft of green, the 8 ft walking track, then 200 ft of lake to the far shore, about 238 ft away. The dashed line shows the view from Level 3; higher floors look over the trees with even more room.</figcaption>
          </figure>
        </div>
      </section>

      {/* 5. BUYING STEPS */}
      <section className="band band--tint" aria-labelledby="pay-title">
        <div className="wrap glance">
          <div className="section-head reveal" style={{ margin: 0 }}>
            <span className="eyebrow">How buying works</span>
            <h2 id="pay-title">Four steps from booking to keys.</h2>
            <p className="lede">The terms are the same for every buyer and they are written into the Deed of Agreement. You can visit the site at any time during construction.</p>
          </div>
          <div className="panel reveal">
            <ol className="pay">
              <li><div><b>Book with ৳5 lakh</b><span>Non-refundable booking money. We allot your apartment and issue a receipt.</span></div></li>
              <li><div><b>Sign the Deed of Agreement</b><span>Review the layout, specifications and schedule. Ask for layout changes before signing.</span></div></li>
              <li><div><b>Pay 30% at signing</b><span>Minimum 30% of the price, less the booking money. Bank draft, pay order or account-payee cheque only.</span></div></li>
              <li><div><b>Pay the rest monthly</b><span>Up to 30 instalments from the start of piling. Possession and one parking space on full payment.</span></div></li>
            </ol>
          </div>
        </div>
      </section>

      {/* 6. TRUST */}
      <section className="band" aria-labelledby="trust-title">
        <div className="wrap trust-grid">
          <div className="leader reveal">
            <span className="eyebrow">A construction company with a little difference</span>
            <blockquote>Quality is our prime concern. Your satisfaction is guaranteed. Handover is on time, as promised.</blockquote>
            <cite>Maj Gen (Retd) Badrul Millat · Managing Xen Developments Ltd.</cite>
          </div>
          <div className="reveal">
            <div className="section-head" style={{ marginBottom: 24 }}>
              <span className="eyebrow">Why buy from Xen</span>
              <h2 id="trust-title">Proof you can check, floor by floor.</h2>
            </div>
            <div className="pillars">
              <div><b>BUET architects &amp; engineers</b><span>Designs and structural drawings to BNBC 2020, with an RCC shear-wall core.</span></div>
              <div><b>Tested at HBRI</b><span>Random samples of steel, cement and every concrete mix tested by the Housing &amp; Building Research Institute.</span></div>
              <div><b>HBRI-trained site managers</b><span>Every phase of construction is supervised and logged.</span></div>
              <div><b>12 buildings handed over</b><span>In Mirpur DOHS and DOHS Chattogram, with three more under way.</span></div>
            </div>
            <div className="brands"><span>Materials by</span><b>KSRM</b><b>Seven Rings</b><b>Hatil</b><b>TOTO</b><b>Perkins</b><b>Stamford</b></div>
          </div>
        </div>
      </section>

      {/* 7. PORTFOLIO */}
      <section className="band band--tint" id="portfolio" aria-labelledby="port-title">
        <div className="wrap">
          <div className="port-head">
            <div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Our projects</span><h2 id="port-title">Built in Dhaka and Chattogram.</h2></div>
            {portfolio.tabs}
          </div>
          {portfolio.cards}
          <p style={{ marginTop: 32 }}><Link className="link-arrow" to="/projects/completed">See all projects</Link></p>
        </div>
      </section>

      {/* 8. PROUD OWNER band */}
      <ProudBand
        actions={<>
          <Link className="btn" to="#enquire">Book a sunset site visit</Link>
          <AskPriceWa />
          <Link className="proud-link" to="#tasmee">or see which floors are open</Link>
        </>}
      >
        <h2>Be a proud owner of an apartment in <em>Jolshiri Abashon.</em></h2>
        <p>Only eight homes in Lakeview Tasmee, one per floor. Book with ৳5 lakh, pay 30% at agreement and the rest in up to 30 monthly instalments.</p>
      </ProudBand>

      {/* 9. ENQUIRY */}
      <section className="band band--dark" id="enquire" aria-labelledby="enq-title">
        <div className="wrap enquiry">
          <div className="reveal">
            <div className="section-head" style={{ margin: 0 }}>
              <span className="eyebrow">Talk to us</span>
              <h2 id="enq-title">Get the price and see the plot this week.</h2>
              <p className="lede">Tell us when you plan to buy and we will call you back with the price, the open floors and a time to visit Sector 14.</p>
            </div>
            <ContactList />
          </div>
          <div className="reveal"><LeadForm source="home" /></div>
        </div>
      </section>

      <Nudge watchId="tasmee" />
    </SiteLayout>
  );
};

export default Index;
