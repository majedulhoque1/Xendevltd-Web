// Local preview of the production build, served the way vercel.json does it: 301s,
// cleanUrls (/about -> about.html), /admin -> spa.html, unknown URLs -> 404.html.
// `vite preview` can't do this, and would serve the prerendered home page for every URL.
//   npm run build && npm run serve:dist     ->  http://localhost:4600
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.argv[2] || path.join(here, "..", "dist"));
const port = +process.argv[3] || 4600;
const cfg = JSON.parse(fs.readFileSync(path.join(root, "..", "vercel.json"), "utf8"));
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".pdf": "application/pdf", ".ico": "image/x-icon", ".json": "application/json" };
const send = (res, file, code = 200) => { res.writeHead(code, { "content-type": types[path.extname(file)] || "application/octet-stream" }); fs.createReadStream(file).on("error", () => res.end()).pipe(res); };
const isFile = (f) => fs.existsSync(f) && fs.statSync(f).isFile();
http.createServer((req, res) => {
  const url = new URL(req.url, "http://x"); let p = decodeURIComponent(url.pathname);
  const r = cfg.redirects.find((x) => x.source === p);
  if (r) { res.writeHead(308, { location: r.destination }); return res.end(); }
  if (p.endsWith(".html") && cfg.cleanUrls) { res.writeHead(308, { location: p.replace(/(index)?\.html$/, "") || "/" }); return res.end(); }
  const f = path.join(root, p);
  if (isFile(f)) return send(res, f);
  if (isFile(f + ".html")) return send(res, f + ".html");
  if (isFile(path.join(f, "index.html"))) return send(res, path.join(f, "index.html"));
  if (p === "/" ) return send(res, path.join(root, "index.html"));
  if (p === "/admin" || p.startsWith("/admin/")) return send(res, path.join(root, "spa.html"));
  return send(res, path.join(root, "404.html"), 404);
}).on("clientError", (_e, sock) => sock.destroy()).listen(port, () => console.log(`Xen site (production build): http://localhost:${port}`));
