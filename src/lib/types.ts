import type { StaticImageData } from "next/image";

export type VisualMode = "editorial" | "kinetic" | "studio";

export type MediaAsset = {
  src: string | StaticImageData;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  role: string;
  stack: string[];
  outcomes: string[];
  status: "published" | "anonymized" | "draft";
  featured: boolean;
  links: { label: string; href: string }[];
  images: MediaAsset[];
};

export type TimelineItem = {
  title: string;
  organization: string;
  date: string;
  location?: string;
  description: string;
  href?: string;
};

export type Certificate = {
  title: string;
  issuer: string;
  year: string;
  image: MediaAsset;
};

export type PortfolioData = {
  profile: {
    name: string;
    role: string;
    location: string;
    email: string;
    phone: string;
    intro: string;
    bio: string;
    availability: string;
    resumeHref: string;
    avatar: MediaAsset;
    socials: { label: string; href: string }[];
  };
  projects: Project[];
  experience: TimelineItem[];
  education: TimelineItem[];
  achievements: TimelineItem[];
  certificates: Certificate[];
  skills: { group: string; items: string[] }[];
};
