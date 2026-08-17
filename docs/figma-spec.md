**STATUS: Implemented 2026-08-18.** Full public site rebuilt to this spec; verified at
1280px and 390px, light and dark. See the bottom of this file for what shipped and the
bugs found/fixed along the way.

# Xen Dev. v4 — Figma redesign spec

Source of truth: `Xen Dev. v4.fig` / `Xen Dev. v4.pdf` (exported 2026-08-17T18:24Z, 17 frames).
Figma: https://www.figma.com/design/NvHJ757Du9X7gf9wr2bvLW/Xen-Dev.-v4

**Scope decision (confirmed with Majedul):** whole public site. Admin panel untouched.

## How this spec was derived

The Figma REST API and MCP connector were both unavailable, so the design was
recovered from the exported files:

- `.fig` is a ZIP → `canvas.fig` (Kiwi binary), `thumbnail.png`, `meta.json`, **60 image assets**.
- `canvas.fig` block 0 (the Kiwi schema) decodes cleanly; block 1 (the node tree) does
  **not** — it is not raw-deflate, not zlib, and contains no recoverable design text.
  Do not sink more time into it.
- The **PDF is the ground truth**. Figma exports frames at 1pt = 1px, so a 1280pt frame
  renders to exactly 1280 CSS px at 72 DPI. Geometry measured off these renders is exact.
- Text is outlined to Type 3 glyphs in the PDF, so **font family names are not recoverable
  from either file** — they must come from Figma directly.

Repro:
```
unzip "Xen Dev. v4.fig" -d fig/            # assets land in fig/images/
pdftoppm -r 72 -png "Xen Dev. v4.pdf" all  # 1:1 CSS-pixel renders
```

## Frame inventory

Frames alternate mobile (390px) / desktop (1280px). **Breakpoints: 390 and 1280.**
Every page is designed at both widths — mobile is specified, not inferred.

| Page | Width | Height | Surface | Route |
|-----:|------:|-------:|---------|-------|
| 1  | 390  | 884  | mobile — **menu overlay** | — |
| 2  | 390  | 7197 | mobile — Home | `/` |
| 3  | 1280 | 4325 | desktop — Home | `/` |
| 4  | 390  | 5140 | mobile — About | `/about` |
| 5  | 1280 | 3022 | desktop — About | `/about` |
| 6  | 390  | 2640 | mobile — Contact | `/contact` |
| 7  | 1280 | 1868 | desktop — Contact | `/contact` |
| 8  | 390  | 2444 | mobile — Our Projects | `/projects` |
| 9  | 1280 | 1304 | desktop — Our Projects | `/projects` |
| 10 | 390  | 2269 | mobile — Completed | `/projects/completed` |
| 11 | 1280 | 1224 | desktop — Completed | `/projects/completed` |
| 12 | 390  | 2306 | mobile — Up-coming | `/projects/upcoming` |
| 13 | 1280 | 1290 | desktop — Up-coming | `/projects/upcoming` |
| 14 | 390  | 2996 | mobile — On-going | `/projects/ongoing` |
| 15 | 1280 | 1759 | desktop — On-going | `/projects/ongoing` |
| 16 | 390  | 4548 | mobile — Project detail | `/projects/:slug` |
| 17 | 1280 | 3060 | desktop — Project detail | `/projects/:slug` |

### Routing delta vs. the current site

- **New:** three project-category pages — `/projects/completed`, `/projects/upcoming`,
  `/projects/ongoing`. `/projects` becomes a category hub (3 cards: On-going 3 Projects /
  Up-coming 1 Projects / Completed 12 Projects), not a flat list.
- **Not in the Figma:** `/schedule-visit` (ScheduleVisit.tsx) — but the project-detail hero
  has a "Schedule a Visit" CTA, so the route must survive. Also `NotFound`.
- Page titles on the project sub-pages are set in the **green** `#0E271C`, while About and
  Contact use near-black. Home H1 is white over the photo.

### Mobile menu overlay (page 1)

Full-screen `#212322`. Logo top-left, `×` top-right. Nav links are **serif**, large, stacked
(Projects / About / Contact). Hairline rule. Then a rounded "Appearance" row with a moon icon
and a **pill switch** (dark-mode toggle). Full-width green `Contact Us` button. Phone
`01717-19-27-30`, three social icons, `© 2024 Xen Developments.`

## Palette (sampled from the 1:1 render — exact)

| Token | Hex | Role | Share of home page |
|-------|-----|------|--------------------|
| `bg` | `#FCF9F8` | primary page background, warm off-white | 23.8% |
| `surface` | `#F0EDED` | cards, icon tiles, alternating band | 13.8% |
| `surface-alt` | `#F6F3F2` | contact band background | 12.9% |
| `ink` | `#212322` | footer, featured-project panel, nav pill | 9.1% |
| `primary` | `#0E271C` | deep forest green — filled CTAs | 0.6% |
| `white` | `#FFFFFF` | input fields, card fills | |
| `sage` | `#C2C8C2` | muted light green-grey (hero stat numerals) | |

Note the palette is **warm off-white + near-black + one deep green**, not the current
site's `hsl(158 32% 22%)` green-forward theme. The nav pill over the hero photo samples
`#29303B`, i.e. `ink` at partial opacity over the image — treat as translucent dark +
backdrop blur, not a solid.

## Desktop Home (page 3, 1280 × 4325)

Content column is 1152px wide, centred → **64px page gutters**.

1. **Hero** (0 – ~900)
   - Full-bleed dusk photo of a lit tower over water; dark gradient overlay.
   - Floating pill nav, centred, ~x407–873, y16–66: logo mark + wordmark, links
     `Projects · About · Contact`, moon (dark-mode) toggle, filled `Contact Us` button.
   - H1 serif, 3 lines: "Dhaka's Premium Addresses, Engineered for Generations"
   - Sub-paragraph, ~3 lines, max-width ~672px.
   - CTAs: filled `#0E271C` "Explore Developments" + outlined "Inquire Now".
   - Stats strip inside a bordered rounded card (y≈742–857): `15+` Years of Excellence ·
     `24` Completed Projects · `500+` Happy Families · `100%` On-time Delivery.
     Numerals are serif, in `sage`.

2. **Our Promise** (~900 – 1780) — bg `#FCF9F8`
   - Two columns. Left: eyebrow "Our Promise" (small, letterspaced, uppercase-ish),
     serif H2 "Building Trust Through Structural Integrity", body paragraph, then a
     3-item checklist with outline icons (Uncompromising Structural Integrity /
     Sustainable & Green Design / Prime, Handpicked Locations), each with a sub-line.
   - Right: 2×2 grid of `#F0EDED` rounded cards, each centred icon + serif title +
     caption — BNBC Code / Grade A / RAJUK / Transparent.

3. **Featured Development** (~1780 – 2620) — bg `#F0EDED`
   - Eyebrow "Featured Development", serif H2 "Jolshiri Lakeview Residence", hairline rule.
   - Split card: left large image with a "RAJUK Approved" pill badge top-left, and a
     4-thumbnail selector strip beneath (first thumb active, green outline).
   - Right dark `#212322` panel: tab row `About · Key Features · Location · Floor`
     (active tab underlined), description paragraph, 2×2 spec grid
     (Status: On-going / Completion: Q4 2026 / Total Units: G+8 (9 Stories) / Sizes: 2850 Sqft),
     hairline rule, full-width `Download Brochure` button.

4. **Our Developments** (~2620 – 3300) — bg `#FCF9F8`
   - Eyebrow "Portfolio", serif H2 "Our Developments", outlined `View All Projects →`
     button right-aligned, hairline rule under the header row.
   - 3 project cards, image-filled with bottom gradient scrim: `COMPLETED` badge (green
     chip) + location, serif name, 2-line description.
     Xen Nirvana (Chittagong DOHS) · Xen Andromeda (Chittagong DOHS) · Xen Elysium (Mirpur DOHS).
   - **The middle card is deliberately offset ~32px lower** than its neighbours (staggered row).

5. **Start Your Journey Home** (~3300 – 4090) — bg `#F6F3F2`
   - Left: eyebrow "Connect With Us", serif H2, paragraph, then 3 contact rows with
     rounded-square icon tiles: Call Us `+880 1234 567 890` · Email Us
     `info@xendevelopments.com` · Visit Our Office `Level 5, Xen Tower, Gulshan Avenue, Dhaka`.
   - Right: bordered form card — Full Name / Phone Number (2-up), Email Address,
     Your Message (textarea), filled green `Send Inquiry` button (left-aligned, not full width).

6. **Footer** (~4090 – 4325) — bg `#212322`
   - Left: logo + serif "Xen Developments Ltd." wordmark, then
     "© 2024 Xen Developments. RAJUK Approved."
   - Two link columns: **Properties** (Residential Projects / Commercial Hubs / Our Locations)
     and **Corporate** (Legal Compliance / Privacy Policy / Contact Support).

## Type — confirmed by Majedul from the Figma panel

- **Headings: `Fraunces`** — variable serif (axes `opsz`, `wght`, `SOFT`, `WONK`).
  The `WONK` axis is what produces the distinctive `&` and the angled leg shapes.
  Used for H1/H2, card titles, stat numerals, and the mobile menu's nav links.
- **Body/UI: `Plus Jakarta Sans`** — nav, paragraphs, labels, buttons, eyebrows.
- **Eyebrows:** Plus Jakarta Sans, small, letterspaced, semibold.

```
Fraunces:          ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1
Plus Jakarta Sans: ital,wght@0,200..800;1,200..800
```

Replaces the current Gruppo / Montserrat / Playfair Display stack entirely.

**Contact page (frame 7):** its serif body copy is a font-substitution artifact from the
export, **not** the design — confirmed with Majedul. Build Contact with Plus Jakarta Sans
body like every other page.

## Decisions I'm owning

- **Dark mode stays.** The nav has a moon toggle and the mobile menu has an "Appearance"
  switch, so dark mode is clearly intended — but no dark frames were exported. I'll derive
  the dark theme from the design's own palette (`ink #212322` as background, `surface`
  values inverted, `primary` lightened for contrast) rather than drop the existing theme.
- **`/schedule-visit` survives** un-redesigned but restyled to the new tokens, since the
  project-detail hero links to it.

## Open questions

- [ ] None blocking.

## Assets

60 images extracted to `fig/images/` (content-hash filenames, no extensions). These are the
real renders used in the design — prefer them over re-sourcing. Largest are the hero and
project photography.

## Implementation notes (2026-08-18)

All public pages rebuilt: Home, About, Contact, Projects hub, 3 new category pages
(`/projects/completed|upcoming|ongoing`), ProjectDetail. Admin panel untouched.
Design tokens (fonts, palette, radius) rewritten in `src/index.css` /
`tailwind.config.ts` — Fraunces + Plus Jakarta Sans, exact Figma hex values converted
to HSL. Dark mode derived from the Figma's own ink/surface tokens (no dark frames
existed in the export).

Real bugs found via Playwright screenshot QA at 390px/1280px and fixed:
- `CountUp.tsx` — stat counters could stall at 0 on short mobile viewports because the
  number span started ~1px below the fold, outside the observer's trigger zone. Rewrote
  to a native `IntersectionObserver` with a small positive root margin.
- `ProjectDetail.tsx` — a CSS Grid "blowout": a `flex justify-between` spec row (no
  `minmax(0,1fr)` protection) inside a grid column that collapses to auto-width on
  mobile forced the whole card past the viewport edge, invisibly (masked by a global
  `body { overflow-x: hidden }`). Fixed with `min-w-0` on the grid children + `flex-wrap`
  on the spec rows.
- `ProjectDetail.tsx` hero — fixed `aspect-[16/10]` was too short on mobile for the
  stacked badge/title/location/CTA content, clipping the top of the heading. Switched to
  `min-h-[460px]` below `sm`.
- `About.tsx` — the "Our Foundation" image card used a fixed height, leaving a large
  dead-space gap under it since CSS Grid stretched the column to match its taller
  sibling. Made the image `flex-1` so it fills the stretched height, matching the Figma.

Content/data decisions made without a matching Figma spec (documented so they're not
mistaken for oversights):
- Mobile frames in the Figma used stock/placeholder photography and copy (business
  meeting stock photos, "The Serenade" / "Verdant Towers" placeholder names) that
  doesn't match the desktop frames' real Xen content. Used the real project data/photos
  consistently across both breakpoints instead of the mobile placeholders.
- Xen Nirvana's location was inconsistent between two pre-existing files in the old
  codebase (Chittagong DOHS vs Mirpur DOHS). Chittagong DOHS was kept — it matches both
  the Figma and the site's own canonical `Projects.tsx` data.
