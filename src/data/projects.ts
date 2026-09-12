import xenOrionAsset from "@/assets/Xen_Orion_Plot_30__Road_2__DOHS_Chittagong.jpeg";
import xenAndromedaAsset from "@/assets/Xen_Andromeda_Plot_29__Rd_2__DOHS_Chittagong.jpeg";
import xenPegasusAsset from "@/assets/Xen_Pegasus_Plot_1__Road_1__DOHS_Chittagong.jpeg";
import xenNirvanaAsset from "@/assets/Xen_Nirvana.png";
import xenLakeviewTasmeeAsset from "@/assets/Xen_Lakeview_Tasmee.jpeg";
import upcomingBananiAsset from "@/assets/Upcoming_Banani.jpeg";
import project21DesktopAsset from "@/assets/Project_21_Desktop.png";
import upcomingJolshiriAsset from "@/assets/Upcoming_Jolshiri.jpeg";
import project07DesktopAsset from "@/assets/Project_07_Desktop.png";
import project41Asset from "@/assets/Completed_DOHS_Chittagong.jpeg";
import project41DesktopAsset from "@/assets/Project_41_Desktop.png";
import xenCassiopeaAsset from "@/assets/Xen_Cassiopea.jpeg";
import xenSarwarAsset from "@/assets/Xen_Sarwar.jpeg";
import xenScorpiosAsset from "@/assets/Xen_Scorpios.jpeg";
import xenElysiumAsset from "@/assets/Xen_Elysium.jpeg";
import xenPrimaVeraAsset from "@/assets/Xen_Prima_Vera.jpeg";
import project818Asset from "@/assets/Project_818.jpeg";
import project994Asset from "@/assets/Project_994.jpeg";
import project1026Asset from "@/assets/Project_1026.jpeg";
import projectLakeside from "@/assets/project-lakeside.jpg";
import projectRoadsideFront from "@/assets/project-roadside-front.jpg";
import projectRoadsidePerspective from "@/assets/project-roadside-perspective.png";
import xenLakeviewTasmeeGroundFloorPlan from "@/assets/Xen_Lakeview_Tasmee_Ground_Floor_Plan.png";
import xenLakeviewTasmeeTypicalFloorPlan from "@/assets/Xen_Lakeview_Tasmee_Typical_Floor_Plan.png";

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
    // Brochure-sourced fields, currently only populated for Lakeview Tasmee.
    frontage?: string;
    parking?: string;
  };
  vision?: string[];
  gallery?: string[];
  floorPlans?: { label: string; image: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "xen-lakeview-tasmee",
    name: "Xen Lakeview Tasmee",
    status: "On-going",
    location: "Plot 038, Road 504, Sector 14, Jolshiri Abason",
    badge: "Lakeview Project",
    description:
      "A 9-storey lakeside residence on Jolshiri's widest waterfront — 4-bedroom homes with 5 baths and 7 balconies per floor, set back from a 200 ft lake by a 30 ft green belt and an 8 ft walking track. On the lake. Not near it.",
    features: [
      "7 balconies per residence",
      "5 bathrooms per residence",
      "200 ft Jolshiri Lake frontage (NE)",
      "30 ft green belt + 8 ft walking track",
      "60 kVA Perkins/Stamford (UK) generator",
      "Korean 8-person elevator, 9 stoppages",
      "150 kVA dedicated sub-station",
      "RCC shear-wall core, BNBC 2020",
    ],
    expectedCompletion: "On request",
    image: xenLakeviewTasmeeAsset,
    specs: {
      unitTypes: "4-bedroom apartments",
      unitSizes: "2,505 sft (Type-A) · 2,850 sft floor plate",
      priceRange: "On request",
      totalUnits: "9 storey (G+8)",
      completion: "On request",
      frontage: "200 ft Jolshiri Lake, NE-facing",
      parking: "11 car spaces",
    },
    vision: [
      "Xen Lakeview Tasmee sits on a 200 ft stretch of the Jolshiri lake — double the frontage of the area's typical waterfront plot — set back by a 30 ft landscaped green belt and an 8 ft walking track, with open street access from a 60 ft road on the opposite side.",
      "Every residence carries 7 balconies and 5 bathrooms across 4 bedrooms, built on an RCC shear-wall core to BNBC 2020, with materials sample-tested by the Housing & Building Research Institute (HBRI) and structural drawings from BUET-trained engineers.",
    ],
    gallery: [projectLakeside, projectRoadsideFront, projectRoadsidePerspective],
    floorPlans: [
      { label: "Ground Floor Plan", image: xenLakeviewTasmeeGroundFloorPlan },
      { label: "Typical Floor Plan — Type-A (2,505 sft)", image: xenLakeviewTasmeeTypicalFloorPlan },
    ],
  },
  {
    id: 11,
    slug: "project-41",
    name: "Project 41",
    status: "On-going",
    location: "Plot 41, Road 2, DOHS Chattogram",
    badge: null,
    description:
      "An on-going residential tower on Plot 41, Road 2, DOHS Chattogram — quality construction to Xen's standard specification.",
    features: ["Quality Construction", "Modern Design"],
    expectedCompletion: "On request",
    image: project41DesktopAsset,
    gallery: [project41DesktopAsset, project41Asset],
  },
  {
    id: 8,
    slug: "project-21",
    name: "Project 21",
    status: "Up-coming",
    location: "Block B, Road 18, Plot 21, Banani, Dhaka",
    badge: null,
    description:
      "An upcoming residential development in Banani, Dhaka, currently in planning.",
    features: ["Prime Location", "Modern Design"],
    expectedCompletion: "On request",
    image: project21DesktopAsset,
    gallery: [project21DesktopAsset, upcomingBananiAsset],
  },
  {
    id: 9,
    slug: "project-07",
    name: "Project 07",
    status: "On-going",
    location: "Sector 8, Road 403, Plot 007, Jolshiri Abason, Dhaka",
    badge: null,
    description:
      "An on-going residential tower in Sector 8 of Jolshiri Abason, the Bangladesh Army-supervised township.",
    features: ["Modern Design", "Prime Location"],
    expectedCompletion: "On request",
    image: project07DesktopAsset,
    gallery: [project07DesktopAsset, upcomingJolshiriAsset],
  },
  {
    id: 3,
    slug: "xen-orion",
    name: "Xen Orion",
    status: "Completed",
    location: "Plot 30, Road 2, DOHS Chattogram",
    badge: null,
    description:
      "A handed-over residential project on Plot 30, Road 2, DOHS Chattogram.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenOrionAsset,
    gallery: [xenOrionAsset],
  },
  {
    id: 4,
    slug: "xen-andromeda",
    name: "Xen Andromeda",
    status: "Completed",
    location: "Plot 29, Road 2, DOHS Chattogram",
    badge: null,
    description:
      "A handed-over residential project on Plot 29, Road 2, DOHS Chattogram.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenAndromedaAsset,
    gallery: [xenAndromedaAsset],
  },
  {
    id: 5,
    slug: "xen-pegasus",
    name: "Xen Pegasus",
    status: "Completed",
    location: "Plot 1, Road 1, DOHS Chattogram",
    badge: null,
    description:
      "A handed-over residential project on Plot 1, Road 1, DOHS Chattogram.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenPegasusAsset,
    gallery: [xenPegasusAsset],
  },
  {
    id: 7,
    slug: "xen-nirvana",
    name: "Xen Nirvana",
    status: "Completed",
    location: "DOHS Chattogram",
    badge: null,
    description: "A handed-over residential project in DOHS Chattogram.",
    features: ["Quality Construction", "Timely Delivery", "Premium Location"],
    expectedCompletion: "Completed",
    image: xenNirvanaAsset,
    gallery: [xenNirvanaAsset],
  },
  {
    id: 12,
    slug: "xen-cassiopea",
    name: "Xen Cassiopea",
    status: "Completed",
    location: "DOHS Chattogram",
    badge: null,
    description: "A handed-over residential project in DOHS Chattogram.",
    features: [],
    expectedCompletion: "Completed",
    image: xenCassiopeaAsset,
    gallery: [xenCassiopeaAsset],
  },
  {
    id: 13,
    slug: "xen-sarwar",
    name: "Xen Sarwar",
    status: "Completed",
    location: "DOHS Chattogram",
    badge: null,
    description: "A handed-over residential project in DOHS Chattogram.",
    features: [],
    expectedCompletion: "Completed",
    image: xenSarwarAsset,
    gallery: [xenSarwarAsset],
  },
  {
    id: 14,
    slug: "xen-scorpios",
    name: "Xen Scorpios",
    status: "Completed",
    location: "DOHS Chattogram",
    badge: null,
    description: "A handed-over residential project in DOHS Chattogram.",
    features: [],
    expectedCompletion: "Completed",
    image: xenScorpiosAsset,
    gallery: [xenScorpiosAsset],
  },
  {
    id: 15,
    slug: "xen-elysium",
    name: "Xen Elysium",
    status: "Completed",
    location: "810/811, Road 33, Mirpur DOHS, Dhaka",
    badge: null,
    description:
      "A handed-over residential project at 810/811, Road 33, Mirpur DOHS, Dhaka.",
    features: [],
    expectedCompletion: "Completed",
    image: xenElysiumAsset,
    gallery: [xenElysiumAsset],
  },
  {
    id: 16,
    slug: "xen-prima-vera",
    name: "Xen Prima Vera",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "A handed-over residential project in Mirpur DOHS, Dhaka.",
    features: [],
    expectedCompletion: "Completed",
    image: xenPrimaVeraAsset,
    gallery: [xenPrimaVeraAsset],
  },
  {
    id: 17,
    slug: "project-818",
    name: "Project 818",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "A handed-over residential project in Mirpur DOHS, Dhaka.",
    features: [],
    expectedCompletion: "Completed",
    image: project818Asset,
    gallery: [project818Asset],
  },
  {
    id: 18,
    slug: "project-994",
    name: "Project 994",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "A handed-over residential project in Mirpur DOHS, Dhaka.",
    features: [],
    expectedCompletion: "Completed",
    image: project994Asset,
    gallery: [project994Asset],
  },
  {
    id: 19,
    slug: "project-1026",
    name: "Project 1026",
    status: "Completed",
    location: "Mirpur DOHS, Dhaka",
    badge: null,
    description: "A handed-over residential project in Mirpur DOHS, Dhaka.",
    features: [],
    expectedCompletion: "Completed",
    image: project1026Asset,
    gallery: [project1026Asset],
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

// Real, verifiable counts derived from the catalogue above — used anywhere the
// site states a portfolio statistic, so the number can never drift out of
// sync with the projects actually listed (see HeroSection.tsx / About.tsx).
export const COMPLETED_PROJECTS_COUNT = projectsByStatus("Completed").length;
export const ONGOING_PROJECTS_COUNT = projectsByStatus("On-going").length;
