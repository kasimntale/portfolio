export const profile = {
  name: "Ntale Kasim",
  email: "kasimntale2@gmail.com",
  github: "https://github.com/kasimntale",
  linkedin: "",
  resume: "",
  headline: "Building software. Solving real problems.",
  portrait: "/images/portrait-placeholder.svg",
  portraitPosition: "50% 50%",
  portraitZoom: 1,
  portraitIsPlaceholder: true,
  description:
    "Software engineer building practical products at the intersection of full-stack development, data, and open source.",
};
export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  approach: string;
  stack: string[];
  status: string;
  visual: string;
  github?: string;
  demo?: string;
};
// Project directions from the owner. Proposed stacks are not verified implementation claims.
export const projects: Project[] = [
  {
    slug: "mirrorload",
    number: "01",
    title: "MirrorLoad",
    category: "Developer tooling / Open source",
    summary: "A clearer view of software testing and session orchestration.",
    problem:
      "Coordinating test sessions can scatter execution state and make failures difficult to trace.",
    approach:
      "Explore a session-oriented workflow that keeps test execution, orchestration, and inspection in one place. Implementation details and release status are awaiting confirmation.",
    stack: ["TypeScript", "Node.js", "Test orchestration"],
    status: "Project brief · implementation to verify",
    visual: "terminal",
  },
  {
    slug: "academy-os",
    number: "02",
    title: "Academy OS",
    category: "Full-stack / Sports technology",
    summary: "An operational home for the people behind the game.",
    problem:
      "Football academies need a coherent way to organize players, training, and day-to-day administration.",
    approach:
      "Design a shared operational workspace around academy workflows. Modules, production stack, and delivery status are awaiting confirmation.",
    stack: ["React", "API design", "Relational data"],
    status: "Project brief · implementation to verify",
    visual: "pitch",
  },
  {
    slug: "pocketledger",
    number: "03",
    title: "PocketLedger",
    category: "Mobile / Local-first software",
    summary: "Personal finance that starts with life offline.",
    problem:
      "Tracking everyday spending should remain possible without a reliable internet connection.",
    approach:
      "Put local data and offline interactions at the center of the experience. Storage, synchronization, and platform choices remain to be verified.",
    stack: ["Local-first design", "Mobile UI", "Data modeling"],
    status: "Project brief · implementation to verify",
    visual: "ledger",
  },
  {
    slug: "wetguard",
    number: "04",
    title: "WetGuard",
    category: "Data science / Environmental technology",
    summary: "Making environmental change easier to see.",
    problem:
      "Wetland changes can be hard to interpret without consistent, accessible monitoring information.",
    approach:
      "Investigate a wetland monitoring and change-detection concept using geospatial data. This is a concept, not a deployed monitoring system.",
    stack: ["Python", "Geospatial data", "Change detection"],
    status: "Concept / research direction",
    visual: "terrain",
  },
];
export const skills = [
  {
    title: "Frontend engineering",
    items: [
      "React & Next.js",
      "TypeScript",
      "Accessible interfaces",
      "Responsive design",
    ],
  },
  {
    title: "Backend engineering",
    items: [
      "API design",
      "Node.js",
      "Service architecture",
      "Authentication patterns",
    ],
  },
  {
    title: "Mobile development",
    items: [
      "Mobile-first interfaces",
      "Offline-first design",
      "Local persistence",
    ],
  },
  {
    title: "Data & machine learning",
    items: [
      "Python",
      "Data preparation",
      "Model evaluation",
      "Exploratory analysis",
    ],
  },
  {
    title: "Databases & cloud",
    items: [
      "Relational modeling",
      "SQL",
      "Deployment workflows",
      "Data integrity",
    ],
  },
  {
    title: "Tools & testing",
    items: [
      "Git & GitHub",
      "Automated testing",
      "Quality review",
      "Open-source workflows",
    ],
  },
];
export const journey = [
  {
    label: "01 / FOUNDATION",
    title: "Computer science",
    text: "A computer science background informs how I approach systems, data, and problem solving. Institution and dates to be added.",
  },
  {
    label: "02 / PRACTICE",
    title: "Quality as a discipline",
    text: "AI data annotation and quality-review work, with an emphasis on careful evaluation and consistent judgments. Organization, role dates, and scope to be added.",
  },
  {
    label: "03 / DIRECTION",
    title: "Building useful things",
    text: "Exploring full-stack products, open-source tooling, and data-driven ideas through the projects presented here. Verified milestones will be added as work develops.",
  },
];
