import { NavLink, Outlet } from "react-router-dom";
import { CalendarClock, Clock, Inbox, Users, LogOut } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin/bookings", label: "Bookings", icon: CalendarClock },
  { to: "/admin/availability", label: "Availability", icon: Clock },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/crm", label: "CRM", icon: Users },
];

export function AdminLayout() {
  const { signOut } = useAdminAuth();

  return (
    <div className="admin-shell min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <span className="font-serif text-lg font-semibold text-foreground">Xen Admin</span>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
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
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
