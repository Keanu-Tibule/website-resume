"use client";

import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Github,
  Layers3,
  Linkedin,
  Lock,
  Loader2,
  Mail,
  Send,
  Sparkles,
  SunMedium,
  WandSparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PortfolioData, Project, VisualMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const modes = [
  {
    id: "editorial",
    label: "Editorial Glassfolio",
    description: "Airy, polished, recruiter-friendly, and calm.",
    icon: Sparkles,
  },
  {
    id: "kinetic",
    label: "Dark Kinetic Tech",
    description: "Darker, sharper, animated, and more experimental.",
    icon: WandSparkles,
  },
  {
    id: "studio",
    label: "Warm Minimal Studio",
    description: "Soft, personal, rounded, and approachable.",
    icon: SunMedium,
  },
] as const;

const copy = {
  editorial: {
    eyebrow: "Frontend portfolio, tuned for clarity",
    hero:
      "A polished resume site for UI craft, modern web work, and case studies that tell the story behind the build.",
    cta: "View the work",
  },
  kinetic: {
    eyebrow: "Interface energy, controlled",
    hero:
      "I like interfaces that move with intent: responsive, expressive, fast, and still easy on the eyes.",
    cta: "Enter the build",
  },
  studio: {
    eyebrow: "Thoughtful web work with a human edge",
    hero:
      "Soft visuals, useful systems, and practical frontend work for teams that care how things feel.",
    cta: "Meet Keanu",
  },
};

export function PortfolioShell({ data }: { data: PortfolioData }) {
  const [mode, setMode] = useState<VisualMode>("editorial");
  const [showChooser, setShowChooser] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const saved = window.localStorage.getItem("keanu-visual-mode") as VisualMode | null;
    const seen = window.localStorage.getItem("keanu-mode-chooser-seen");

    queueMicrotask(() => {
      if (saved && modes.some((item) => item.id === saved)) {
        setMode(saved);
      }

      setShowChooser(!seen);
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "kinetic");
    document.body.classList.remove("mode-kinetic", "mode-studio");
    document.body.classList.add(`mode-${mode}`);
  }, [mode]);

  function selectMode(nextMode: VisualMode) {
    setMode(nextMode);
    window.localStorage.setItem("keanu-visual-mode", nextMode);
    window.localStorage.setItem("keanu-mode-chooser-seen", "true");
    setShowChooser(false);
  }

  const featuredProjects = useMemo(
    () => data.projects.filter((project) => project.featured),
    [data.projects],
  );

  return (
    <main className={cn("min-h-screen overflow-hidden", mode === "kinetic" && "bg-slate-950 text-white")}>
      <SiteNav mode={mode} onModeChange={selectMode} />
      <ModeChooser open={showChooser} onSelect={selectMode} onSkip={() => selectMode(mode)} />
      <Hero data={data} mode={mode} reducedMotion={Boolean(reducedMotion)} />
      <WorkSection projects={featuredProjects} mode={mode} />
      <SkillsSection data={data} mode={mode} />
      <TimelineSection data={data} mode={mode} />
      <ProofSection data={data} mode={mode} />
      <ContactSection data={data} mode={mode} />
    </main>
  );
}

function SiteNav({
  mode,
  onModeChange,
}: {
  mode: VisualMode;
  onModeChange: (mode: VisualMode) => void;
}) {
  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4">
      <nav className="glass-panel mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2">
        <a className="flex items-center gap-2 pl-2 font-display text-sm font-bold" href="#home">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--text))] text-[rgb(var(--surface))]">
            K
          </span>
          <span className="hidden sm:inline">Keanu Dane</span>
        </a>
        <div className="hidden items-center gap-1 text-sm text-[rgb(var(--muted))] md:flex">
          {["work", "stack", "story", "proof", "contact"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="rounded-full px-3 py-2 capitalize transition hover:bg-[rgb(var(--surface-strong)/0.7)] hover:text-[rgb(var(--text))]"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button asChild size="icon" variant="secondary">
            <Link href="/admin" aria-label="Open admin">
              <Lock className="h-4 w-4" />
            </Link>
          </Button>
          {modes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`Switch to ${item.label}`}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--surface-strong)/0.7)] hover:text-[rgb(var(--text))]",
                  mode === item.id && "bg-[rgb(var(--text))] text-[rgb(var(--surface))]",
                )}
                onClick={() => onModeChange(item.id)}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

function ModeChooser({
  open,
  onSelect,
  onSkip,
}: {
  open: boolean;
  onSelect: (mode: VisualMode) => void;
  onSkip: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-4xl rounded-[2rem] border border-white/45 bg-white/90 p-5 text-ink shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              First impression
            </p>
            <h2 className="font-display text-3xl font-black tracking-tight md:text-5xl">
              How would you like to meet Keanu?
            </h2>
          </div>
          <button
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={onSkip}
            type="button"
          >
            Skip
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {modes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-900 hover:shadow-xl"
              >
                <Icon className="mb-8 h-6 w-6 text-slate-900 transition group-hover:rotate-6" />
                <h3 className="font-display text-xl font-black">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function Hero({
  data,
  mode,
  reducedMotion,
}: {
  data: PortfolioData;
  mode: VisualMode;
  reducedMotion: boolean;
}) {
  const modeCopy = copy[mode];

  return (
    <section id="home" className="relative flex min-h-screen items-center px-4 pb-16 pt-28">
      <div className="absolute inset-0 -z-10 bg-fine-grid bg-[length:44px_44px]" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn(mode === "kinetic" && "lg:order-2")}
        >
          <p className="mb-5 inline-flex rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface-strong)/0.7)] px-4 py-2 text-sm font-semibold text-[rgb(var(--muted))]">
            {modeCopy.eyebrow}
          </p>
          <h1 className="max-w-4xl text-balance font-display text-5xl font-black tracking-tight md:text-7xl lg:text-8xl">
            {data.profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-xl leading-8 text-[rgb(var(--muted))] md:text-2xl">
            {modeCopy.hero}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#work">
                {modeCopy.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={data.profile.resumeHref} target="_blank">
                Download resume
              </a>
            </Button>
          </div>
        </motion.div>
        <HeroVisual data={data} mode={mode} />
      </div>
    </section>
  );
}

function HeroVisual({ data, mode }: { data: PortfolioData; mode: VisualMode }) {
  if (mode === "kinetic") {
    return (
      <Card className="overflow-hidden bg-slate-950/82 p-4 text-white">
        <div className="rounded-[1.35rem] border border-sky-300/20 bg-slate-900 p-4">
          <div className="mb-8 flex gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-lime-300" />
          </div>
          <p className="font-mono text-sm text-sky-200">portfolio.mode()</p>
          <h2 className="mt-4 font-display text-5xl font-black tracking-tight">
            UI that moves with purpose.
          </h2>
          <div className="mt-10 grid gap-3">
            {["responsive", "cms-backed", "animated", "case-study-ready"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span>{item}</span>
                <Check className="h-4 w-4 text-citrus" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("relative overflow-hidden p-4", mode === "studio" && "rotate-[-1deg]")}>
      <Image
        src={data.profile.avatar.src}
        alt={data.profile.avatar.alt}
        width={760}
        height={900}
        priority
        className="aspect-[4/5] w-full rounded-[1.35rem] object-cover"
      />
      <div className="absolute bottom-7 left-7 right-7 rounded-[1.25rem] border border-white/55 bg-white/78 p-4 text-ink shadow-soft backdrop-blur-xl">
        <p className="text-sm font-semibold text-slate-500">{data.profile.availability}</p>
        <p className="mt-1 font-display text-2xl font-black">{data.profile.role}</p>
      </div>
    </Card>
  );
}

function WorkSection({ projects, mode }: { projects: Project[]; mode: VisualMode }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section id="work" className="section-pad px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Selected work"
          title="Case studies that show the thinking, not just the screenshot."
        />
        <div className={cn("mt-10", mode === "kinetic" ? "overflow-hidden" : "grid gap-5 md:grid-cols-2")}>
          {mode === "kinetic" ? (
            <div ref={emblaRef}>
              <div className="flex gap-5">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} className="min-w-0 flex-[0_0_86%] md:flex-[0_0_52%]" />
                ))}
              </div>
            </div>
          ) : (
            projects.map((project) => <ProjectCard key={project.slug} project={project} />)
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <Card className={cn("group flex min-h-[430px] flex-col justify-between overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-glow", className)}>
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[rgb(var(--accent)/0.12)] px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[rgb(var(--accent))]">
            {project.eyebrow}
          </span>
          {project.status === "anonymized" && (
            <span className="rounded-full border border-[rgb(var(--line))] px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))]">
              Confidential-safe
            </span>
          )}
        </div>
        {project.images[0] ? (
          <Image
            src={project.images[0].src}
            alt={project.images[0].alt}
            width={900}
            height={520}
            className="mb-6 aspect-[16/9] w-full rounded-[1.2rem] object-cover"
          />
        ) : (
          <div className="mb-6 flex aspect-[16/9] items-center justify-center rounded-[1.2rem] border border-[rgb(var(--line))] bg-[rgb(var(--surface)/0.6)]">
            <Layers3 className="h-10 w-10 text-[rgb(var(--accent))]" />
          </div>
        )}
        <h3 className="font-display text-3xl font-black tracking-tight">{project.title}</h3>
        <p className="mt-4 leading-7 text-[rgb(var(--muted))]">{project.summary}</p>
      </div>
      <Button asChild className="mt-8 self-start" variant="secondary">
        <Link href={`/projects/${project.slug}`}>
          Open case study
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}

function SkillsSection({ data }: { data: PortfolioData; mode: VisualMode }) {
  return (
    <section id="stack" className="section-pad px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Stack" title="Tools grouped by the kind of work I want to do more of." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.skills.map((group) => (
            <Card key={group.group} className="transition hover:-translate-y-1">
              <h3 className="font-display text-2xl font-black">{group.group}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-full bg-[rgb(var(--surface)/0.75)] px-3 py-1 text-sm font-semibold text-[rgb(var(--muted))]">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ data }: { data: PortfolioData; mode: VisualMode }) {
  return (
    <section id="story" className="section-pad px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Story" title="A practical path through school, internships, and real work." />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {data.experience.map((item) => (
            <Card key={`${item.title}-${item.date}`}>
              <BriefcaseBusiness className="mb-6 h-6 w-6 text-[rgb(var(--accent))]" />
              <p className="text-sm font-semibold text-[rgb(var(--muted))]">{item.date}</p>
              <h3 className="mt-3 font-display text-2xl font-black">{item.title}</h3>
              <p className="mt-1 font-semibold">{item.organization}</p>
              <p className="mt-4 leading-7 text-[rgb(var(--muted))]">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofSection({ data }: { data: PortfolioData; mode: VisualMode }) {
  return (
    <section id="proof" className="section-pad px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Proof" title="Certificates, awards, and signals that support the story." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="grid gap-4">
            {data.achievements.map((item) => (
              <Card key={item.title} className="p-5">
                <p className="text-sm font-semibold text-[rgb(var(--muted))]">{item.date}</p>
                <h3 className="mt-2 font-display text-2xl font-black">{item.title}</h3>
                <p className="mt-2 text-[rgb(var(--muted))]">{item.description}</p>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.certificates.slice(0, 4).map((cert) => (
              <Card key={cert.title} className="overflow-hidden p-2">
                <Image
                  src={cert.image.src}
                  alt={cert.image.alt}
                  width={500}
                  height={360}
                  className="aspect-[4/3] rounded-[1rem] object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-bold">{cert.title}</h3>
                  <p className="text-xs text-[rgb(var(--muted))]">{cert.issuer}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: PortfolioData; mode: VisualMode }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = new FormData(event.currentTarget);
    const currentTarget = event.currentTarget;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form)),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Contact request failed.");
      }

      setState("sent");
      setToast({ ok: true, message: "Message sent. I will see it in the CMS." });
      currentTarget.reset();
    } catch {
      setState("error");
      setToast({ ok: false, message: "Could not send. Please email me directly." });
    }
  }

  return (
    <section id="contact" className="section-pad px-4 pb-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading eyebrow="Contact" title="A simple way to start the conversation." />
          <p className="mt-6 max-w-xl leading-8 text-[rgb(var(--muted))]">
            {data.profile.bio}
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild variant="secondary" size="icon">
              <a href="https://github.com/Keanu-Tibule" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="icon">
              <a href="https://www.linkedin.com/in/keanu-dane-tibule-4b4009281/" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="icon">
              <a href={`mailto:${data.profile.email}`} aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <Card>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <Field label="Subject" name="subject" required />
            <label className="grid gap-2 text-sm font-semibold">
              Message
              <textarea name="message" required rows={6} className="rounded-[1.25rem] border border-[rgb(var(--line))] bg-[rgb(var(--surface-strong)/0.82)] px-4 py-3 font-normal outline-none transition focus:border-[rgb(var(--accent))]" />
            </label>
            <Button type="submit" disabled={state === "sending"}>
              {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
              {state === "sending" ? "Sending..." : "Send message"}
              {state !== "sending" && <Send className="h-4 w-4" />}
            </Button>
          </form>
        </Card>
      </div>
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-soft backdrop-blur-xl ${
            toast.ok
              ? "border-emerald-300 bg-emerald-50/95 text-emerald-800"
              : "border-red-300 bg-red-50/95 text-red-800"
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}
      <footer className="mx-auto mt-16 max-w-6xl border-t border-[rgb(var(--line))] pt-6 text-sm text-[rgb(var(--muted))]">
        Built as a living resume system. Free-tier friendly by design.
      </footer>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input name={name} type={type} required={required} className="h-12 rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface-strong)/0.82)] px-4 font-normal outline-none transition focus:border-[rgb(var(--accent))]" />
    </label>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.32em] text-[rgb(var(--accent))]">
        {eyebrow}
      </p>
      <h2 className="text-balance font-display text-4xl font-black tracking-tight md:text-6xl">
        {title}
      </h2>
    </div>
  );
}
