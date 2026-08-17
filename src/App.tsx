import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectsCategory from "./pages/ProjectsCategory";
import ProjectDetail from "./pages/ProjectDetail";
import ScheduleVisit from "./pages/ScheduleVisit";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/Login";
import AdminBookings from "./pages/admin/Bookings";
import AdminAvailability from "./pages/admin/Availability";
import AdminSubmissions from "./pages/admin/Submissions";
import AdminCRM from "./pages/admin/CRM";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/completed" element={<ProjectsCategory status="Completed" />} />
            <Route path="/projects/upcoming" element={<ProjectsCategory status="Up-coming" />} />
            <Route path="/projects/ongoing" element={<ProjectsCategory status="On-going" />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/schedule-visit" element={<ScheduleVisit />} />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/admin/login"
              element={
                <AdminAuthProvider>
                  <AdminLogin />
                </AdminAuthProvider>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminAuthProvider>
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                </AdminAuthProvider>
              }
            >
              <Route index element={<Navigate replace to="/admin/bookings" />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="availability" element={<AdminAvailability />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="crm" element={<AdminCRM />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
