// Route table shared by the browser (App.tsx) and the build-time prerender (entry-server.tsx).
// Production URLs follow the redesign spec §2; old URLs redirect (also 301s in vercel.json).
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Jolshiri from "./pages/Jolshiri";
import Privacy from "./pages/Privacy";
import ProjectsRoute, { ProjectsIndexRedirect } from "./pages/Projects";
import NotFound from "./pages/NotFound";

const AdminApp = lazy(() => import("./admin/AdminApp"));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/projects" element={<ProjectsIndexRedirect />} />
      <Route path="/projects/:slug" element={<ProjectsRoute />} />
      <Route path="/jolshiri-abashon" element={<Jolshiri />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/schedule-visit" element={<Navigate replace to="/contact#visit" />} />
      <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
