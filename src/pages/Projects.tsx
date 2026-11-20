// /projects/:slug — a status list (/projects/ongoing|upcoming|completed, spec §2) or one
// project. Old live-site slugs redirect (also 301s in vercel.json).
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/site/layout/SiteLayout";
import { useStatusTabs } from "@/site/components/Cards";
import { ContactList, LeadForm } from "@/site/components/Contact";
import { PageHead } from "@/site/components/Blocks";
import { FEATURED, LEGACY_SLUGS, STATUS_LABEL, countStatus, isStatus, projectPath, statusPath, type ProjectStatus } from "@/site/data/site";
import ProjectDetail from "./ProjectDetail";

export default function ProjectsRoute() {
  const { slug } = useParams();
  if (isStatus(slug)) return <ProjectsList status={slug} />;
  if (slug && LEGACY_SLUGS[slug]) return <Navigate replace to={`/projects/${LEGACY_SLUGS[slug]}`} />;
  return <ProjectDetail />;
}

/** Legacy /projects → On-going list. */
export const ProjectsIndexRedirect = () => <Navigate replace to={statusPath("ongoing")} />;

function ProjectsList({ status }: { status: ProjectStatus }) {
  const { tabs, cards } = useStatusTabs({ initial: status, routed: true, cardsId: "proj-cards" });
  return (
    <SiteLayout page="projects" crumbs={[{ label: "Home", to: "/" }, { label: "Projects", to: statusPath("ongoing") }, { label: `${STATUS_LABEL[status]} projects` }]}>
      <PageHead
        bg="/img/xen-elysium.webp"
        eyebrow="Our projects"
        title="Homes we are building, and homes we have handed over."
        lede={`${countStatus("ongoing")} buildings under construction, ${countStatus("upcoming")} coming to Banani and ${countStatus("completed")} handed over in Mirpur DOHS and DOHS Chattogram.`}
      />
      <section className="band" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div className="port-head">
            {tabs}
            <Link className="link-arrow" to={projectPath(FEATURED)}>Now booking: Lakeview Tasmee</Link>
          </div>
          {cards}
        </div>
      </section>
      <section className="band band--dark" id="enquire">
        <div className="wrap enquiry">
          <div>
            <div className="section-head" style={{ margin: 0 }}><span className="eyebrow">Talk to us</span><h2>Not sure which project fits?</h2><p className="lede">Tell us your budget and timing. We will suggest a floor and show you the site.</p></div>
            <ContactList />
          </div>
          <LeadForm source="projects" />
        </div>
      </section>
    </SiteLayout>
  );
}
