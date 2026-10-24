export type IconKind = "briefcase" | "target" | "cap" | "chat" | "mail";

export type Project = {
  slug: string;
  title: string;
  description: string;
  /** Panel colour from the design. */
  color: string;
  icon: IconKind;
};

export const projects: Project[] = [
  {
    slug: "experience",
    title: "Experience",
    description: "Manager at Elevation Burger, Kuwait",
    color: "#5A78D1",
    icon: "briefcase",
  },
  {
    slug: "target-roles",
    title: "Target Roles",
    description: "Restaurant, F&B and Operations Manager",
    color: "#D8CFBF",
    icon: "target",
  },
  {
    slug: "education",
    title: "Education",
    description: "Class XII, Samtse Higher Secondary School",
    color: "#A9BE84",
    icon: "cap",
  },
  {
    slug: "languages",
    title: "Languages",
    description: "English, Arabic, Hindi, Nepali",
    color: "#E25A4F",
    icon: "chat",
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Phone, WhatsApp and email",
    color: "#819CE3",
    icon: "mail",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
