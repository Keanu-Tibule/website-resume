import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fallbackPortfolioData, getProject } from "@/lib/portfolio-data";

export async function generateStaticParams() {
  return fallbackPortfolioData.projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Button asChild variant="secondary">
          <Link href="/#work">
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
        </Button>
        <section className="py-14">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.32em] text-[rgb(var(--accent))]">
            {project.eyebrow}
          </p>
          <h1 className="text-balance font-display text-5xl font-black tracking-tight md:text-7xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-[rgb(var(--muted))]">
            {project.summary}
          </p>
        </section>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <h2 className="font-display text-3xl font-black">Case study</h2>
            <p className="mt-5 leading-8 text-[rgb(var(--muted))]">
              {project.description}
            </p>
            <div className="mt-8 grid gap-3">
              {project.outcomes.map((outcome) => (
                <div
                  key={outcome}
                  className="rounded-2xl border border-[rgb(var(--line))] p-4 font-semibold"
                >
                  {outcome}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-2xl font-black">Role</h2>
            <p className="mt-3 text-[rgb(var(--muted))]">{project.role}</p>
            <h2 className="mt-8 font-display text-2xl font-black">Stack</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[rgb(var(--line))] px-3 py-1 text-sm font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 grid gap-3">
              {project.links.map((link) => (
                <Button asChild key={link.href} variant="secondary">
                  <a href={link.href} target={link.href.startsWith("/") ? undefined : "_blank"}>
                    {link.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </Card>
        </div>
        {project.images.length > 0 && (
          <section className="grid gap-5 py-12 md:grid-cols-2">
            {project.images.map((image) => (
              <Image
                key={image.alt}
                src={image.src}
                alt={image.alt}
                width={1000}
                height={640}
                className="rounded-[1.75rem] border border-[rgb(var(--line))] object-cover shadow-soft"
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
