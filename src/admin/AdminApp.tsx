// Admin is loaded on demand (only staff visit /admin), so public pages don't ship it.
import { Route, Routes } from "react-router-dom";
import "./admin-fonts.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/admin/Login";
import AdminToday from "@/pages/admin/Today";
import AdminBookings from "@/pages/admin/Bookings";
import AdminAvailability from "@/pages/admin/Availability";
import AdminSubmissions from "@/pages/admin/Submissions";
import AdminCRM from "@/pages/admin/CRM";
import AdminFloors from "@/pages/admin/Floors";
import NotFound from "@/pages/NotFound";

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminToday />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="availability" element={<AdminAvailability />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="crm" element={<AdminCRM />} />
          <Route path="floors" element={<AdminFloors />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </TooltipProvider>
    </AdminAuthProvider>
  );
}
