import { cn } from "@/lib/utils";

interface TriageTileProps {
  count: number;
  label: string;
  selected: boolean;
  onToggle: () => void;
  tone?: "default" | "amber" | "sky";
}

const TONE_SELECTED: Record<NonNullable<TriageTileProps["tone"]>, string> = {
  default: "border-primary/30 bg-primary/10 ring-1 ring-inset ring-primary/30",
  amber: "border-amber-300 bg-amber-50 ring-1 ring-inset ring-amber-300 dark:border-amber-500/40 dark:bg-amber-500/10",
  sky: "border-sky-300 bg-sky-50 ring-1 ring-inset ring-sky-300 dark:border-sky-500/40 dark:bg-sky-500/10",
};

export function TriageTile({ count, label, selected, onToggle, tone = "default" }: TriageTileProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card p-3 text-center shadow-sm transition-colors",
        selected ? TONE_SELECTED[tone] : "hover:bg-secondary/40",
      )}
    >
      <span className="text-2xl font-semibold tabular-nums text-foreground">{count}</span>
      <span className="text-xs font-medium leading-tight text-muted-foreground">{label}</span>
    </button>
  );
}
