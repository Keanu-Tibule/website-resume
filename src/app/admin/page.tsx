import { Lock, LogOut, Plus, ShieldCheck, Trash2 } from "lucide-react";

import {
  createCertificate,
  createProjectMedia,
  createSkill,
  createTimelineItem,
  deleteCmsRecord,
  signIn,
  signOut,
  upsertProfile,
  upsertProject,
} from "@/app/admin/actions";
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
          {user && (
            <form action={signOut}>
              <Button variant="secondary">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          )}
        </div>

        {params.sent && <Notice>Magic link sent. Check your inbox.</Notice>}
        {params.updated && <Notice>Saved {String(params.updated)}.</Notice>}
        {params.deleted && <Notice>Deleted record.</Notice>}
        {params.error === "not-allowed" && (
          <Notice tone="danger">That email is not in ADMIN_EMAILS.</Notice>
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
              <Button disabled={!supabase}>Send magic link</Button>
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
              <form action={upsertProfile} className="grid gap-4">
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
                <Button>Save profile</Button>
              </form>
            </CmsSection>

            <CmsSection title="Projects">
              <form action={upsertProject} className="grid gap-4">
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
                <Button>
                  <Plus className="h-4 w-4" />
                  Save project
                </Button>
              </form>
              <AdminList items={cms?.projects} table="projects" labelKey="title" />
            </CmsSection>

            <CmsSection title="Project media">
              <form action={createProjectMedia} className="grid gap-4 md:grid-cols-3">
                <AdminField label="Project slug" name="project_slug" required />
                <AdminField label="Image URL" name="url" required />
                <AdminField label="Alt text" name="alt" required />
                <Button className="md:col-span-3">Add media URL</Button>
              </form>
              <AdminList items={cms?.projectMedia} table="project_media" labelKey="alt" />
            </CmsSection>

            <CmsSection title="Timeline">
              <form action={createTimelineItem} className="grid gap-4">
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
                <Button>Add timeline item</Button>
              </form>
              <AdminList items={cms?.timeline} table="timeline_items" labelKey="title" />
            </CmsSection>

            <div className="grid gap-6 lg:grid-cols-2">
              <CmsSection title="Skills">
                <form action={createSkill} className="grid gap-4">
                  <AdminField label="Group" name="group_name" required />
                  <AdminField label="Skills, comma-separated" name="labels" required />
                  <Button>Add skills</Button>
                </form>
                <AdminList items={cms?.skills} table="skills" labelKey="label" />
              </CmsSection>

              <CmsSection title="Certificates">
                <form action={createCertificate} className="grid gap-4">
                  <AdminField label="Title" name="title" required />
                  <AdminField label="Issuer" name="issuer" />
                  <AdminField label="Year" name="year_label" />
                  <AdminField label="Image URL" name="image_url" />
                  <AdminField label="Alt text" name="alt" />
                  <Checkbox name="published" label="Published" defaultChecked />
                  <Button>Add certificate</Button>
                </form>
                <AdminList items={cms?.certificates} table="certificates" labelKey="title" />
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
                      {message.name} · {message.email}
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
    supabase.from("projects").select("id,title,slug,status").order("created_at", { ascending: false }),
    supabase.from("project_media").select("id,alt,url").order("created_at", { ascending: false }),
    supabase.from("timeline_items").select("id,title,kind").order("created_at", { ascending: false }),
    supabase.from("skills").select("id,group_name,label").order("group_name", { ascending: true }),
    supabase.from("certificates").select("id,title,issuer").order("created_at", { ascending: false }),
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
  items?: Record<string, string>[];
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
            <p className="font-bold">{item[labelKey]}</p>
            {item.slug && <p className="text-sm text-[rgb(var(--muted))]">/{item.slug}</p>}
            {item.group_name && <p className="text-sm text-[rgb(var(--muted))]">{item.group_name}</p>}
          </div>
          <form action={deleteCmsRecord}>
            <input type="hidden" name="table" value={table} />
            <input type="hidden" name="id" value={item.id} />
            <Button variant="secondary">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </form>
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
