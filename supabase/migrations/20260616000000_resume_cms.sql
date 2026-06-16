create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  eyebrow text,
  summary text not null,
  description text,
  role text,
  stack text[] not null default '{}',
  outcomes text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'anonymized', 'private')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  live_url text,
  repo_url text,
  confidentiality_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  alt text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.profile (
  id boolean primary key default true check (id),
  full_name text not null,
  role text not null,
  headline text,
  bio text,
  location_label text,
  email text,
  phone text,
  resume_url text,
  avatar_url text,
  socials jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('experience', 'education', 'achievement')),
  title text not null,
  organization text not null,
  date_label text not null,
  location_label text,
  description text not null,
  href text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  label text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  year_label text,
  image_url text,
  alt text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  source text not null default 'portfolio',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create schema if not exists app_private;

alter table public.admin_users enable row level security;
alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.timeline_items enable row level security;
alter table public.skills enable row level security;
alter table public.certificates enable row level security;
alter table public.contact_messages enable row level security;

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  );
$$;

revoke all on function app_private.is_admin() from public;
grant execute on function app_private.is_admin() to authenticated;

create policy "Public can read profile"
on public.profile for select
to anon, authenticated
using (true);

create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (status in ('published', 'anonymized'));

create policy "Public can read public project media"
on public.project_media for select
to anon, authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = project_media.project_id
    and projects.status in ('published', 'anonymized')
  )
);

create policy "Public can read published timeline"
on public.timeline_items for select
to anon, authenticated
using (published = true);

create policy "Public can read published skills"
on public.skills for select
to anon, authenticated
using (published = true);

create policy "Public can read published certificates"
on public.certificates for select
to anon, authenticated
using (published = true);

create policy "Anyone can submit contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

create policy "Admins can manage profile"
on public.profile for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Admins can manage projects"
on public.projects for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Admins can manage project media"
on public.project_media for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Admins can manage timeline"
on public.timeline_items for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Admins can manage skills"
on public.skills for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Admins can manage certificates"
on public.certificates for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Admins can read contact messages"
on public.contact_messages for select
to authenticated
using (app_private.is_admin());
