import { projectsByStatus } from "@/data/projects";

// Developments currently open for site visits (the on-going + up-coming ones).
//
// Derived from src/data/projects.ts rather than hardcoded, so renaming or
// retiring a project there can't silently desync this dropdown — it used to
// be a separate free-text list that drifted from the real catalog.
// The booking RPC stores the chosen project as free text (no foreign key),
// so the *names* below still have to match what's shown elsewhere on the site.
export const BOOKABLE_PROJECTS: string[] = [
  ...projectsByStatus("On-going"),
  ...projectsByStatus("Up-coming"),
].map((p) => p.name);
