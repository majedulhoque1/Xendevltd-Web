import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initLinkTracking, isAdminPath, track } from "@/lib/analytics";

// Mount once inside <BrowserRouter>. The first page view is already reported by the
// GTM container on load, so only client-side navigations push `virtual_page_view` —
// map that event to a GA4 page_view tag in GTM.
export function AnalyticsTracker() {
  const { pathname, search } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => initLinkTracking(), []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isAdminPath(pathname)) return;
    track("virtual_page_view", {
      page_path: pathname + search,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
