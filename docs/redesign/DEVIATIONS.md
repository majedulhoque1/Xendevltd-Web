# Xen redesign: where the live build differs from the prototype

**For:** Samir · **From:** Majedul · **Date:** 19 Nov 2026
**Prototype:** github.com/Justechltd/Xen-Web-Redesign, v1.0 · **Live build:** branch `feat/redesign-v1`

Everything not listed here is built exactly as in the prototype: the same copy, layout, colours, fonts, section order and animations.

The changes below are needed for three reasons:
- **Production gap:** the prototype shows something that isn't true on a live site yet.
- **Prototype defect:** it has a bug, found in QA on 19 Nov.
- **Your decision:** a decision we made for production.

Please tick each one. Anything marked "Change" we fix before Xen sees the site.

---

## A. Placeholder content that can't go live yet

### A1. Project film: there is no film yet
**Prototype:**
- The hero button says "Watch the project film". The film block shows a play button and "Project film · 2:00".
- Clicking play reveals a developer note: "Video slot: drop the drone or walkthrough film…". Visitors would see it.

**Live, until Xen sends the film:**
- The reel of renders plays on its own, with no play button and no "2:00".
- Hero button: **"See the project"** (scrolls to the same block).
- Home film block:
  - eyebrow "The project";
  - heading unchanged: "Walk through Lakeview Tasmee before you visit.";
  - lede: "See the lake side, the road front and the building at dusk. Then come and stand on the plot."
- Tasmee page film band:
  - heading: "See Lakeview Tasmee from every side.";
  - lede: "Renders of the lakeside, the road front and the evening view."

**When the film arrives:** we add the file to the data. The prototype's wording, play button and duration come back on their own.

☐ Approve  ☐ Change: ______________________

### A2. Floor picker: the availability shown is example data
**Prototype:** levels show Open, On hold or Booked from made-up data, with an "Example data" tag.

**Live:**
- Xen's admin gets a **Floors** screen where staff set each level to Open, On hold or Booked. The picker reads it live.
- Until a level is set, it shows **"Ask"**, which opens WhatsApp prefilled with "Is Level N still open?". The legend and the "Example data" tag stay hidden until at least one level is set.

☐ Approve  ☐ Change: ______________________

### A3. Internal notes are hidden
These stay hidden until Xen confirms the facts:
- the yellow "To add: …" lines on project pages;
- the "Google Map pin to be added" caption under the Tasmee map;
- the yellow `tbc` pickup line on Contact ("We can pick you up from Gulshan, Baridhara or Mirpur DOHS").

The sentences around them stay.

☐ Approve  ☐ Change: ______________________

---

## B. Decisions for production

### B1. "Book a site visit" uses Xen's real booking calendar
**Prototype:** the Contact page form has a "Preferred visit day" box, which is a request only.

**Live:**
- The form column on Contact (`/contact#visit`) is the booking calendar Xen already uses. The visitor picks a day, then a time slot from the open times staff set in admin, then gives name, phone and project.
- The booking lands in admin under Bookings.
- It uses the prototype's white form card, fonts and green buttons.
- A link under it, "Only want the price? Send a quick request", switches to the prototype's form.

The home page enquiry form stays exactly as in the prototype.

☐ Approve  ☐ Change: ______________________

### B2. The AI chat bubble is removed
The current live site has an AI chat bubble; the prototype doesn't. We follow the prototype: the floating WhatsApp button on desktop, and the Call / WhatsApp / Book bar on phones.

☐ Approve  ☐ Change: ______________________

### B3. "Privacy" link in the footer
The live site already has a privacy policy page (needed for Meta ads and lead forms). We add a small "Privacy" link in the footer's bottom line. Around 1080px wide, that line now wraps onto two lines; at other widths nothing changes.

☐ Approve  ☐ Change: ______________________

---

## C. Defects found in the prototype (QA, 19 Nov 2026)

We tested all 6 pages at 1440, 1080, 768 and 375px:
- no horizontal scroll at any width;
- no broken links or images;
- dropdown, Escape, mobile menu, tabs and mobile action bar all work.

These four we fix:

| # | What happens | Fix |
|---|---|---|
| C1 | Clicking the film's play button shows a developer note to visitors | Covered by A1 |
| C2 | Footer → "Booking & payment" opens the Tasmee page at the top, not at the payment section | Link goes straight to the payment section |
| C3 | The enquiry form accepts any text as a phone number (e.g. "abc") and visit dates in the past | Phone must be a valid Bangladeshi or international number; the visit day can't be in the past |
| C4 | On Windows, the Taka sign shows as a tiny "ı", so "৳40,000" reads "ı40,000". Manrope and Gloock don't include ৳ | A matching font for the ৳ character only (2 KB, served from our own site). Nothing else changes |

☐ Approve all  ☐ Change: ______________________

---

## E. Facts corrected against Xen's brochure (21 Nov 2026)

Majedul's audit of the preview found copy that disagreed with the brochure or the floor plans. Fixed on the live build:

| # | Prototype said | Live now | Source |
|---|---|---|---|
| E1 | Hero: "2,505 sft, Apartment (Type-A)"; Facts: "2,505 sft (Type-A)" | Hero: "2,850 sft, Per floor"; Facts keep "2,850 sft per floor" and drop 2,505 | Brochure p1: "2850 sft area per floor" |
| E2 | "Late handover? We pay you ৳40,000 every month." (hero, home, project page) | Adds "while your instalments are on time" | Brochure p7: paid only if the buyer's payments are on schedule |
| E3 | "The bedrooms face the water" / "Bedrooms and the living room open to the lake" | Master bedroom, a second bedroom and the family living room | Typical floor plan (drawn 180° rotated; lake side = M.BED, C.BED-01, F.LIVING) |
| E4 | Jolshiri guide: "Jolshiri Cantonment School & College" and "Bangladesh International School & College are inside the township"; chip "Shuttle to Dhaka Cantonment" | Names only Bangladesh International School & College (confirmed campus at Jolshiri) plus the brochure's planned schools; shuttle chip removed | Public sources; no source found for the other two |
| E5 | Project 07: "same specification as Lakeview Tasmee"; Project 41: "next to three handed-over Xen buildings" | Claims removed; Project 41 names Orion and Andromeda (both on Road 2) | Brochure p8 gives only location and status |

Still open with Xen (not changed): the typical plan image is captioned "TYPE-A (2505 SFT)" (see `docs/client-questions.md` #2); the brochure says 60 ft road on p1 and 40 ft on the plans; "15+ years", "REHAB member" and "Plans approved by Cantonment Board" have no source in the brochure.

☐ Approve  ☐ Change: ______________________

---

## F. Project film: Xen's first ad, silent and looping (21 Nov 2026, local only)

Xen's first Lakeview Tasmee ad (`Ad 2.0/Xen Ad.mp4`, 19 s, vertical 9:16) fills the film slot. This replaces the A1 placeholder reel.

- **Silent loop:** it autoplays muted, loops, and has no play button or controls. It pauses when scrolled off-screen. Visitors with reduced motion get a still with controls instead of autoplay.
- **Vertical card:** the frame is a 9:16 card (max 360 px wide) instead of 16:9, so the ad is not letter-boxed.
- **Copy:** home lede now reads "A 20-second look at Lakeview Tasmee: the building at night, the lake and its reflection."; the project page film band reads "Lakeview Tasmee in 20 seconds." The ad's own end card says "Architectural rendering, under construction".
- **File:** re-encoded to H.264, 720x1280, audio removed, 1.8 MB (`public/video/`). The 4K HEVC original (38 MB) stays on Majedul's disk.

☐ Approve  ☐ Change: ______________________

---

## D. Added from your handoff's "Not built yet" list (§6)
No sign-off needed. This is so you know it is covered:
- **Enquiries:** saved to Xen's admin, copied to the Google Sheet, and an **email alert to sales** for every enquiry and booking. Spam protection with a honeypot and a limit of 3 per phone per hour.
- **Floor availability:** from admin (A2).
- **Analytics:** GTM events for call, WhatsApp, brochure download and form submit.
- **Pages:** one URL per page and per project (`/projects/lakeview-tasmee` etc.). Pages are pre-rendered, so Google and Facebook read the full content.
- **SEO and sharing:** titles and descriptions; a share image made from the panorama; Organization and RealEstateListing data; a sitemap.
- **Old links:** old URLs redirect, including the Meta-ad links to `/projects/xen-lakeview-tasmee` and `/schedule-visit`.

**Still waiting on Xen** (your §9): price, real floor status, handover date, project film and drone footage, plan approval number, free pickup, Banani status, completed-project details and photos, clean renders, permission for the Jolshiri drone video, and the map pin coordinates.
