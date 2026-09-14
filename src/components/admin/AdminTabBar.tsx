import { NavLink } from "react-router-dom";
import { LayoutGrid, CalendarClock, Inbox, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTabBarProps {
  /** Shows a dot on the Inbox tab when there's something unread. */
  hasNewInquiries?: boolean;
}

const TABS = [
  { to: "/admin", label: "Today", icon: LayoutGrid, end: true },
  { to: "/admin/bookings", label: "Visits", icon: CalendarClock, end: false },
  { to: "/admin/submissions", label: "Inbox", icon: Inbox, end: false },
  { to: "/admin/crm", label: "Contacts", icon: Users, end: false },
  { to: "/admin/availability", label: "Hours", icon: Clock, end: false },
] as const;

export function AdminTabBar({ hasNewInquiries }: AdminTabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-14 items-stretch">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <span className="relative">
              <Icon className="h-5 w-5" />
              {label === "Inbox" && hasNewInquiries && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
