// "Pick your floor" (DEVIATIONS.md A2). Statuses come from the admin-edited `tasmee_floors`
// table. A level staff haven't set yet — or any read failure — shows "Ask", which opens
// WhatsApp. No example data is ever shown.
import { useQuery } from "@tanstack/react-query";
import { getSupabase } from "../lib/db";
import { waLink } from "../data/site";

export type FloorStatus = "open" | "held" | "sold" | "unknown";
const LEVELS = [8, 7, 6, 5, 4, 3, 2, 1];
const LABEL: Record<Exclude<FloorStatus, "unknown">, string> = { open: "Open", held: "On hold", sold: "Booked" };

async function fetchFloors(): Promise<Record<number, FloorStatus>> {
  const db = await getSupabase();
  const { data, error } = await db.from("tasmee_floors").select("level,status");
  if (error) throw error;
  const map: Record<number, FloorStatus> = {};
  for (const row of (data ?? []) as { level: number; status: FloorStatus }[]) map[row.level] = row.status;
  return map;
}

export function useTasmeeFloors() {
  return useQuery({ queryKey: ["tasmee_floors"], queryFn: fetchFloors, staleTime: 60_000, retry: false });
}

export function FloorTower() {
  const { data } = useTasmeeFloors();
  const status = (lvl: number): FloorStatus => data?.[lvl] ?? "unknown";
  const anyConfirmed = LEVELS.some((l) => status(l) !== "unknown");

  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}><h3>Pick your floor</h3></div>
      <div className="tower">
        {LEVELS.map((f) => {
          const s = status(f);
          const view = f >= 5 ? "Lake view over tree line" : "Lake & walking-track view";
          if (s === "open") {
            return (
              <a key={f} className="floor is-open" href={waLink(`I'm interested in Level ${f}, Lakeview Tasmee.`)} target="_blank" rel="noopener">
                <span className="lvl">LEVEL {f}</span><span>{view}</span><span className="pill pill--open">{LABEL.open}</span>
              </a>
            );
          }
          if (s === "unknown") {
            return (
              <a key={f} className="floor" href={waLink(`Hi, is Level ${f} at Lakeview Tasmee still open? Please send the price.`)} target="_blank" rel="noopener" aria-label={`Ask about Level ${f} on WhatsApp`}>
                <span className="lvl">LEVEL {f}</span><span>{view}</span><span className="pill pill--tbc">Ask</span>
              </a>
            );
          }
          return (
            <div key={f} className="floor">
              <span className="lvl">LEVEL {f}</span><span>{view}</span><span className={`pill pill--${s}`}>{LABEL[s]}</span>
            </div>
          );
        })}
        <div className="floor floor--ground"><span className="lvl">GROUND</span><span>Entrance, lobby &amp; 11 parking spaces</span><span /></div>
      </div>
      {anyConfirmed && (
        <div className="legend"><span className="pill pill--open">Open</span><span className="pill pill--held">On hold</span><span className="pill pill--sold">Booked</span></div>
      )}
    </div>
  );
}
