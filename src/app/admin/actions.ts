"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AdminActionState = {
  ok: boolean;
  message: string;
  nonce: number;
};

function success(message: string): AdminActionState {
  return { ok: true, message, nonce: Date.now() };
}

function failure(error: unknown): AdminActionState {
  return {
    ok: false,
    message: error instanceof Error ? error.message : "Something went wrong.",
    nonce: Date.now(),
  };
}

async function getBaseUrl() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

async function requireSupabase() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

function listFromText(value: FormDataEntryValue | null, separator: "," | "\n") {
  return String(value ?? "")
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanSlug(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const allowlist = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim().toLowerCase());

  if (allowlist?.length && !allowlist.includes(email.toLowerCase())) {
    redirect("/admin?error=not-allowed");
  }

  const supabase = await requireSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${await getBaseUrl()}/auth/callback?next=/admin`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("rate limit")) {
      redirect("/admin?error=rate-limit");
    }

    redirect("/admin?error=magic-link");
  }

  redirect("/admin?sent=1");
}

function getAdminAllowlist() {
  return process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim().toLowerCase());
}

function assertAdminEmail(email: string) {
  const allowlist = getAdminAllowlist();

  if (allowlist?.length && !allowlist.includes(email.toLowerCase())) {
    throw new Error("That email is not in ADMIN_EMAILS.");
  }
}

export async function requestAdminOtp(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const email = String(formData.get("email") ?? "").trim();

    if (!email || !email.includes("@")) {
      throw new Error("Enter a valid admin email.");
    }

    assertAdminEmail(email);

    const supabase = await requireSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        throw new Error("Too many codes were requested. Wait a minute or two, then try again.");
      }

      throw new Error(error.message);
    }

    return success("Code sent. Check your email and enter it below.");
  } catch (error) {
    return failure(error);
  }
}

export async function verifyAdminOtp(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const email = String(formData.get("email") ?? "").trim();
    const token = String(formData.get("token") ?? "").trim().replace(/\s+/g, "");

    if (!email || !token) {
      throw new Error("Email and code are required.");
    }

    assertAdminEmail(email);

    const supabase = await requireSupabase();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    return failure(error);
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await requireSupabase();
  await supabase.auth.signOut();
  redirect("/admin");
}

export async function upsertProject(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const id = String(formData.get("id") ?? "").trim();
    const oldSlug = String(formData.get("old_slug") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const status = String(formData.get("status") ?? "draft");

    if (!title || !slug || !summary) {
      throw new Error("Title, slug, and summary are required.");
    }

    const payload = {
      title,
      slug,
      summary,
      eyebrow: String(formData.get("eyebrow") ?? "").trim() || null,
      description: String(formData.get("description") ?? summary),
      role: String(formData.get("role") ?? "Contributor"),
      status,
      featured: formData.get("featured") === "on",
      stack: listFromText(formData.get("stack"), ","),
      outcomes: listFromText(formData.get("outcomes"), "\n"),
      live_url: String(formData.get("live_url") ?? "").trim() || null,
      repo_url: String(formData.get("repo_url") ?? "").trim() || null,
      confidentiality_note: String(formData.get("confidentiality_note") ?? "").trim() || null,
    };

    const { error } = id
      ? await supabase.from("projects").update(payload).eq("id", id)
      : await supabase.from("projects").upsert(payload);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/projects/${slug}`);
    if (oldSlug && oldSlug !== slug) {
      revalidatePath(`/projects/${oldSlug}`);
    }
    return success("Project saved.");
  } catch (error) {
    return failure(error);
  }
}

export async function upsertProfile(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const fullName = String(formData.get("full_name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();

    if (!fullName || !role) {
      throw new Error("Name and role are required.");
    }

    const { error } = await supabase.from("profile").upsert({
      id: true,
      full_name: fullName,
      role,
      headline: String(formData.get("headline") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      location_label: String(formData.get("location_label") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      resume_url: String(formData.get("resume_url") ?? "").trim() || null,
      avatar_url: String(formData.get("avatar_url") ?? "").trim() || null,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Profile saved.");
  } catch (error) {
    return failure(error);
  }
}

export async function createTimelineItem(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const title = String(formData.get("title") ?? "").trim();
    const organization = String(formData.get("organization") ?? "").trim();
    const dateLabel = String(formData.get("date_label") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!title || !organization || !dateLabel || !description) {
      throw new Error("Timeline title, organization, date, and description are required.");
    }

    const { error } = await supabase.from("timeline_items").insert({
      kind: String(formData.get("kind") ?? "experience"),
      title,
      organization,
      date_label: dateLabel,
      location_label: String(formData.get("location_label") ?? "").trim() || null,
      description,
      href: String(formData.get("href") ?? "").trim() || null,
      published: formData.get("published") === "on",
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Timeline item added.");
  } catch (error) {
    return failure(error);
  }
}

export async function updateTimelineItem(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const organization = String(formData.get("organization") ?? "").trim();
    const dateLabel = String(formData.get("date_label") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!id || !title || !organization || !dateLabel || !description) {
      throw new Error("Timeline id, title, organization, date, and description are required.");
    }

    const { error } = await supabase
      .from("timeline_items")
      .update({
        kind: String(formData.get("kind") ?? "experience"),
        title,
        organization,
        date_label: dateLabel,
        location_label: String(formData.get("location_label") ?? "").trim() || null,
        description,
        href: String(formData.get("href") ?? "").trim() || null,
        published: formData.get("published") === "on",
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Timeline item saved.");
  } catch (error) {
    return failure(error);
  }
}

export async function createSkill(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const groupName = String(formData.get("group_name") ?? "").trim();
    const labels = listFromText(formData.get("labels"), ",");

    if (!groupName || labels.length === 0) {
      throw new Error("Skill group and at least one skill are required.");
    }

    const { error } = await supabase
      .from("skills")
      .insert(labels.map((label) => ({ group_name: groupName, label })));

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Skills added.");
  } catch (error) {
    return failure(error);
  }
}

export async function updateSkill(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const id = String(formData.get("id") ?? "").trim();
    const groupName = String(formData.get("group_name") ?? "").trim();
    const label = String(formData.get("label") ?? "").trim();

    if (!id || !groupName || !label) {
      throw new Error("Skill id, group, and label are required.");
    }

    const { error } = await supabase
      .from("skills")
      .update({
        group_name: groupName,
        label,
        published: formData.get("published") === "on",
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Skill saved.");
  } catch (error) {
    return failure(error);
  }
}

export async function createCertificate(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      throw new Error("Certificate title is required.");
    }

    const { error } = await supabase.from("certificates").insert({
      title,
      issuer: String(formData.get("issuer") ?? "").trim() || null,
      year_label: String(formData.get("year_label") ?? "").trim() || null,
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      alt: String(formData.get("alt") ?? "").trim() || title,
      published: formData.get("published") === "on",
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Certificate added.");
  } catch (error) {
    return failure(error);
  }
}

export async function updateCertificate(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();

    if (!id || !title) {
      throw new Error("Certificate id and title are required.");
    }

    const { error } = await supabase
      .from("certificates")
      .update({
        title,
        issuer: String(formData.get("issuer") ?? "").trim() || null,
        year_label: String(formData.get("year_label") ?? "").trim() || null,
        image_url: String(formData.get("image_url") ?? "").trim() || null,
        alt: String(formData.get("alt") ?? "").trim() || title,
        published: formData.get("published") === "on",
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Certificate saved.");
  } catch (error) {
    return failure(error);
  }
}

export async function createProjectMedia(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const slug = cleanSlug(formData.get("project_slug"));
    const url = String(formData.get("url") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();

    if (!slug || !url || !alt) {
      throw new Error("Project slug, media URL, and alt text are required.");
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .single();

    if (projectError) {
      throw new Error(projectError.message);
    }

    const { error } = await supabase.from("project_media").insert({
      project_id: project.id,
      url,
      alt,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/projects/${slug}`);
    return success("Project media added.");
  } catch (error) {
    return failure(error);
  }
}

export async function updateProjectMedia(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const id = String(formData.get("id") ?? "").trim();
    const url = String(formData.get("url") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();

    if (!id || !url || !alt) {
      throw new Error("Media id, URL, and alt text are required.");
    }

    const { error } = await supabase
      .from("project_media")
      .update({ url, alt })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Project media saved.");
  } catch (error) {
    return failure(error);
  }
}

export async function deleteCmsRecord(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireSupabase();
    const table = String(formData.get("table") ?? "");
    const id = String(formData.get("id") ?? "");

    const allowedTables = ["projects", "timeline_items", "skills", "certificates", "project_media"] as const;

    if (!allowedTables.includes(table as (typeof allowedTables)[number]) || !id) {
      throw new Error("Invalid delete request.");
    }

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return success("Record deleted.");
  } catch (error) {
    return failure(error);
  }
}
