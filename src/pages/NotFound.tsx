import { Link } from "react-router-dom";
import { SiteLayout } from "@/site/layout/SiteLayout";
import { FEATURED, projectPath, statusPath } from "@/site/data/site";

const NotFound = () => (
  <SiteLayout page="other" crumbs={[{ label: "Home", to: "/" }, { label: "Page not found" }]}>
    <section className="page-head">
      <div className="wrap">
        <span className="eyebrow">Error 404</span>
        <h1>We couldn't find that page.</h1>
        <p className="lede">The link may be old, or the page has moved. These are the places most people are looking for.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
          <Link className="btn" to={projectPath(FEATURED)}>See Lakeview Tasmee</Link>
          <Link className="btn btn--line" to={statusPath("ongoing")}>All projects</Link>
          <Link className="btn btn--line" to="/">Home</Link>
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default NotFound;
