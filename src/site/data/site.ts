// Public-site content. Ported from the approved prototype's js/data.js
// (Justechltd/Xen-Web-Redesign, v1.0, 19 Nov 2026). Edit content here, not in components.
// Sources: Xen brochure (2026), xendevltd.com project list. Never invent facts (spec §8).
import { SITE_CONTACT } from "@/lib/contact";

export type ProjectStatus = "ongoing" | "upcoming" | "completed";
export type Pair = [label: string, value: string];
export interface Pic { src: string; cap: string }

export interface Project {
  slug: string;
  name: string;
  status: ProjectStatus;
  featured?: boolean;
  area: string;
  address: string;
  image: string;
  gallery?: Pic[];
  summary?: string;
  facts?: Pair[];
  price?: string;
  handover?: string;
  plans?: Pic[];
  specs?: Pair[];
  /** MP4 URL of the project film. Empty until Xen supplies it (DEVIATIONS.md A1). */
  film?: string;
  /** Still shown before play, and whether the film is vertical (9:16). */
  filmPoster?: string;
  filmPortrait?: boolean;
  /** Silent clip that autoplays and loops (no controls, no sound). */
  filmLoop?: boolean;
}

/** Samir's sign-off switch for DEVIATIONS.md A3: show the prototype's yellow "tbc" /
 *  "To add" notes. Must stay false on the live site. */
export const SHOW_INTERNAL_NOTES = false;

const phones = [SITE_CONTACT.phonePrimary, SITE_CONTACT.phoneSecondary, SITE_CONTACT.phoneTertiary];

export const COMPANY = {
  name: "Xen Developments Ltd.",
  tagline: "A construction company with a little difference",
  leader: "Maj Gen (Retd) Badrul Millat",
  phones,
  phoneTel: SITE_CONTACT.phonePrimaryTel,
  whatsapp: SITE_CONTACT.whatsapp,
  email: SITE_CONTACT.email,
  office: `${SITE_CONTACT.addressLine1}, ${SITE_CONTACT.addressLine2}`,
  facebook: SITE_CONTACT.facebook,
  commitments: ["Highest quality", "Your satisfaction", "Timely handover"],
} as const;

export const BROCHURE = "/Xen-Developments-Brochure.pdf";

export const PROJECTS: Project[] = [
  {
    slug: "lakeview-tasmee",
    name: "Xen Lakeview Tasmee",
    status: "ongoing",
    featured: true,
    area: "Jolshiri Abashon",
    address: "Plot 038, Road 504, Sector 14, Jolshiri Abashon",
    image: "/img/tasmee-evening.webp",
    gallery: [
      { src: "/img/tasmee-evening.webp", cap: "Lakeside at dusk" },
      { src: "/img/project-lakeside.webp", cap: "Lakeside (NE) view" },
      { src: "/img/project-roadside-front.webp", cap: "Roadside (SW) view" },
      { src: "/img/project-roadside-perspective.webp", cap: "Roadside perspective" },
      { src: "/img/hero-lakeview-desktop.webp", cap: "Reflection on Jolshiri Lake" },
    ],
    summary:
      "A 9-storey lakeside residence in Sector 14. One 4-bedroom home per floor, facing a 200 ft wide lake across a 30 ft green belt and an 8 ft walking track.",
    facts: [
      ["Building", "9 storey (G+8)"],
      ["Floor area", "2,850 sft per floor"],
      ["Apartment", "4 beds · 5 baths · 7 balconies"],
      ["Lake side (NE)", "30 ft green · 8 ft track · 200 ft lake"],
      ["Road side (SW)", "60 ft wide road"],
      ["Parking", "1 space per apartment (11 in all)"],
    ],
    price: "On request", // TODO(Xen): price per sft / total
    handover: "On request", // TODO(Xen): projected handover date
    plans: [
      { src: "/img/tasmee-typical-plan.webp", cap: "Typical floor plan (Levels 1–8)" },
      { src: "/img/tasmee-ground-plan.webp", cap: "Ground floor: parking and entrance" },
    ],
    specs: [
      ["Structure", "Designed to BNBC 2020. RCC shear wall from foundation to the top of the lift core, against sway, earthquakes and wind."],
      ["Testing", "Random samples of every major material and the concrete mix tested at HBRI."],
      ["Steel", "Grade-72 deformed bars (billet), KSRM."],
      ["Cement", "Portland cement: Seven Rings (special), Shah or Premier."],
      ["Aggregate", "¾\" downgraded boulder stone chips in foundation, columns, beams, shear wall and reservoirs."],
      ["Walls", "1st-class automatic gas-burnt bricks."],
      ["Doors", "Main door solid teak. Other doors veneered flush, Hatil."],
      ["Windows", "Thai-cascaded windows, 4 mm glass and net. Balconies with 10 mm tempered glass in 2\" MS boxes, 3.5–3.75 ft high. No outside grills."],
      ["Floors", "32\" × 32\" mirror-polished tiles. 12\" × 24\" wall tiles in baths and kitchen."],
      ["Sanitary", "COTTO / TOTO basins, commodes and fittings."],
      ["Electrical", "Concealed BRB / BBS cables in unbreakable conduits. Switches with 5-year minimum warranty. AC provision in all bedrooms and living room."],
      ["Generator", "60 kVA, Perkins engine and Stamford alternator (UK). Backs up the lift, a light and fan per room, two fridge points and all common areas."],
      ["Elevator", "Korean, 8 persons (630 kg), 9 stops."],
      ["Power", "Dedicated 150 kVA sub-station with transformer."],
      ["Other", "Two 3 hp pumps. Intercom, Wi-Fi, TV and phone lines. Landscaped garden and lighting front, back and on the roof. 3.75 ft roof parapet. Heat-proofed top roof."],
    ],
    film: "/video/lakeview-tasmee-ad.mp4", // Xen Ad.mp4 (Ad 2.0), 19 s, 9:16, re-encoded to H.264
    filmPoster: "/video/lakeview-tasmee-ad-poster.webp",
    filmPortrait: true,
    filmLoop: true,
  },
  {
    slug: "project-07-jolshiri",
    name: "Project 07",
    status: "ongoing",
    area: "Jolshiri Abashon",
    address: "Plot 007, Road 403, Sector 8, Jolshiri Abashon",
    image: "/img/upcoming-jolshiri.webp",
    gallery: [{ src: "/img/upcoming-jolshiri.webp", cap: "Front view" }, { src: "/img/project-07-desktop.webp", cap: "Street view" }],
    summary: "A residential building in Sector 8 of Jolshiri Abashon. Construction is on-going.",
    facts: [["Location", "Sector 8, Jolshiri"], ["Status", "Construction on-going"]],
  },
  {
    slug: "project-41-ctg",
    name: "Project 41",
    status: "ongoing",
    area: "DOHS Chattogram",
    address: "Plot 41, Road 2, DOHS Chattogram",
    image: "/img/completed-dohs-chittagong.webp",
    gallery: [{ src: "/img/completed-dohs-chittagong.webp", cap: "Front view" }, { src: "/img/project-41-desktop.webp", cap: "Street view" }],
    summary: "A residential building on Road 2 of DOHS Chattogram, where Xen has already handed over Orion and Andromeda.",
    facts: [["Location", "Road 2, DOHS Chattogram"], ["Status", "Construction on-going"]],
  },
  {
    slug: "project-21-banani",
    name: "Project 21",
    status: "upcoming",
    area: "Banani",
    address: "Plot 21, Road 18, Block B, Banani, Dhaka",
    image: "/img/upcoming-banani.webp",
    gallery: [{ src: "/img/upcoming-banani.webp", cap: "Proposed design" }, { src: "/img/project-21-desktop.webp", cap: "Aerial view" }],
    summary: "A residential building in Block B, Banani. Design is complete and approvals are in progress. Register now to see floor plans and prices first.",
    facts: [["Location", "Block B, Banani"], ["Status", "In planning"]],
  },
  { slug: "xen-orion", name: "Xen Orion", status: "completed", area: "DOHS Chattogram", address: "Plot 30, Road 2, DOHS Chattogram", image: "/img/xen-orion-plot-30-road-2-dohs-chittagong.webp" },
  { slug: "xen-andromeda", name: "Xen Andromeda", status: "completed", area: "DOHS Chattogram", address: "Plot 29, Road 2, DOHS Chattogram", image: "/img/xen-andromeda-plot-29-rd-2-dohs-chittagong.webp" },
  { slug: "xen-pegasus", name: "Xen Pegasus", status: "completed", area: "DOHS Chattogram", address: "Plot 1, Road 1, DOHS Chattogram", image: "/img/xen-pegasus-plot-1-road-1-dohs-chittagong.webp" },
  { slug: "xen-nirvana", name: "Xen Nirvana", status: "completed", area: "DOHS Chattogram", address: "DOHS Chattogram", image: "/img/xen-nirvana.webp" },
  { slug: "xen-cassiopea", name: "Xen Cassiopea", status: "completed", area: "DOHS Chattogram", address: "DOHS Chattogram", image: "/img/xen-cassiopea.webp" },
  { slug: "xen-sarwar", name: "Xen Sarwar", status: "completed", area: "DOHS Chattogram", address: "DOHS Chattogram", image: "/img/xen-sarwar.webp" },
  { slug: "xen-scorpios", name: "Xen Scorpios", status: "completed", area: "DOHS Chattogram", address: "DOHS Chattogram", image: "/img/xen-scorpios.webp" },
  { slug: "xen-elysium", name: "Xen Elysium", status: "completed", area: "Mirpur DOHS", address: "House 810/811, Road 33, Mirpur DOHS, Dhaka", image: "/img/xen-elysium.webp" },
  { slug: "xen-prima-vera", name: "Xen Prima Vera", status: "completed", area: "Mirpur DOHS", address: "Mirpur DOHS, Dhaka", image: "/img/xen-prima-vera.webp" },
  { slug: "project-818", name: "Project 818", status: "completed", area: "Mirpur DOHS", address: "Mirpur DOHS, Dhaka", image: "/img/project-818.webp" },
  { slug: "project-994", name: "Project 994", status: "completed", area: "Mirpur DOHS", address: "Mirpur DOHS, Dhaka", image: "/img/project-994.webp" },
  { slug: "project-1026", name: "Project 1026", status: "completed", area: "Mirpur DOHS", address: "Mirpur DOHS, Dhaka", image: "/img/project-1026.webp" },
];

export const STATUS_ORDER: ProjectStatus[] = ["ongoing", "upcoming", "completed"];
export const STATUS_LABEL: Record<ProjectStatus, string> = { ongoing: "On-going", upcoming: "Up-coming", completed: "Completed" };

export const FEATURED = PROJECTS.find((p) => p.featured)!;
export const byStatus = (s: ProjectStatus) => PROJECTS.filter((p) => p.status === s);
export const countStatus = (s: ProjectStatus) => byStatus(s).length;
export const getProject = (slug: string | undefined) => PROJECTS.find((p) => p.slug === slug);
export const isStatus = (s: string | undefined): s is ProjectStatus => !!s && (STATUS_ORDER as string[]).includes(s);

/** Names offered in the lead form and booking (projects open for sale or registration). */
export const ENQUIRY_PROJECTS = PROJECTS.filter((p) => p.status !== "completed");

/** Old live-site slugs → new slugs (mirrored as 301s in vercel.json). */
export const LEGACY_SLUGS: Record<string, string> = {
  "xen-lakeview-tasmee": "lakeview-tasmee",
  "project-41": "project-41-ctg",
  "project-21": "project-21-banani",
  "project-07": "project-07-jolshiri",
};

export const projectPath = (p: Pick<Project, "slug">) => `/projects/${p.slug}`;
export const statusPath = (s: ProjectStatus) => `/projects/${s}`;

/** wa.me link with an optional prefilled message. */
export const waLink = (text?: string) => (text ? `${COMPANY.whatsapp}?text=${encodeURIComponent(text)}` : COMPANY.whatsapp);
export const telHref = (display: string) => `tel:+88${display.replace(/\D/g, "")}`;
