// Developments currently open for site visits (the on-going + up-coming ones).
//
// The full public marketing catalog lives as a static array in
// src/pages/Projects.tsx; this is the curated subset a visitor can actually
// schedule a tour for — completed/delivered projects are intentionally excluded.
// The booking RPC stores the chosen project as free text (no foreign key), so
// this list is the single source of truth for the Schedule-a-Visit dropdown.
// Update it here when a development opens for or closes to visits.
export const BOOKABLE_PROJECTS: string[] = [
  "Lakeview Tasmee",
  "Project 41",
  "Project 07",
  "Project 21",
];
