import cplusCert from "@/app/images/CPlus-Intermediate-Cert.png";
import hackCert from "@/app/images/Hackathon-Certificate.png";
import oracleCert from "@/app/images/Oracle-Certificate.png";
import outsoarCert from "@/app/images/Outsoar-Certificate.png";
import profileImage from "@/app/images/profile.jpg";
import sapCert from "@/app/images/SAP-Certificate.png";
import webDevCert from "@/app/images/WebDev-Cert.png";
import kulamBatt from "@/app/images/ku-batt.png";
import kulamMenu from "@/app/images/ku-menu.png";
import kulamSettings from "@/app/images/ku-sett.png";
import kulamStory from "@/app/images/ku-as.png";

import type { PortfolioData } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";

export const fallbackPortfolioData: PortfolioData = {
  profile: {
    name: "Keanu Dane Tibule",
    role: "Frontend Developer and UI-focused builder",
    location: "Pangasinan, Philippines",
    email: "keanudanetibule@gmail.com",
    phone: "+63 969 157 3459",
    availability: "Open to junior frontend, UI engineering, and part-time web work",
    intro:
      "I build polished interfaces with a soft spot for motion, visual systems, and practical product experiences.",
    bio: "This portfolio is now a living CMS-backed showcase for frontend craft, case studies, certificates, and a cleaner way for recruiters or collaborators to reach me.",
    resumeHref: "/Keanu-Dane-Resume.pdf",
    avatar: {
      src: profileImage,
      alt: "Portrait of Keanu Dane Tibule",
    },
    socials: [
      { label: "GitHub", href: "https://github.com/Keanu-Tibule" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/keanu-dane-tibule-4b4009281/",
      },
      { label: "Email", href: "mailto:keanudanetibule@gmail.com" },
    ],
  },
  projects: [
    {
      slug: "kulam-filipino-horror-game",
      title: "Kulam: A 3D Filipino Horror Game",
      eyebrow: "Best Thesis Award",
      summary:
        "A solo-developed Unreal Engine thesis project blending Filipino horror themes, gameplay systems, and atmospheric level design.",
      description:
        "Kulam was built as a capstone project in Unreal Engine 5.2. I handled the concept, systems, environment setup, gameplay flow, UI moments, and final presentation.",
      role: "Solo developer",
      stack: ["Unreal Engine 5.2", "Blueprints", "3D gameplay", "UI flow"],
      outcomes: [
        "Won Best Thesis Award",
        "Delivered a playable horror experience from concept to demo",
        "Practiced end-to-end ownership under deadline pressure",
      ],
      status: "published",
      featured: true,
      links: [{ label: "GitHub profile", href: "https://github.com/Keanu-Tibule" }],
      images: [
        { src: kulamMenu, alt: "Kulam main menu screen" },
        { src: kulamBatt, alt: "Kulam gameplay screenshot" },
        { src: kulamSettings, alt: "Kulam settings menu screen" },
        { src: kulamStory, alt: "Kulam story screen" },
      ],
    },
    {
      slug: "confidential-business-systems",
      title: "Confidential Business Systems",
      eyebrow: "Anonymized case study",
      summary:
        "Internal web work from previous roles, summarized safely without exposing private company code, names, or screenshots.",
      description:
        "Some newer work cannot be shown directly. This case-study format keeps the useful signal: the kind of UI, constraints, collaboration, data handling, and delivery habits involved, while respecting confidentiality.",
      role: "Frontend and product-support contributor",
      stack: ["React", "TypeScript", "Forms", "Dashboards", "Email workflows"],
      outcomes: [
        "Built around real users and operational constraints",
        "Practiced production habits around privacy and maintainability",
        "Prepared a recruiter-safe format for discussing private work",
      ],
      status: "anonymized",
      featured: true,
      links: [{ label: "Contact for context", href: "/#contact" }],
      images: [],
    },
  ],
  experience: [
    {
      title: "Software Developer Intern",
      organization: "Outsoar PH",
      date: "March 2024 - May 2024",
      location: "San Carlos City, Philippines",
      description:
        "Worked around practical web development tasks and learned how production constraints shape everyday implementation choices.",
      href: "https://www.outsoar.ph/",
    },
    {
      title: "Research Assistant",
      organization: "Remote research work",
      date: "May 2023 - May 2024",
      location: "Florida, United States",
      description:
        "Supported research work remotely, building discipline around communication, accuracy, and independent execution.",
    },
    {
      title: "I.T. Department Intern",
      organization: "Moog Controls Inc.",
      date: "April 2018 - May 2018",
      location: "Baguio City, Philippines",
      description:
        "Early IT exposure that helped shape the path toward software and support-oriented technical work.",
      href: "https://www.moog.com/",
    },
  ],
  education: [
    {
      title: "BS Information Technology",
      organization: "STI College Dagupan",
      date: "2024",
      description: "Graduated with a thesis project focused on game development and interactive systems.",
    },
    {
      title: "TVL Track, ICT Strand",
      organization: "University of Baguio",
      date: "2018",
      description: "Built early foundations in practical computing and ICT.",
    },
  ],
  achievements: [
    {
      title: "Best in Thesis",
      organization: "STI College",
      date: "2024",
      description: "Awarded for a solo-developed 3D Filipino horror capstone project.",
    },
    {
      title: "CodeFest Placer",
      organization: "STI College",
      date: "2022",
      description: "Placed second in a one-week coding competition.",
    },
    {
      title: "Student Council President",
      organization: "Informatics Institute",
      date: "2018 - 2019",
      description: "Led student council work and strengthened communication habits.",
    },
  ],
  certificates: [
    {
      title: "Web Development Certificate",
      issuer: "Training certificate",
      year: "2024",
      image: { src: webDevCert, alt: "Web development certificate" },
    },
    {
      title: "Outsoar Certificate",
      issuer: "Outsoar PH",
      year: "2024",
      image: { src: outsoarCert, alt: "Outsoar certificate" },
    },
    {
      title: "C++ Intermediate",
      issuer: "Programming certificate",
      year: "2024",
      image: { src: cplusCert, alt: "C++ intermediate certificate" },
    },
    {
      title: "Oracle Certificate",
      issuer: "Oracle",
      year: "2024",
      image: { src: oracleCert, alt: "Oracle certificate" },
    },
    {
      title: "Hackathon Certificate",
      issuer: "Hackathon",
      year: "2024",
      image: { src: hackCert, alt: "Hackathon certificate" },
    },
    {
      title: "SAP Certificate",
      issuer: "SAP",
      year: "2024",
      image: { src: sapCert, alt: "SAP certificate" },
    },
  ],
  skills: [
    {
      group: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "UI systems"],
    },
    {
      group: "Product UI",
      items: ["Responsive design", "Motion", "Forms", "Dashboards", "Accessibility"],
    },
    {
      group: "Backend-adjacent",
      items: ["Supabase", "Postgres", "Email workflows", "REST APIs", "Auth"],
    },
    {
      group: "Creative tech",
      items: ["Unreal Engine", "Unity", "Blender", "Game UI", "Interactive demos"],
    },
  ],
};

export async function getPortfolioData(): Promise<PortfolioData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return fallbackPortfolioData;
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const [profile, projects, projectMedia, timeline, skills, certificates] = await Promise.all([
      supabase.from("profile").select("*").maybeSingle(),
      supabase
        .from("projects")
        .select("*")
        .in("status", ["published", "anonymized"])
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("project_media")
        .select("project_id,url,alt,sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("timeline_items")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("skills")
        .select("group_name,label,sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("certificates")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (
      profile.error ||
      projects.error ||
      projectMedia.error ||
      timeline.error ||
      skills.error ||
      certificates.error
    ) {
      return fallbackPortfolioData;
    }

    const mediaByProject = new Map<string, { src: string; alt: string }[]>();

    for (const media of projectMedia.data ?? []) {
      const items = mediaByProject.get(media.project_id) ?? [];
      items.push({ src: media.url, alt: media.alt });
      mediaByProject.set(media.project_id, items);
    }

    const cmsProjects = (projects.data ?? []).map((project) => ({
      slug: project.slug,
      title: project.title,
      eyebrow: project.eyebrow ?? project.role ?? "Selected work",
      summary: project.summary,
      description: project.description ?? project.summary,
      role: project.role ?? "Contributor",
      stack: project.stack ?? [],
      outcomes: project.outcomes ?? [],
      status: project.status,
      featured: project.featured,
      links: [
        project.live_url ? { label: "Live project", href: project.live_url } : null,
        project.repo_url ? { label: "Repository", href: project.repo_url } : null,
      ].filter((link): link is { label: string; href: string } => Boolean(link)),
      images: mediaByProject.get(project.id) ?? [],
    }));

    const timelineItems = (kind: "experience" | "education" | "achievement") =>
      (timeline.data ?? [])
        .filter((item) => item.kind === kind)
        .map((item) => ({
          title: item.title,
          organization: item.organization,
          date: item.date_label,
          location: item.location_label ?? undefined,
          description: item.description,
          href: item.href ?? undefined,
        }));

    const skillGroups = new Map<string, string[]>();

    for (const skill of skills.data ?? []) {
      const items = skillGroups.get(skill.group_name) ?? [];
      items.push(skill.label);
      skillGroups.set(skill.group_name, items);
    }

    return {
      profile: profile.data
        ? {
            ...fallbackPortfolioData.profile,
            name: profile.data.full_name,
            role: profile.data.role,
            intro: profile.data.headline ?? fallbackPortfolioData.profile.intro,
            bio: profile.data.bio ?? fallbackPortfolioData.profile.bio,
            location: profile.data.location_label ?? fallbackPortfolioData.profile.location,
            email: profile.data.email ?? fallbackPortfolioData.profile.email,
            phone: profile.data.phone ?? fallbackPortfolioData.profile.phone,
            resumeHref: profile.data.resume_url ?? fallbackPortfolioData.profile.resumeHref,
            avatar: profile.data.avatar_url
              ? { src: profile.data.avatar_url, alt: `Portrait of ${profile.data.full_name}` }
              : fallbackPortfolioData.profile.avatar,
            socials: Array.isArray(profile.data.socials)
              ? (profile.data.socials as { label: string; href: string }[])
              : fallbackPortfolioData.profile.socials,
          }
        : fallbackPortfolioData.profile,
      projects: cmsProjects.length > 0 ? cmsProjects : fallbackPortfolioData.projects,
      experience: timelineItems("experience").length
        ? timelineItems("experience")
        : fallbackPortfolioData.experience,
      education: timelineItems("education").length
        ? timelineItems("education")
        : fallbackPortfolioData.education,
      achievements: timelineItems("achievement").length
        ? timelineItems("achievement")
        : fallbackPortfolioData.achievements,
      certificates: (certificates.data ?? []).some((certificate) => certificate.image_url)
        ? (certificates.data ?? [])
            .filter((certificate) => certificate.image_url)
            .map((certificate) => ({
              title: certificate.title,
              issuer: certificate.issuer ?? "Certificate",
              year: certificate.year_label ?? "",
              image: {
                src: certificate.image_url,
                alt: certificate.alt ?? certificate.title,
              },
            }))
        : fallbackPortfolioData.certificates,
      skills:
        skillGroups.size > 0
          ? Array.from(skillGroups.entries()).map(([group, items]) => ({ group, items }))
          : fallbackPortfolioData.skills,
    };
  } catch {
    return fallbackPortfolioData;
  }
}

export async function getProject(slug: string) {
  const data = await getPortfolioData();
  return data.projects.find((project) => project.slug === slug);
}
