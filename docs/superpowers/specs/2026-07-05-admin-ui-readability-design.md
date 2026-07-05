# Admin UI Readability & Navigation Polish

## Problem

The admin panel (`src/pages/admin/*`, `src/components/admin/AdminLayout.tsx`) inherits a
site-wide rule (`src/index.css`) that forces every `h1`-`h6` into **Gruppo**, a stylized
display font intended for the public site's hero/section titles. Functional page titles
("Bookings", "Availability", "Submissions", "CRM") render in that display font while the
header logo separately overrides to Playfair Serif — an inconsistent, low-legibility
result for a data-entry tool. Card/background tones are also very close in lightness,
so content doesn't visually separate from its surroundings, and tables have no
row-hover/scan aid.

Scope is the admin panel only. The public marketing site's typography is unchanged.

## Approach

1. **Admin-scoped heading font.** Wrap `AdminLayout`'s root element in a class
   (`admin-shell`) and add a `@layer base` override in `index.css` so `h1`-`h3` inside
   `.admin-shell` use Montserrat (the site's existing body sans, already loaded) instead
   of Gruppo. No new font assets, no changes outside the admin scope.
2. **Contrast pass.** Strengthen the visual separation between page background and
   cards/tables: slightly stronger border + shadow on card/table containers so content
   reads as distinct surfaces rather than blending into the page background.
3. **Table scan-ability.** Add a hover-highlight state to rows in the Bookings and
   Submissions tables so a row is easy to track while scanning across columns.
4. **Minor hierarchy bump.** Slightly increase page-title weight/size where it reads too
   close to body text once the font changes.

## Files touched

- `src/index.css` — add `.admin-shell` heading override, keep everything else as-is.
- `src/components/admin/AdminLayout.tsx` — add `admin-shell` class to root wrapper.
- `src/pages/admin/Bookings.tsx`, `Submissions.tsx` — row hover state on `<tr>`.
- `src/pages/admin/CRM.tsx`, `Availability.tsx` — card/table container contrast tweaks
  if needed for consistency.

## Out of scope

- No changes to navigation structure (top nav stays as-is; user confirmed navigation
  itself is not the pain point).
- No changes to the public site's typography or components.
- No new dependencies, no data/behavior changes.

## Risks

Low. Purely presentational (CSS classes + Tailwind utility classes), scoped to a class
selector that only exists inside the admin panel. No shared components outside
`src/pages/admin` and `src/components/admin` are touched.
