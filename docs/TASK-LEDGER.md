# Task ledger: Xen redesign v1 (port of Justechltd/Xen-Web-Redesign)

**Plan:** `C:\Users\ONE COM BD\.claude\plans\https-github-com-justechltd-xen-web-rede-zazzy-stream.md` (approved 2026-11-19)
**Branch:** `feat/redesign-v1` (cut from `feat/privacy-page`). **Nothing committed yet.** Commit only when Majedul asks.
**Reference prototype:** `git clone --depth 1 https://github.com/Justechltd/Xen-Web-Redesign.git`, then `python -m http.server 4520 --directory site`.

## Decisions (Majedul, 2026-11-19)
- AI chat dropped; WhatsApp button and mobile bar instead.
- Real slot booking kept. It lives on `/contact#visit`; `/schedule-visit` gets a 301.
- Tasmee floors are edited in admin (`tasmee_floors` table + Floors tab); project text stays in code.
- Sales alerts by email: a `notify-sales` edge function using Resend.
- "Build what doesn't depend on Samir" (2026-11-19): everything except A1 and A3 built now. A1 is data-driven: it switches automatically when `film` is set in `src/site/data/site.ts`. A3 is one flag, `SHOW_INTERNAL_NOTES`.

## Status
- [x] Prototype QA + `docs/redesign/DEVIATIONS.md` (for Samir; Majedul forwards it).
- [x] Frontend: all public pages rebuilt in `src/site/` + `src/pages/`; scoped CSS (`scripts/scope-xen-css.mjs`).
- [x] Production items:
  - lead form → `inquiries` + `webhook-proxy` + GTM `generate_lead` / `lead_submit`;
  - booking card;
  - floor picker reads `tasmee_floors` (falls back to "Ask");
  - per-route SEO + JSON-LD;
  - SSG prerender (`scripts/prerender.mjs`, 24 routes);
  - sitemap, robots, OG image;
  - 301s and cleanUrls in `vercel.json`;
  - admin lazy-loaded;
  - Supabase loaded on demand (main JS 632 KB → 289 KB).
- [x] Defects C1–C4 fixed (the ৳ font is self-hosted in `public/fonts/`).
- [x] Parity vs the prototype at 1440 / 1080 / 768 / 375: every difference traced to a signed deviation. No overflow, no hydration errors.
- [x] Behaviour tests (Playwright, writes blocked): menus, Back, deep links, tabs, forms, booking (faked slots), floors (faked data), analytics, reduced motion, admin login.
- [x] tsc clean, lint 0 errors, vitest 11/11.
- [x] Backend applied to LIVE Xen (`erdbnkemhezvjdhfqjtq`) 2026-11-20 via Supabase CLI 3.2 (`db query --remote -f`, one file at a time; history repaired for those 3 only):
  - `tasmee_floors` (8 rows 'unknown', RLS on, anon read-only);
  - inquiries rate-limit trigger;
  - pg_net 0.19.5 + `notify_sales` triggers (no-op until Vault `notify_secret` exists);
  - `notify-sales` deployed (verify_jwt off, returns 401 without the secret).
- [ ] **OPEN (Majedul sets secrets):** Vault `notify_secret`; function secrets `NOTIFY_SECRET` (same value), `RESEND_API_KEY`, `SALES_EMAIL`, `NOTIFY_FROM` (domain verified in Resend). Existing `trg_booking_notification` on bookings may already alert someone, so check for double alerts.
- [x] Dead code deleted 2026-11-20 (old components/pages/data + all `src/assets/*` + `public/og-card.jpg`). `public/walkthrough-app/` deleted too.
- [x] Committed 2026-11-20 as `2b66d62` on `feat/redesign-v1` (pushed to origin/feat/redesign-v1).
- [x] Samir signed off DEVIATIONS.md (A-E) 2026-11-21.
- [ ] **GATED:** delete old public components and assets:
  - components: `HeroSection`, `FeaturedProject`, `TrustSection`, `ProjectsOverview`, `ContactCallout`, `LeadCapture`, `InquiryForm`, `Navigation`, `Footer`, `WhatsAppButton`, `ThemeToggle`, `CountUp`, `NavLink`;
  - pages and data: `pages/ProjectsCategory.tsx`, `pages/ScheduleVisit.tsx`, `pages/Walkthrough.tsx`(?), `contexts/ThemeContext.tsx`, `data/projects.ts`, `data/bookableProjects.ts`;
  - unused `src/assets/*` and `public/og-card.jpg`.

  Nothing imports them now; deleting also shrinks the Tailwind CSS.
- [x] **LIVE 2026-11-21:** `main` fast-forwarded to `d34e1b8`, production deploy `dpl_3321mu2Gr1KnXPRnkebc5nJavE7P` READY on xendevltd.com. Rollback candidate: `dpl_DxgtkdpfiGJRuqU21Gr9WTTYAx3m` (old site, 25fef5f).

## Gotchas
- The repo's Playwright 1.57 expects Chromium build 1228; only 1243 is installed. Launch with `executablePath: %LOCALAPPDATA%/ms-playwright/chromium-1243/chrome-win64/chrome.exe`.
- The headless browser here can't resolve external DNS (Supabase, Google Fonts). Fake responses with `page.route`.
- Running two Playwright suites at once ran the machine out of memory (the node server died, exit 134). Run them one at a time.
- Prototype `<dl>` lists rely on the browser's default 1em margin; Tailwind preflight removes it (restored in the scope script).
- Pre-rendered pages keep server attribute values on hydrate, so anything date-based (the date input `min`) must be set after mount.
- In the chip inputs, the invisible radio sits on top of the label. In tests, click the label, not the span.

## Next action
Report to Majedul. Ask about:
1. how to run the backend work;
2. approval for the dead-code deletions;
3. a commit.
