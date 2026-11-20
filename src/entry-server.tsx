// Build-time render of public routes (scripts/prerender.mjs). Mirrors App.tsx exactly,
// with StaticRouter instead of BrowserRouter, so the client can hydrate the markup.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ScrollManager } from "@/site/layout/ScrollManager";
import { AppRoutes } from "./AppRoutes";

export { seoFor, PUBLIC_ROUTES, ORIGIN } from "@/site/seo";

export function render(url: string): string {
  const queryClient = new QueryClient();
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={url}>
        <AnalyticsTracker />
        <ScrollManager />
        <AppRoutes />
      </StaticRouter>
    </QueryClientProvider>,
  );
}
