import { useState } from "react";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export interface ActionCardAction {
  label: string;
  icon: LucideIcon;
  /** Required unless `href` is set — a link action needs no click handler. */
  onClick?: () => void | Promise<void>;
  variant?: "default" | "destructive";
  /** Render as a link instead of a button (e.g. tel:/https://wa.me deep links). */
  href?: string;
}

interface ActionCardProps {
  title: string;
  subtitle: string;
  badge?: { label: string; className?: string };
  /** Shown inline, up to 2, each a 44px-tall tap target. */
  primaryActions: ActionCardAction[];
  /** Tucked behind the "⋯" trigger, opened in a bottom drawer. */
  secondaryActions?: ActionCardAction[];
}

function ActionButton({ action, className }: { action: ActionCardAction; className?: string }) {
  const Icon = action.icon;
  const classes = cn(
    "flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background text-sm font-medium transition-colors hover:bg-secondary",
    action.variant === "destructive" && "border-destructive/30 text-destructive hover:bg-destructive/10",
    className,
  );
  if (action.href) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={classes}>
        <Icon className="h-4 w-4" /> {action.label}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => void action.onClick?.()} className={classes}>
      <Icon className="h-4 w-4" /> {action.label}
    </button>
  );
}

export function ActionCard({ title, subtitle, badge, primaryActions, secondaryActions }: ActionCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasMore = (secondaryActions?.length ?? 0) > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {badge && (
          <Badge variant="outline" className={cn("shrink-0", badge.className)}>
            {badge.label}
          </Badge>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {primaryActions.map((action) => (
          <ActionButton key={action.label} action={action} />
        ))}
        {hasMore && (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="More actions"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        )}
      </div>

      {hasMore && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-2 p-4 pt-0">
              {secondaryActions!.map((action) => (
                <ActionButton
                  key={action.label}
                  action={{
                    ...action,
                    onClick: action.href
                      ? undefined
                      : async () => {
                          await action.onClick?.();
                          setDrawerOpen(false);
                        },
                  }}
                  className="h-12 justify-start px-4"
                />
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
