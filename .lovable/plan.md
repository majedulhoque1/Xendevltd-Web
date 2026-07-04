## About Page Content Updates

### 1. Our Story Section — Replace Body Copy
In `src/pages/About.tsx`, keep the heading "Building Dreams, Creating Legacies" and replace the 3 existing `<p>` paragraphs under it with the new full company story provided by the user. Keep the image placeholder area exactly as-is.

### 2. Core Values Section — Expand from 4 to 6 Cards
- Keep the existing 4 values unchanged (Trust & Transparency, Quality Excellence, Customer First, Timely Delivery).
- Add 2 new entries to the `values` array:
  - **REHAB Certified Member** — description: "Proud members of the Real Estate Housing Association Bangladesh, upholding industry standards." — icon: `BadgeCheck` (lucide-react).
  - **BNBC Compliant** — description: "Every structure is built in full compliance with Bangladesh National Building Code for your safety." — icon: `ShieldCheck` (lucide-react).
- Update the values grid from `lg:grid-cols-4` to `lg:grid-cols-3` so the 6 cards render as 2 rows of 3 on large screens. Responsive breakpoints (`sm:grid-cols-2`) remain.

### No-Change Areas
- Navbar, stats section, Mission & Vision cards, CTA section, footer, all design tokens, colors, fonts, animations, and component structure remain untouched.
- Import only the two new lucide-react icons needed (`BadgeCheck`, `ShieldCheck`).