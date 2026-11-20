// Per-route SEO (spec §6.6). One source for the browser (applySeo on navigation) and the
// build-time prerender (scripts/prerender.mjs), so titles and tags can never drift apart.
import { COMPANY, FEATURED, PROJECTS, STATUS_LABEL, STATUS_ORDER, getProject, isStatus, projectPath } from "./data/site";

export const ORIGIN = "https://xendevltd.com";
export const OG_IMAGE = "/og-tasmee.jpg";

export interface Seo {
  title: string;
  description: string;
  path: string;
  image: string;
  noindex?: boolean;
  jsonLd: object[];
}

const SUFFIX = " | Xen Developments Ltd.";

const organization = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${ORIGIN}/#organization`,
  name: COMPANY.name,
  url: ORIGIN,
  logo: `${ORIGIN}/img/xen-logo-mark.png`,
  image: `${ORIGIN}${OG_IMAGE}`,
  telephone: COMPANY.phoneTel,
  email: COMPANY.email,
  address: { "@type": "PostalAddress", streetAddress: "House 808, Road 11, Avenue 6, DOHS Mirpur", addressLocality: "Dhaka", addressCountry: "BD" },
  sameAs: [COMPANY.facebook],
};

const listing = () => ({
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  name: FEATURED.name,
  url: `${ORIGIN}${projectPath(FEATURED)}`,
  description: FEATURED.summary,
  image: (FEATURED.gallery ?? []).map((g) => `${ORIGIN}${g.src}`),
  provider: { "@id": `${ORIGIN}/#organization` },
  about: {
    "@type": "Residence",
    name: FEATURED.name,
    address: { "@type": "PostalAddress", streetAddress: "Plot 038, Road 504, Sector 14", addressLocality: "Jolshiri Abashon, Dhaka", addressCountry: "BD" },
  },
});

export function seoFor(pathname: string): Seo {
  const path = pathname.replace(/\/+$/, "") || "/";
  const base = { path, image: OG_IMAGE, jsonLd: [organization] as object[] };

  if (path === "/") {
    return {
      ...base,
      title: "Xen Developments Ltd. | Lakeview apartments in Jolshiri Abashon, Dhaka",
      description: "Xen Developments Ltd. builds premium residential buildings in Dhaka and Chattogram. Now booking Xen Lakeview Tasmee: 4-bed lakeside apartments in Sector 14, Jolshiri Abashon.",
      jsonLd: [organization, listing()],
    };
  }
  const m = path.match(/^\/projects\/([^/]+)$/);
  if (m && isStatus(m[1])) {
    const s = m[1];
    const blurb = { ongoing: "Residential buildings Xen is building now in Jolshiri Abashon and DOHS Chattogram.", upcoming: "Upcoming Xen buildings. Register early to see floor plans and prices first.", completed: "Buildings Xen Developments has built and handed over in Mirpur DOHS and DOHS Chattogram." }[s];
    return { ...base, title: `${STATUS_LABEL[s]} projects${SUFFIX}`, description: blurb };
  }
  if (m) {
    const p = getProject(m[1]);
    if (p) {
      const description = p.summary ?? `${p.name} is a residential building at ${p.address}, built and handed over by Xen Developments Ltd.`;
      return {
        ...base,
        title: `${p.name}, ${p.area}${SUFFIX}`,
        description,
        image: p.featured ? OG_IMAGE : p.image,
        jsonLd: p.featured ? [organization, listing()] : [organization],
      };
    }
  }
  switch (path) {
    case "/jolshiri-abashon":
      return { ...base, title: `Jolshiri Abashon guide${SUFFIX}`, description: "Jolshiri Abashon is a planned township beside Purbachal, built under the Bangladesh Army: over 2,100 acres, lakes and parks, wide roads and underground utilities." };
    case "/about":
      return { ...base, title: `About${SUFFIX}`, description: "Xen Developments Ltd. is led by Maj Gen (Retd) Badrul Millat. BUET-designed buildings, HBRI-tested materials and 12 buildings handed over in Mirpur DOHS and DOHS Chattogram." };
    case "/contact":
      return { ...base, title: `Contact & site visits${SUFFIX}`, description: "Book a site visit to Xen Lakeview Tasmee in Sector 14, Jolshiri Abashon, or call, WhatsApp or email Xen Developments Ltd." };
    case "/privacy":
      return { ...base, title: `Privacy policy${SUFFIX}`, description: "How Xen Developments Ltd. collects, uses and protects the details you share through this website." };
  }
  return { ...base, title: `Page not found${SUFFIX}`, description: "This page doesn't exist. See Xen Lakeview Tasmee and our other projects.", noindex: true };
}

/** Every route the prerender writes and the sitemap lists. */
export const PUBLIC_ROUTES: string[] = [
  "/",
  ...STATUS_ORDER.map((s) => `/projects/${s}`),
  ...PROJECTS.map((p) => projectPath(p)),
  "/jolshiri-abashon",
  "/about",
  "/contact",
  "/privacy",
];

/** Client-side: keep <head> in step after in-app navigation. */
export function applySeo(seo: Seo) {
  document.title = seo.title;
  const url = ORIGIN + (seo.path === "/" ? "/" : seo.path);
  const img = seo.image.startsWith("http") ? seo.image : ORIGIN + seo.image;
  const set = (sel: string, attr: string, key: string, value: string) => {
    let el = document.head.querySelector<HTMLElement>(sel);
    if (!el) { el = document.createElement(sel.startsWith("link") ? "link" : "meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute(sel.startsWith("link") ? "href" : "content", value);
  };
  set('meta[name="description"]', "name", "description", seo.description);
  if (seo.noindex) document.head.querySelector('link[rel="canonical"]')?.remove();
  else set('link[rel="canonical"]', "rel", "canonical", url);
  set('meta[property="og:title"]', "property", "og:title", seo.title);
  set('meta[property="og:description"]', "property", "og:description", seo.description);
  set('meta[property="og:url"]', "property", "og:url", url);
  set('meta[property="og:image"]', "property", "og:image", img);
  set('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
  set('meta[name="twitter:description"]', "name", "twitter:description", seo.description);
  set('meta[name="twitter:image"]', "name", "twitter:image", img);
  set('meta[name="robots"]', "name", "robots", seo.noindex ? "noindex" : "index,follow");
  document.head.querySelectorAll('script[data-seo="ld"]').forEach((s) => s.remove());
  for (const obj of seo.jsonLd) {
    const s = document.createElement("script");
    s.type = "application/ld+json"; s.dataset.seo = "ld"; s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
}
