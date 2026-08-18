import xenOrionAsset from "@/assets/Xen_Orion_Plot_30__Road_2__DOHS_Chittagong.jpeg";
import xenAndromedaAsset from "@/assets/Xen_Andromeda_Plot_29__Rd_2__DOHS_Chittagong.jpeg";
import xenPegasusAsset from "@/assets/Xen_Pegasus_Plot_1__Road_1__DOHS_Chittagong.jpeg";
import xenNirvanaAsset from "@/assets/Xen_Nirvana.png";
import xenLakeviewTasmeeAsset from "@/assets/Xen_Lakeview_Tasmee.jpeg";
import upcomingBananiAsset from "@/assets/Upcoming_Banani.jpeg";
import upcomingJolshiriAsset from "@/assets/Upcoming_Jolshiri.jpeg";
import project41Asset from "@/assets/Completed_DOHS_Chittagong.jpeg";
import xenCassiopeaAsset from "@/assets/Xen_Cassiopea.jpeg";
import xenSarwarAsset from "@/assets/Xen_Sarwar.jpeg";
import xenScorpiosAsset from "@/assets/Xen_Scorpios.jpeg";
import xenElysiumAsset from "@/assets/Xen_Elysium.jpeg";
import xenPrimaVeraAsset from "@/assets/Xen_Prima_Vera.jpeg";
import project818Asset from "@/assets/Project_818.jpeg";
import project994Asset from "@/assets/Project_994.jpeg";
import project1026Asset from "@/assets/Project_1026.jpeg";

export type ProjectStatus = "On-going" | "Up-coming" | "Completed";

export interface Project {
  id: number;
  slug: string;
  name: string;
  status: ProjectStatus;
  location: string;
  badge: string | null;
  description: string;
  features: string[];
  expectedCompletion: string;
  image: string;
  // Rich detail fields — populated for the flagship project, optional elsewhere.
  specs?: {
    unitTypes?: string;
    unitSizes?: string;
    priceRange?: string;
    totalUnits?: string;
    completion?: string;
  };
  vision?: string[];
  gallery?: string[];
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "xen-lakeview-tasmee",
    name: "Xen Lakeview Tasmee",
    status: "On-going",
    location: "Jolshiri Abashon, Dhaka",
    badge: "Lakeview Project",
    description:
      "Xen Lakeview Tasmee brings lakeside calm to modern Dhaka living. Every residence is designed for natural light and airflow, with sweeping views of the water beyond.",
    features: ["Lake View", "Dual Aspect Design", "Premium Finishes"],
    expectedCompletion: "Q4 2026",
    image: xenLakeviewTasmeeAsset,
    specs: {
      unitTypes: "3BHK, 4BHK",
      unitSizes: "2,850 Sqft",
      priceRange: "From 3.5 Cr BDT",
      totalUnits: "G+8 (9 Stories)",
      completion: "Q4 2026",
    },
    vision: [
      "Xen Lakeview Tasmee is designed around its setting — clean geometric lines in fair-faced concrete and warm timber, framed by expansive glazing that opens each home to the lake.",
      "Every square foot is planned with intent, balancing modern luxury with structural permanence built to last.",
    ],
  },
  {
    id: 11,
    slug: "project-41",
    name: "Project 41",
    status: "On-going",
    location: "Road 2, Plot 41, DOHS Chittagong",
    badge: null,
    description: "Details coming soon.",
    features: ["Quality Construction", "Modern Design"],
    expectedCompletion: "TBD",
    image: project41Asset,
  },
  {
    id: 8,
    slug: "upcoming-banani",
    name: "Project 21",
    status: "Up-coming",
    location: "Block B, Rd 18, Plot 21, Banani, Dhaka",
    badge: null,
    description:
      "An upcoming residential development in prime Banani, with modern architectural design.",
    features: ["Prime Location", "Modern Design"],
    expectedCompletion: "TBD",
    image: upcomingBananiAsset,
  },
  {
    id: 9,
    slug: "project-07",
    name: "Project 07",
    status: "On-going",
    location: "Sec 8, Rd 403, Plot 07, Jolshiri, Dhaka",
    badge: null,
    description: "Details coming soon.",
    features: ["Modern Design", "Prime Location"],
    expectedCompletion: "TBD",
    image: upcomingJolshiriAsset,
  },
  {
    id: 3,
    slug: "xen-orion",
    name: "Xen Orion",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description:
      "A completed residential project, built on quality and delivered on time.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenOrionAsset,
  },
  {
    id: 4,
    slug: "xen-andromeda",
    name: "Xen Andromeda",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description:
      "A commercial hub blending green space with modern corporate design.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenAndromedaAsset,
  },
  {
    id: 5,
    slug: "xen-pegasus",
    name: "Xen Pegasus",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description:
      "A completed residential project, built on quality and delivered on time.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenPegasusAsset,
  },
  {
    id: 7,
    slug: "xen-nirvana",
    name: "Xen Nirvana",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description:
      "Luxury condominiums with sweeping city views and modern amenities.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenNirvanaAsset,
  },
  {
    id: 12,
    slug: "xen-cassiopea",
    name: "Xen Cassiopea",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenCassiopeaAsset,
  },
  {
    id: 13,
    slug: "xen-sarwar",
    name: "Xen Sarwar",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenSarwarAsset,
  },
  {
    id: 14,
    slug: "xen-scorpios",
    name: "Xen Scorpios",
    status: "Completed",
    location: "Chittagong DOHS",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenScorpiosAsset,
  },
  {
    id: 15,
    slug: "xen-elysium",
    name: "Xen Elysium",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description:
      "Blending traditional aesthetics with contemporary luxury in the heart of the city.",
    features: [],
    expectedCompletion: "Completed",
    image: xenElysiumAsset,
  },
  {
    id: 16,
    slug: "xen-prima-vera",
    name: "Xen Prima Vera",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: xenPrimaVeraAsset,
  },
  {
    id: 17,
    slug: "project-818",
    name: "Project 818",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: project818Asset,
  },
  {
    id: 18,
    slug: "project-994",
    name: "Project 994",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: project994Asset,
  },
  {
    id: 19,
    slug: "project-1026",
    name: "Project 1026",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "",
    features: [],
    expectedCompletion: "Completed",
    image: project1026Asset,
  },
];

export const projectsByStatus = (status: ProjectStatus) =>
  PROJECTS.filter((p) => p.status === status);

export const getProjectBySlug = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);

// The three "Our Developments" cards on Home — Xen Nirvana / Xen Andromeda / Xen Elysium,
// matching the Figma exactly.
export const FEATURED_DEVELOPMENTS = ["xen-nirvana", "xen-andromeda", "xen-elysium"]
  .map(getProjectBySlug)
  .filter((p): p is Project => !!p);
