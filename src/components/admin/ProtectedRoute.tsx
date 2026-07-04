import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();

  if (isLoading || (isAuthenticated && roleLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate replace to="/admin/login" />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-sm space-y-2">
          <p className="text-lg font-semibold text-foreground">Not authorized</p>
          <p className="text-sm text-muted-foreground">
            This account isn't an admin yet. Ask an existing admin to grant access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
