import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, CalendarClock, Clock, Inbox, Users, LogOut } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useSubmissions } from "@/hooks/useSubmissions";
import { AdminTabBar } from "@/components/admin/AdminTabBar";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Today", icon: LayoutGrid, end: true },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarClock, end: false },
  { to: "/admin/availability", label: "Availability", icon: Clock, end: false },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox, end: false },
  { to: "/admin/crm", label: "CRM", icon: Users, end: false },
];

export function AdminLayout() {
  const { signOut } = useAdminAuth();
  const { submissions } = useSubmissions();
  const hasNewInquiries = submissions.some((s) => s.status === "new");

  return (
    <div className="admin-shell min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <span className="font-serif text-lg font-semibold text-foreground">Xen Admin</span>
          <nav className="hidden items-center gap-1 overflow-x-auto md:flex">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void signOut()}
            aria-label="Sign out"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:h-auto md:w-auto md:gap-1.5 md:px-3 md:py-2"
          >
            <LogOut className="h-4 w-4" /> <span className="hidden md:inline text-sm font-medium">Sign out</span>
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-4 py-6 pb-24 sm:px-6 md:pb-6">
        <Outlet />
      </main>
      <AdminTabBar hasNewInquiries={hasNewInquiries} />
    </div>
  );
}
