import { ArrowLeft, Lock, LogOut, Plus, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";

import {
  createCertificate,
  createProjectMedia,
  createSkill,
  createTimelineItem,
  deleteCmsRecord,
  signIn,
  signOut,
  updateCertificate,
  updateProjectMedia,
  updateSkill,
  updateTimelineItem,
  upsertProfile,
  upsertProject,
} from "@/app/admin/actions";
import { AdminActionForm, PendingButton } from "@/app/admin/form-controls";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await getSupabaseServerClient();
  const { data } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };
  const user = data.user;
  const cms = user && supabase ? await loadCmsData(supabase) : null;

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.32em] text-[rgb(var(--accent))]">
              CMS
            </p>
            <h1 className="font-display text-5xl font-black tracking-tight">
              Portfolio Admin
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                View portfolio
              </Link>
            </Button>
            {user && (
              <form action={signOut}>
                <PendingButton pendingLabel="Signing out..." variant="secondary">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </PendingButton>
              </form>
            )}
          </div>
        </div>

        {params.sent && <Notice>Magic link sent. Check your inbox.</Notice>}
        {params.updated && <Notice>Saved {String(params.updated)}.</Notice>}
        {params.deleted && <Notice>Deleted record.</Notice>}
        {params.error === "not-allowed" && (
          <Notice tone="danger">That email is not in ADMIN_EMAILS.</Notice>
        )}
        {params.error === "rate-limit" && (
          <Notice tone="danger">
            Too many magic links were requested. Wait a minute or two, then try again.
          </Notice>
        )}
        {params.error === "magic-link" && (
          <Notice tone="danger">
            Supabase could not send the magic link. Check Auth settings and try again.
          </Notice>
        )}
        {params.error === "auth-callback" && (
          <Notice tone="danger">
            The login link could not be verified. Request a fresh magic link.
          </Notice>
        )}

        {!supabase && (
          <Card className="mb-6 border-amber-300/70">
            <h2 className="font-display text-2xl font-black">
              Supabase env vars are not configured
            </h2>
            <p className="mt-3 text-[rgb(var(--muted))]">
              Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
              locally and in Vercel to enable login and CMS writes.
            </p>
          </Card>
        )}

        {!user ? (
          <Card className="max-w-xl">
            <Lock className="mb-6 h-8 w-8 text-[rgb(var(--accent))]" />
            <h2 className="font-display text-3xl font-black">Admin login</h2>
            <p className="mt-3 text-[rgb(var(--muted))]">
              Sign in with the allowlisted owner email configured in Supabase.
            </p>
            <form action={signIn} className="mt-8 grid gap-4">
              <AdminField label="Email" name="email" type="email" required />
              <PendingButton disabled={!supabase} pendingLabel="Sending magic link...">
                Send magic link
              </PendingButton>
            </form>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card>
              <ShieldCheck className="mb-6 h-8 w-8 text-[rgb(var(--accent))]" />
              <h2 className="font-display text-3xl font-black">Signed in</h2>
              <p className="mt-3 break-all text-[rgb(var(--muted))]">{user.email}</p>
            </Card>

            <CmsSection title="Profile">
              <AdminActionForm action={upsertProfile} className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Full name" name="full_name" defaultValue={cms?.profile?.full_name} required />
                  <AdminField label="Role" name="role" defaultValue={cms?.profile?.role} required />
                </div>
                <AdminField label="Headline" name="headline" defaultValue={cms?.profile?.headline} />
                <label className="grid gap-2 text-sm font-semibold">
                  Bio
                  <textarea name="bio" rows={4} defaultValue={cms?.profile?.bio ?? ""} className="admin-input rounded-[1.25rem] py-3" />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Location" name="location_label" defaultValue={cms?.profile?.location_label} />
                  <AdminField label="Email" name="email" type="email" defaultValue={cms?.profile?.email} />
                  <AdminField label="Phone" name="phone" defaultValue={cms?.profile?.phone} />
                  <AdminField label="Resume URL" name="resume_url" defaultValue={cms?.profile?.resume_url} />
                  <AdminField label="Avatar URL" name="avatar_url" defaultValue={cms?.profile?.avatar_url} />
                </div>
                <PendingButton pendingLabel="Saving profile...">Save profile</PendingButton>
              </AdminActionForm>
            </CmsSection>

            <CmsSection title="Projects">
              <AdminActionForm action={upsertProject} className="grid gap-4" resetOnSuccess>
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Title" name="title" required />
                  <AdminField label="Slug" name="slug" required />
                </div>
                <AdminField label="Summary" name="summary" required />
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Role" name="role" />
                  <AdminField label="Stack, comma-separated" name="stack" />
                  <AdminField label="Live URL" name="live_url" />
                  <AdminField label="Repo URL" name="repo_url" />
                </div>
                <label className="grid gap-2 text-sm font-semibold">
                  Description
                  <textarea name="description" rows={5} className="admin-input rounded-[1.25rem] py-3" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Outcomes, one per line
                  <textarea name="outcomes" rows={4} className="admin-input rounded-[1.25rem] py-3" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Confidentiality note
                  <textarea name="confidentiality_note" rows={3} className="admin-input rounded-[1.25rem] py-3" />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold">
                    Status
                    <select name="status" className="admin-input">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="anonymized">Anonymized</option>
                    </select>
                  </label>
                  <Checkbox name="featured" label="Featured on homepage" />
                </div>
                <PendingButton pendingLabel="Saving project...">
                  <Plus className="h-4 w-4" />
                  Save project
                </PendingButton>
              </AdminActionForm>
              <AdminList items={cms?.projects} table="projects" labelKey="title" />
              <ProjectEditors projects={cms?.projects ?? []} />
            </CmsSection>

            <CmsSection title="Project media">
              <AdminActionForm action={createProjectMedia} className="grid gap-4 md:grid-cols-3" resetOnSuccess>
                <AdminField label="Project slug" name="project_slug" required />
                <AdminField label="Image URL" name="url" required />
                <AdminField label="Alt text" name="alt" required />
                <PendingButton className="md:col-span-3" pendingLabel="Adding media...">
                  Add media URL
                </PendingButton>
              </AdminActionForm>
              <AdminList items={cms?.projectMedia} table="project_media" labelKey="alt" />
              <ProjectMediaEditors items={cms?.projectMedia ?? []} />
            </CmsSection>

            <CmsSection title="Timeline">
              <AdminActionForm action={createTimelineItem} className="grid gap-4" resetOnSuccess>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="grid gap-2 text-sm font-semibold">
                    Kind
                    <select name="kind" className="admin-input">
                      <option value="experience">Experience</option>
                      <option value="education">Education</option>
                      <option value="achievement">Achievement</option>
                    </select>
                  </label>
                  <AdminField label="Title" name="title" required />
                  <AdminField label="Organization" name="organization" required />
                  <AdminField label="Date label" name="date_label" required />
                  <AdminField label="Location" name="location_label" />
                  <AdminField label="Link" name="href" />
                </div>
                <label className="grid gap-2 text-sm font-semibold">
                  Description
                  <textarea name="description" rows={4} required className="admin-input rounded-[1.25rem] py-3" />
                </label>
                <Checkbox name="published" label="Published" defaultChecked />
                <PendingButton pendingLabel="Adding timeline item...">
                  Add timeline item
                </PendingButton>
              </AdminActionForm>
              <AdminList items={cms?.timeline} table="timeline_items" labelKey="title" />
              <TimelineEditors items={cms?.timeline ?? []} />
            </CmsSection>

            <div className="grid gap-6 lg:grid-cols-2">
              <CmsSection title="Skills">
                <AdminActionForm action={createSkill} className="grid gap-4" resetOnSuccess>
                  <AdminField label="Group" name="group_name" required />
                  <AdminField label="Skills, comma-separated" name="labels" required />
                  <PendingButton pendingLabel="Adding skills...">Add skills</PendingButton>
                </AdminActionForm>
                <AdminList items={cms?.skills} table="skills" labelKey="label" />
                <SkillEditors items={cms?.skills ?? []} />
              </CmsSection>

              <CmsSection title="Certificates">
                <AdminActionForm action={createCertificate} className="grid gap-4" resetOnSuccess>
                  <AdminField label="Title" name="title" required />
                  <AdminField label="Issuer" name="issuer" />
                  <AdminField label="Year" name="year_label" />
                  <AdminField label="Image URL" name="image_url" />
                  <AdminField label="Alt text" name="alt" />
                  <Checkbox name="published" label="Published" defaultChecked />
                  <PendingButton pendingLabel="Adding certificate...">
                    Add certificate
                  </PendingButton>
                </AdminActionForm>
                <AdminList items={cms?.certificates} table="certificates" labelKey="title" />
                <CertificateEditors items={cms?.certificates ?? []} />
              </CmsSection>
            </div>

            <CmsSection title="Contact messages">
              <div className="grid gap-3">
                {(cms?.messages ?? []).length === 0 && (
                  <p className="text-sm text-[rgb(var(--muted))]">No contact messages yet.</p>
                )}
                {(cms?.messages ?? []).map((message) => (
                  <div key={message.id} className="rounded-2xl border border-[rgb(var(--line))] p-4">
                    <p className="font-bold">{message.subject}</p>
                    <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                      {message.name} - {message.email}
                    </p>
                    <p className="mt-3 text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
            </CmsSection>
          </div>
        )}
      </div>
    </main>
  );
}

async function loadCmsData(supabase: NonNullable<Awaited<ReturnType<typeof getSupabaseServerClient>>>) {
  const [profile, projects, projectMedia, timeline, skills, certificates, messages] = await Promise.all([
    supabase.from("profile").select("*").maybeSingle(),
    supabase
      .from("projects")
      .select("id,title,slug,eyebrow,summary,description,role,stack,outcomes,status,featured,live_url,repo_url,confidentiality_note")
      .order("created_at", { ascending: false }),
    supabase
      .from("project_media")
      .select("id,project_id,alt,url,sort_order")
      .order("created_at", { ascending: false }),
    supabase
      .from("timeline_items")
      .select("id,kind,title,organization,date_label,location_label,description,href,published")
      .order("created_at", { ascending: false }),
    supabase
      .from("skills")
      .select("id,group_name,label,published")
      .order("group_name", { ascending: true }),
    supabase
      .from("certificates")
      .select("id,title,issuer,year_label,image_url,alt,published")
      .order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  return {
    profile: profile.data,
    projects: projects.data ?? [],
    projectMedia: projectMedia.data ?? [],
    timeline: timeline.data ?? [],
    skills: skills.data ?? [],
    certificates: certificates.data ?? [],
    messages: messages.data ?? [],
  };
}

type AdminRow = Record<string, unknown> & { id: string };

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asTextList(value: unknown) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function ProjectEditors({ projects }: { projects: AdminRow[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3">
      <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
        Edit existing projects
      </h3>
      {projects.map((project) => (
        <details key={project.id} className="rounded-2xl border border-[rgb(var(--line))] p-4">
          <summary className="cursor-pointer font-bold">{asText(project.title) || "Untitled project"}</summary>
          <AdminActionForm action={upsertProject} className="mt-5 grid gap-4">
            <input type="hidden" name="id" value={project.id} />
            <input type="hidden" name="old_slug" value={asText(project.slug)} />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Title" name="title" defaultValue={asText(project.title)} required />
              <AdminField label="Slug" name="slug" defaultValue={asText(project.slug)} required />
            </div>
            <AdminField label="Eyebrow" name="eyebrow" defaultValue={asText(project.eyebrow)} />
            <AdminField label="Summary" name="summary" defaultValue={asText(project.summary)} required />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Role" name="role" defaultValue={asText(project.role)} />
              <AdminField label="Stack, comma-separated" name="stack" defaultValue={asTextList(project.stack).join(", ")} />
              <AdminField label="Live URL" name="live_url" defaultValue={asText(project.live_url)} />
              <AdminField label="Repo URL" name="repo_url" defaultValue={asText(project.repo_url)} />
            </div>
            <TextareaField label="Description" name="description" defaultValue={asText(project.description)} rows={5} />
            <TextareaField label="Outcomes, one per line" name="outcomes" defaultValue={asTextList(project.outcomes).join("\n")} rows={4} />
            <TextareaField label="Confidentiality note" name="confidentiality_note" defaultValue={asText(project.confidentiality_note)} rows={3} />
            <div className="grid gap-4 md:grid-cols-2">
              <StatusSelect defaultValue={asText(project.status)} />
              <Checkbox name="featured" label="Featured on homepage" defaultChecked={project.featured === true} />
            </div>
            <PendingButton pendingLabel="Saving project...">Save project edits</PendingButton>
          </AdminActionForm>
        </details>
      ))}
    </div>
  );
}

function ProjectMediaEditors({ items }: { items: AdminRow[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3">
      <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
        Edit existing media
      </h3>
      {items.map((item) => (
        <details key={item.id} className="rounded-2xl border border-[rgb(var(--line))] p-4">
          <summary className="cursor-pointer font-bold">{asText(item.alt) || "Untitled media"}</summary>
          <AdminActionForm action={updateProjectMedia} className="mt-5 grid gap-4">
            <input type="hidden" name="id" value={item.id} />
            <AdminField label="Image URL" name="url" defaultValue={asText(item.url)} required />
            <AdminField label="Alt text" name="alt" defaultValue={asText(item.alt)} required />
            <PendingButton pendingLabel="Saving media...">Save media edits</PendingButton>
          </AdminActionForm>
        </details>
      ))}
    </div>
  );
}

function TimelineEditors({ items }: { items: AdminRow[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3">
      <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
        Edit existing timeline items
      </h3>
      {items.map((item) => (
        <details key={item.id} className="rounded-2xl border border-[rgb(var(--line))] p-4">
          <summary className="cursor-pointer font-bold">{asText(item.title) || "Untitled timeline item"}</summary>
          <AdminActionForm action={updateTimelineItem} className="mt-5 grid gap-4">
            <input type="hidden" name="id" value={item.id} />
            <div className="grid gap-4 md:grid-cols-3">
              <KindSelect defaultValue={asText(item.kind)} />
              <AdminField label="Title" name="title" defaultValue={asText(item.title)} required />
              <AdminField label="Organization" name="organization" defaultValue={asText(item.organization)} required />
              <AdminField label="Date label" name="date_label" defaultValue={asText(item.date_label)} required />
              <AdminField label="Location" name="location_label" defaultValue={asText(item.location_label)} />
              <AdminField label="Link" name="href" defaultValue={asText(item.href)} />
            </div>
            <TextareaField label="Description" name="description" defaultValue={asText(item.description)} rows={4} required />
            <Checkbox name="published" label="Published" defaultChecked={item.published === true} />
            <PendingButton pendingLabel="Saving timeline item...">Save timeline edits</PendingButton>
          </AdminActionForm>
        </details>
      ))}
    </div>
  );
}

function SkillEditors({ items }: { items: AdminRow[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3">
      <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
        Edit existing skills
      </h3>
      {items.map((item) => (
        <details key={item.id} className="rounded-2xl border border-[rgb(var(--line))] p-4">
          <summary className="cursor-pointer font-bold">{asText(item.label) || "Untitled skill"}</summary>
          <AdminActionForm action={updateSkill} className="mt-5 grid gap-4">
            <input type="hidden" name="id" value={item.id} />
            <AdminField label="Group" name="group_name" defaultValue={asText(item.group_name)} required />
            <AdminField label="Skill" name="label" defaultValue={asText(item.label)} required />
            <Checkbox name="published" label="Published" defaultChecked={item.published === true} />
            <PendingButton pendingLabel="Saving skill...">Save skill edits</PendingButton>
          </AdminActionForm>
        </details>
      ))}
    </div>
  );
}

function CertificateEditors({ items }: { items: AdminRow[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3">
      <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
        Edit existing certificates
      </h3>
      {items.map((item) => (
        <details key={item.id} className="rounded-2xl border border-[rgb(var(--line))] p-4">
          <summary className="cursor-pointer font-bold">{asText(item.title) || "Untitled certificate"}</summary>
          <AdminActionForm action={updateCertificate} className="mt-5 grid gap-4">
            <input type="hidden" name="id" value={item.id} />
            <AdminField label="Title" name="title" defaultValue={asText(item.title)} required />
            <AdminField label="Issuer" name="issuer" defaultValue={asText(item.issuer)} />
            <AdminField label="Year" name="year_label" defaultValue={asText(item.year_label)} />
            <AdminField label="Image URL" name="image_url" defaultValue={asText(item.image_url)} />
            <AdminField label="Alt text" name="alt" defaultValue={asText(item.alt)} />
            <Checkbox name="published" label="Published" defaultChecked={item.published === true} />
            <PendingButton pendingLabel="Saving certificate...">Save certificate edits</PendingButton>
          </AdminActionForm>
        </details>
      ))}
    </div>
  );
}

function CmsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="mb-6 font-display text-3xl font-black">{title}</h2>
      <div className="grid gap-6">{children}</div>
    </Card>
  );
}

function Notice({
  children,
  tone = "success",
}: {
  children: React.ReactNode;
  tone?: "success" | "danger";
}) {
  return (
    <div
      className={`mb-4 rounded-full border px-4 py-3 text-sm font-semibold ${
        tone === "danger" ? "border-red-300 text-red-700" : "border-emerald-300 text-emerald-700"
      }`}
    >
      {children}
    </div>
  );
}

function AdminList({
  items = [],
  table,
  labelKey,
}: {
  items?: AdminRow[];
  table: string;
  labelKey: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-[rgb(var(--muted))]">No records yet.</p>;
  }

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-between gap-3 rounded-2xl border border-[rgb(var(--line))] p-3 sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-bold">{String(item[labelKey] ?? "Untitled")}</p>
            {Boolean(item.slug) && <p className="text-sm text-[rgb(var(--muted))]">/{String(item.slug)}</p>}
            {Boolean(item.group_name) && <p className="text-sm text-[rgb(var(--muted))]">{String(item.group_name)}</p>}
          </div>
          <AdminActionForm action={deleteCmsRecord}>
            <input type="hidden" name="table" value={table} />
            <input type="hidden" name="id" value={item.id} />
            <PendingButton pendingLabel="Deleting..." variant="secondary">
              <Trash2 className="h-4 w-4" />
              Delete
            </PendingButton>
          </AdminActionForm>
        </div>
      ))}
    </div>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-full border border-[rgb(var(--line))] px-4 text-sm font-semibold">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

function KindSelect({ defaultValue = "experience" }: { defaultValue?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      Kind
      <select name="kind" defaultValue={defaultValue} className="admin-input">
        <option value="experience">Experience</option>
        <option value="education">Education</option>
        <option value="achievement">Achievement</option>
      </select>
    </label>
  );
}

function StatusSelect({ defaultValue = "draft" }: { defaultValue?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      Status
      <select name="status" defaultValue={defaultValue} className="admin-input">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="anonymized">Anonymized</option>
      </select>
    </label>
  );
}

function TextareaField({
  label,
  name,
  rows,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  rows: number;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <textarea
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="admin-input rounded-[1.25rem] py-3"
      />
    </label>
  );
}

function AdminField({
  label,
  name,
  required,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="admin-input"
      />
    </label>
  );
}
