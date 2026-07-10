"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  clearAdminAuthCookies,
  createOtpCode,
  requireAdminSession,
  setAdminOtpChallenge,
  verifyAdminOtpChallenge,
} from "@/lib/admin-auth";
import { sendAdminOtpEmail } from "@/lib/email/provider";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

const portfolioAssetsBucket = "portfolio-assets";
const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const pdfMimeTypes = ["application/pdf"];
const maxImageBytes = 8 * 1024 * 1024;
const maxPdfBytes = 12 * 1024 * 1024;

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

async function requireAdminSupabase() {
  await requireAdminSession();

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role is not configured.");
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

function getUploadFile(formData: FormData, name: string) {
  const value = formData.get(name);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getSafeExtension(file: File) {
  const fallback = file.type === "application/pdf" ? "pdf" : "bin";
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");

  return extension || fallback;
}

function assertAllowedFile(file: File, allowedTypes: string[], maxBytes: number, label: string) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${label} must be ${allowedTypes.includes("application/pdf") ? "a PDF" : "an image"}.`);
  }

  if (file.size > maxBytes) {
    throw new Error(`${label} is too large.`);
  }
}

async function ensurePortfolioAssetsBucket(supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>) {
  const { error } = await supabase.storage.getBucket(portfolioAssetsBucket);

  if (!error) {
    await supabase.storage.updateBucket(portfolioAssetsBucket, { public: true });
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(portfolioAssetsBucket, {
    public: true,
  });

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    throw new Error(createError.message);
  }
}

async function uploadPortfolioAsset({
  supabase,
  file,
  folder,
  label,
  allowedTypes,
  maxBytes,
}: {
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>;
  file: File | null;
  folder: string;
  label: string;
  allowedTypes: string[];
  maxBytes: number;
}) {
  if (!file) {
    return null;
  }

  assertAllowedFile(file, allowedTypes, maxBytes, label);
  await ensurePortfolioAssetsBucket(supabase);

  const path = `${folder}/${Date.now()}-${randomUUID()}.${getSafeExtension(file)}`;
  const { error } = await supabase.storage
    .from(portfolioAssetsBucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return supabase.storage.from(portfolioAssetsBucket).getPublicUrl(path).data.publicUrl;
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

    const code = createOtpCode();

    await setAdminOtpChallenge(email, code);
    await sendAdminOtpEmail({ email, code });

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

    const result = await verifyAdminOtpChallenge(email, token);

    if (!result.ok) {
      throw new Error(result.message);
    }
  } catch (error) {
    return failure(error);
  }

  redirect("/admin");
}

export async function signOut() {
  await clearAdminAuthCookies();
  redirect("/admin");
}

export async function upsertProject(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireAdminSupabase();
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
    const supabase = await requireAdminSupabase();
    const fullName = String(formData.get("full_name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();

    if (!fullName || !role) {
      throw new Error("Name and role are required.");
    }

    const avatarUrl =
      (await uploadPortfolioAsset({
        supabase,
        file: getUploadFile(formData, "avatar_file"),
        folder: "profile",
        label: "Avatar",
        allowedTypes: imageMimeTypes,
        maxBytes: maxImageBytes,
      })) ||
      String(formData.get("avatar_url") ?? "").trim() ||
      null;
    const resumeUrl =
      (await uploadPortfolioAsset({
        supabase,
        file: getUploadFile(formData, "resume_file"),
        folder: "profile",
        label: "Resume",
        allowedTypes: pdfMimeTypes,
        maxBytes: maxPdfBytes,
      })) ||
      String(formData.get("resume_url") ?? "").trim() ||
      null;

    const { error } = await supabase.from("profile").upsert({
      id: true,
      full_name: fullName,
      role,
      headline: String(formData.get("headline") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      location_label: String(formData.get("location_label") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      resume_url: resumeUrl,
      avatar_url: avatarUrl,
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
    const supabase = await requireAdminSupabase();
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
    const supabase = await requireAdminSupabase();
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
    const supabase = await requireAdminSupabase();
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
    const supabase = await requireAdminSupabase();
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
    const supabase = await requireAdminSupabase();
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      throw new Error("Certificate title is required.");
    }

    const imageUrl =
      (await uploadPortfolioAsset({
        supabase,
        file: getUploadFile(formData, "image_file"),
        folder: "certificates",
        label: "Certificate image",
        allowedTypes: imageMimeTypes,
        maxBytes: maxImageBytes,
      })) ||
      String(formData.get("image_url") ?? "").trim() ||
      null;

    const { error } = await supabase.from("certificates").insert({
      title,
      issuer: String(formData.get("issuer") ?? "").trim() || null,
      year_label: String(formData.get("year_label") ?? "").trim() || null,
      image_url: imageUrl,
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
    const supabase = await requireAdminSupabase();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();

    if (!id || !title) {
      throw new Error("Certificate id and title are required.");
    }

    const imageUrl =
      (await uploadPortfolioAsset({
        supabase,
        file: getUploadFile(formData, "image_file"),
        folder: "certificates",
        label: "Certificate image",
        allowedTypes: imageMimeTypes,
        maxBytes: maxImageBytes,
      })) ||
      String(formData.get("image_url") ?? "").trim() ||
      null;

    const { error } = await supabase
      .from("certificates")
      .update({
        title,
        issuer: String(formData.get("issuer") ?? "").trim() || null,
        year_label: String(formData.get("year_label") ?? "").trim() || null,
        image_url: imageUrl,
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
    const supabase = await requireAdminSupabase();
    const slug = cleanSlug(formData.get("project_slug"));
    const uploadedUrl = await uploadPortfolioAsset({
      supabase,
      file: getUploadFile(formData, "media_file"),
      folder: `projects/${slug || "unsorted"}`,
      label: "Project image",
      allowedTypes: imageMimeTypes,
      maxBytes: maxImageBytes,
    });
    const url = uploadedUrl || String(formData.get("url") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();

    if (!slug || !url || !alt) {
      throw new Error("Project slug, media file or URL, and alt text are required.");
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
    const supabase = await requireAdminSupabase();
    const id = String(formData.get("id") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();

    if (!id || !alt) {
      throw new Error("Media id and alt text are required.");
    }

    const projectSlug = await getProjectSlugForMedia(supabase, id);
    const uploadedUrl = await uploadPortfolioAsset({
      supabase,
      file: getUploadFile(formData, "media_file"),
      folder: `projects/${projectSlug || "unsorted"}`,
      label: "Project image",
      allowedTypes: imageMimeTypes,
      maxBytes: maxImageBytes,
    });
    const url = uploadedUrl || String(formData.get("url") ?? "").trim();

    if (!url) {
      throw new Error("Media file or URL is required.");
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

async function getProjectSlugForMedia(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  mediaId: string,
) {
  const { data } = await supabase
    .from("project_media")
    .select("project_id, projects(slug)")
    .eq("id", mediaId)
    .maybeSingle();
  const relation = data?.projects as { slug?: string } | { slug?: string }[] | null | undefined;

  if (Array.isArray(relation)) {
    return typeof relation[0]?.slug === "string" ? cleanSlug(relation[0].slug) : "";
  }

  return typeof relation?.slug === "string" ? cleanSlug(relation.slug) : "";
}

export async function deleteCmsRecord(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireAdminSupabase();
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

export async function softDeleteContactMessage(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const supabase = await requireAdminSupabase();
    const id = String(formData.get("id") ?? "");

    if (!id) {
      throw new Error("Message id is required.");
    }

    const { error } = await supabase
      .from("contact_messages")
      .update({ status: "deleted" })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin");
    return success("Message deleted.");
  } catch (error) {
    return failure(error);
  }
}
