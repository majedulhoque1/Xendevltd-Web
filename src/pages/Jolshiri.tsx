// /jolshiri-abashon — area guide (prototype jolshiri.html, verbatim copy).
import { Link } from "react-router-dom";
import { SiteLayout } from "@/site/layout/SiteLayout";
import { Film } from "@/site/components/Film";
import { JolshiriMap } from "@/site/components/Drawings";
import { PageHead, ProudBand } from "@/site/components/Blocks";
import { FEATURED, projectPath } from "@/site/data/site";

const Jolshiri = () => (
  <SiteLayout page="jolshiri" crumbs={[{ label: "Home", to: "/" }, { label: "Jolshiri Abashon" }]}>
    <PageHead
      bg="/img/hero-lakeview-desktop.webp"
      eyebrow="Area guide"
      title="Jolshiri Abashon, Dhaka's newest residential address."
      lede="A planned township built under the supervision of the Bangladesh Army, next to Purbachal in Rupganj. Here is what you get by living there."
    />
    <section className="band band--dark">
      <div className="wrap film-grid">
        <div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Watch</span><h2>See Jolshiri from the air.</h2><p className="lede">A drone flight over the township: its wide roads, lakes and sectors.</p></div>
        <Film
          youtube="5zIpEeqKeBI"
          poster="https://i.ytimg.com/vi/5zIpEeqKeBI/hqdefault.jpg"
          posterFallback="/img/jolshiri-masterplan.webp"
          title="Jolshiri Abashon from the air"
          sub="Drone view · June 2024"
          aside="YouTube"
          label="Play: Jolshiri Abashon drone view"
        />
      </div>
    </section>
    <section className="band">
      <div className="wrap">
        <div className="section-head"><span className="eyebrow">The township</span><h2>Planned like a modern city, from the ground down.</h2></div>
        <div className="pillars pillars--wide">
          <div><b>Over 2,100 acres</b><span>About 52% for homes and commerce. The other 48% is lakes, roads, parks, playing fields and walking and cycle tracks.</span></div>
          <div><b>Underground utilities</b><span>Power, water, sewerage, fire hydrants, phone and fibre-optic lines all run underground.</span></div>
          <div><b>Wide roads</b><span>Main roads 80 to 150 ft wide. Block roads 30 to 60 ft wide.</span></div>
          <div><b>Schools &amp; colleges</b><span>Bangladesh International School &amp; College has a campus in Jolshiri. The master plan adds more schools, colleges, a university, a medical college and a hospital.</span></div>
          <div><b>Everyday needs in each sector</b><span>Clinics, mosques, mini-malls and bazars planned for every sector.</span></div>
          <div><b>Central Business District</b><span>A commercial hub at the centre, with a 5-star hotel planned.</span></div>
          <div><b>Central Park &amp; lakes</b><span>A large central park, lakes with walkways and a planned golf course.</span></div>
          <div><b>Secure, army-run township</b><span>Developed and managed under the Bangladesh Army.</span></div>
        </div>
      </div>
    </section>
    <section className="band band--dusk">
      <div className="wrap jol-grid">
        <div className="stack">
          <span className="eyebrow">Getting there</span><h2>Minutes from Gulshan and Purbachal.</h2>
          <p className="lede">Enter from the north on the 300 ft Purbachal expressway, or from the south on Madani Avenue, which starts near the US Embassy in Baridhara about 6 km away. A metro line is planned along the 300 ft road.</p>
          <div className="amen"><span>300 ft Purbachal expressway</span><span>Madani Avenue</span><span>Planned metro line</span></div>
        </div>
        <figure className="map-card" style={{ margin: 0 }} id="jol-map">
          <JolshiriMap />
          <figcaption>Schematic. Plot 038 is in Sector 14 on the lake.</figcaption>
        </figure>
      </div>
    </section>
    <ProudBand
      reveal={false}
      actions={<>
        <Link className="btn" to={projectPath(FEATURED)}>See Lakeview Tasmee</Link>
        <Link className="btn btn--line" to="/contact#visit">Book a site visit</Link>
      </>}
    >
      <h2>Be a proud owner of an apartment in <em>Jolshiri Abashon.</em></h2>
      <p>Xen Lakeview Tasmee in Sector 14 faces the lake. Booking is open now.</p>
    </ProudBand>
  </SiteLayout>
);

export default Jolshiri;
