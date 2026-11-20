import { useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STATUS_LABEL, STATUS_ORDER, byStatus, projectPath, statusPath, type Project, type ProjectStatus } from "../data/site";

export function ProjectCard({ p, feature }: { p: Project; feature?: boolean }) {
  return (
    <Link className={`card${feature ? " card--feature" : ""}`} to={projectPath(p)}>
      <div className="card-img"><img src={p.image} alt={p.name} loading="lazy" /><span className={`badge badge--${p.status}`}>{STATUS_LABEL[p.status]}</span></div>
      <div style={{ display: "grid", gap: 6 }}><h3>{p.name}</h3><p>{p.address}</p></div>
    </Link>
  );
}

export function CardGrid({ list, id, labelledBy, role }: { list: Project[]; id?: string; labelledBy?: string; role?: string }) {
  return (
    <div className="cards" id={id} aria-labelledby={labelledBy} role={role}>
      {list.map((p) => <ProjectCard key={p.slug} p={p} feature={p.featured} />)}
    </div>
  );
}

/** Status tabs (ARIA tabs, arrow keys). `routed` makes each tab change the URL to
 *  /projects/<status> (projects page); otherwise it switches in place (home, max `limit`). */
export function useStatusTabs({ initial, limit, routed, cardsId }: { initial: ProjectStatus; limit?: number; routed?: boolean; cardsId: string }) {
  const [local, setLocal] = useState<ProjectStatus>(initial);
  const navigate = useNavigate();
  const current = routed ? initial : local;
  const tabsRef = useRef<HTMLDivElement>(null);
  const select = (s: ProjectStatus) => (routed ? navigate(statusPath(s), { replace: true }) : setLocal(s));
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const i = STATUS_ORDER.indexOf(current);
    const n = STATUS_ORDER[(i + (e.key === "ArrowRight" ? 1 : STATUS_ORDER.length - 1)) % STATUS_ORDER.length];
    select(n);
    requestAnimationFrame(() => tabsRef.current?.querySelector<HTMLButtonElement>(`[data-s="${n}"]`)?.focus());
  };
  let list = byStatus(current);
  if (limit) list = list.slice(0, limit);
  return {
    tabs: (
      <div className="tabs" role="tablist" aria-label="Project status" ref={tabsRef} onKeyDown={onKey}>
        {STATUS_ORDER.map((s) => (
          <button key={s} role="tab" type="button" id={`tab-${s}`} data-s={s} aria-controls={cardsId} aria-selected={s === current} tabIndex={s === current ? 0 : -1} onClick={() => select(s)}>
            {STATUS_LABEL[s]} <span className="count">{byStatus(s).length}</span>
          </button>
        ))}
      </div>
    ),
    cards: <CardGrid list={list} id={cardsId} labelledBy={`tab-${current}`} role="tabpanel" />,
  };
}
