// Admin → Floors: set each Lakeview Tasmee level to Open / On hold / Booked / Not set.
// The public "Pick your floor" panel reads these; "Not set" shows visitors an "Ask" button.
import { formatDistanceToNow } from "date-fns";
import { useTasmeeFloorsAdmin, type FloorStatus } from "@/hooks/useTasmeeFloors";
import { describeError } from "@/lib/describeError";
import { cn } from "@/lib/utils";

const OPTIONS: { value: FloorStatus; label: string; on: string }[] = [
  { value: "open", label: "Open", on: "bg-emerald-600 text-white border-emerald-600" },
  { value: "held", label: "On hold", on: "bg-amber-500 text-white border-amber-500" },
  { value: "sold", label: "Booked", on: "bg-zinc-600 text-white border-zinc-600" },
  { value: "unknown", label: "Not set", on: "bg-foreground text-background border-foreground" },
];

const AdminFloors = () => {
  const { floors, isLoading, error, setStatus } = useTasmeeFloorsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Lakeview Tasmee floors</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Set each level. The floor picker on the website updates straight away. "Not set" shows visitors an "Ask" button that opens WhatsApp.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading floors…</div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          Couldn't load floors: {describeError(error)}
        </div>
      ) : floors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          The floors table is empty. Run the redesign migration first (docs/backend/REDESIGN-BACKEND.md).
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {floors.map((f) => (
            <li key={f.level} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">Level {f.level}</p>
                <p className="text-xs text-muted-foreground">
                  {f.level >= 5 ? "Lake view over tree line" : "Lake & walking-track view"} · updated {formatDistanceToNow(new Date(f.updated_at), { addSuffix: true })}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-1.5 sm:flex" role="radiogroup" aria-label={`Level ${f.level} status`}>
                {OPTIONS.map((o) => {
                  const active = f.status === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={setStatus.isPending && setStatus.variables?.level === f.level}
                      onClick={() => !active && setStatus.mutate({ level: f.level, status: o.value })}
                      className={cn(
                        "min-h-10 rounded-lg border px-3 text-xs font-semibold transition sm:text-sm",
                        active ? o.on : "border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground",
                      )}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminFloors;
