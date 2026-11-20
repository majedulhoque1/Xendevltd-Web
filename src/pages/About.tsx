// /about — prototype about.html, verbatim copy.
import { Link } from "react-router-dom";
import { SiteLayout } from "@/site/layout/SiteLayout";
import { PageHead } from "@/site/components/Blocks";
import { ProjectCard } from "@/site/components/Cards";
import { byStatus, statusPath } from "@/site/data/site";

const About = () => (
  <SiteLayout page="about" crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}>
    <PageHead
      bg="/img/xen-andromeda-plot-29-rd-2-dohs-chittagong.webp"
      eyebrow="About Xen Developments Ltd."
      title="A construction company with a little difference."
      lede="We build fewer buildings and supervise every one closely. Three promises guide all of them."
    />
    <section className="band">
      <div className="wrap trust-grid">
        <div className="leader"><span className="eyebrow">Our commitments</span><blockquote>Highest quality. Your satisfaction. Timely handover.</blockquote><cite>Led by Maj Gen (Retd) Badrul Millat</cite></div>
        <div className="stack">
          <p className="lede" style={{ color: "var(--text)" }}>Xen Developments Ltd. is led by Major General (Retd) Badrul Millat. Experienced civil engineers handle all engineering and technical work, and managers trained at the Housing and Building Research Institute (HBRI) supervise every phase of construction.</p>
          <p style={{ color: "var(--muted)" }}>Our architects and civil engineers come from BUET, so each building is both well designed and structurally strong. We use only premium fittings, and every major material, including concrete mix samples, is tested at HBRI.</p>
          <div className="pillars">
            <div><b>15+ years</b><span>Building homes in Dhaka and Chattogram</span></div>
            <div><b>12 buildings handed over</b><span>Mirpur DOHS and DOHS Chattogram</span></div>
            <div><b>REHAB member</b><span>Real Estate &amp; Housing Association of Bangladesh</span></div>
            <div><b>BNBC 2020</b><span>Structural design standard for every building</span></div>
          </div>
        </div>
      </div>
    </section>
    <section className="band band--tint">
      <div className="wrap">
        <div className="port-head"><div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Our record</span><h2>Buildings we handed over.</h2></div><Link className="link-arrow" to={statusPath("completed")}>All completed projects</Link></div>
        <div className="cards">{byStatus("completed").slice(0, 4).map((p) => <ProjectCard key={p.slug} p={p} />)}</div>
      </div>
    </section>
  </SiteLayout>
);

export default About;
