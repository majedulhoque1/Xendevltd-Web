// Prerenders every public route to static HTML (redesign spec §6.6: crawlers and link
// previews get real content and per-page tags). Runs after the client and SSR builds:
//   vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
// Output (served by Vercel with cleanUrls; see vercel.json):
//   dist/index.html                       home
//   dist/<route>.html                     e.g. dist/projects/lakeview-tasmee.html
//   dist/spa.html                         empty shell: fallback for /admin and unknown URLs
//   dist/sitemap.xml
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

// Browser globals touched at import time by the Supabase client (auth storage).
const mem = new Map();
globalThis.localStorage ??= {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  clear: () => mem.clear(),
  key: (i) => [...mem.keys()][i] ?? null,
  get length() { return mem.size; },
};

const { render, seoFor, PUBLIC_ROUTES, ORIGIN } = await import(pathToFileURL(ssrEntry).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--app-html-->")) throw new Error("prerender: dist/index.html has no <!--app-html--> marker");

// Shell first, before index.html is overwritten with the prerendered home page.
fs.writeFileSync(path.join(dist, "spa.html"), template.replace(/\s*<meta name="robots"[^>]*>/, '\n    <meta name="robots" content="noindex" />').replace(/\s*<link rel="canonical"[^>]*>/, ""));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const setTag = (html, re, tag) => (re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`));

function headFor(html, seo) {
  const url = ORIGIN + (seo.path === "/" ? "/" : seo.path);
  const img = seo.image.startsWith("http") ? seo.image : ORIGIN + seo.image;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(seo.description)}">`);
  // A noindex page (404) gets no canonical.
  html = seo.noindex
    ? html.replace(/\s*<link rel="canonical"[^>]*>/, "")
    : setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}" />`);
  html = setTag(html, /<meta name="robots"[^>]*>/, `<meta name="robots" content="${seo.noindex ? "noindex" : "index,follow"}" />`);
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(url)}" />`);
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(seo.title)}">`);
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(seo.description)}">`);
  html = setTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(img)}">`);
  html = setTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(seo.title)}">`);
  html = setTag(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(seo.description)}">`);
  html = setTag(html, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(img)}">`);
  // Only the shared default OG image is 1200×630; drop the size hints for per-project images.
  if (!seo.image.endsWith("og-tasmee.jpg")) html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, "");
  const ld = seo.jsonLd.map((o) => `<script type="application/ld+json" data-seo="ld">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n    ");
  return html.replace("</head>", `    ${ld}\n  </head>`);
}

let count = 0;
for (const route of PUBLIC_ROUTES) {
  const appHtml = render(route);
  if (!appHtml || appHtml.length < 500) throw new Error(`prerender: ${route} rendered almost nothing`);
  let html = headFor(template, seoFor(route)).replace("<!--app-html-->", appHtml);
  // Only the home page shows the hero panorama, so only it preloads the image.
  if (route === "/") html = html.replace("</head>", '    <link rel="preload" as="image" href="/img/tasmee-panorama.webp" fetchpriority="high" />\n  </head>');
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, `${route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  count++;
}

// 404 page for unknown URLs that reach a static host without the SPA rewrite.
fs.writeFileSync(path.join(dist, "404.html"), headFor(template, seoFor("/__not-found__")).replace("<!--app-html-->", render("/__not-found__")));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_ROUTES.map((r) => `  <url><loc>${ORIGIN}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender: ${count} routes, spa.html, 404.html, sitemap.xml`);
