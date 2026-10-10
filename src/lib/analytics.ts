// Thin wrapper over the GTM dataLayer (container GTM-5LGFLTZ8 is loaded in index.html).
// Tags, triggers and GA4/Meta mapping live in GTM — this file only emits events.
// Never push names, phone numbers or message text: the dataLayer is readable by every tag.

type DataLayerEvent = { event: string; [key: string]: unknown };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  (window.dataLayer = window.dataLayer || []).push({ event, ...params });
}

// Admin screens are internal — keep staff clicks and page views out of the funnel data.
export const isAdminPath = (pathname: string): boolean => pathname.startsWith("/admin");

const WHATSAPP_HOSTS = /^(https?:)?\/\/(wa\.me|api\.whatsapp\.com)\//i;

// One delegated listener covers every public tel:/WhatsApp/brochure link, including
// ones added later, without each component wiring its own handler.
export function initLinkTracking(): () => void {
  const onClick = (e: MouseEvent) => {
    if (isAdminPath(window.location.pathname)) return;
    const link = (e.target as Element | null)?.closest?.("a");
    if (!link) return;

    const href = link.getAttribute("href") ?? "";
    const where = window.location.pathname;

    if (href.startsWith("tel:")) {
      track("click_call", { phone: href.slice(4), page_path: where });
    } else if (WHATSAPP_HOSTS.test(href)) {
      track("click_whatsapp", { page_path: where });
    } else if (link.hasAttribute("download") || /\.pdf($|\?)/i.test(href)) {
      track("brochure_download", { file_name: link.getAttribute("download") || href, page_path: where });
    }
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
