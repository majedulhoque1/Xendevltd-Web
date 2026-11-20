import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ScrollManager } from "@/site/layout/ScrollManager";
import { AppRoutes } from "./AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AnalyticsTracker />
      <ScrollManager />
      <AppRoutes />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
