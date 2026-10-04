-- =====================================================================
-- Migration 001: bring the database in line with the app code
-- Model: academic_years -> units -> subtopics (+ resources per unit)
-- Safe to re-run. Does NOT drop or modify your old `topics` / `lessons`.
-- =====================================================================

-- ---------- 0. BEFORE YOU RUN: see what's already in the old tables ----------
-- select 'units' t, count(*) from units
-- union all select 'topics', count(*) from topics
-- union all select 'lessons', count(*) from lessons;

-- ---------- 1. Academic years ----------
create table if not exists academic_years (
  id          uuid primary key default gen_random_uuid(),
  year_number int  not null unique,
  slug        text not null unique,
  title       text not null,
  description text
);

-- ---------- 2. Units: add the columns the code expects ----------
-- Added as nullable so existing rows (if any) don't block the migration.
alter table units add column if not exists year_id       uuid references academic_years(id) on delete cascade;
alter table units add column if not exists code          text;
alter table units add column if not exists color_variant text default 'butter';
alter table units add column if not exists semester      int  default 1;
alter table units add column if not exists category      text;

-- `description` and `order_index` already exist on units.

alter table units drop constraint if exists units_color_variant_check;
alter table units add  constraint units_color_variant_check
  check (color_variant in ('butter','lilac','ice','charcoal'));

alter table units drop constraint if exists units_semester_check;
alter table units add  constraint units_semester_check
  check (semester in (1,2));

alter table units drop constraint if exists units_category_check;
alter table units add  constraint units_category_check
  check (category in ('pure_math','computer_science','applied_math'));

-- seed.ts upserts on slug, so slug must be unique. Unique code too (nulls allowed).
create unique index if not exists units_slug_key on units(slug);
create unique index if not exists units_code_key on units(code);

-- ---------- 3. Subtopics (lesson notes live here) ----------
create table if not exists subtopics (
  id               uuid primary key default gen_random_uuid(),
  unit_id          uuid not null references units(id) on delete cascade,
  slug             text not null,
  title            text not null,
  order_index      int  default 0,
  content_markdown text not null default '',
  youtube_id       text,
  youtube_title    text,
  youtube_author   text,
  youtube_duration text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  unique (unit_id, slug)
);

-- ---------- 4. Resources (past papers, slides, tutorial sheets) ----------
create table if not exists resources (
  id          uuid primary key default gen_random_uuid(),
  unit_id     uuid not null references units(id) on delete cascade,
  subtopic_id uuid references subtopics(id) on delete set null,
  title       text not null,
  category    text not null check (category in ('past_paper','lecture_slide','tutorial_sheet')),
  file_url    text not null,
  file_size   text,
  created_at  timestamptz default now(),
  unique (unit_id, title)
);

-- ---------- 5. Row Level Security ----------
-- IMPORTANT: the anon key ships to every visitor's browser (NEXT_PUBLIC_*).
-- With RLS off, anyone holding it could insert/update/delete your content.
-- These policies make the public key read-only. Writes happen only with the
-- service-role key (seed script / admin tools), which bypasses RLS.
alter table academic_years enable row level security;
alter table units          enable row level security;
alter table subtopics      enable row level security;
alter table resources      enable row level security;

drop policy if exists "public read academic_years" on academic_years;
create policy "public read academic_years" on academic_years for select to anon, authenticated using (true);

drop policy if exists "public read units" on units;
create policy "public read units" on units for select to anon, authenticated using (true);

drop policy if exists "public read subtopics" on subtopics;
create policy "public read subtopics" on subtopics for select to anon, authenticated using (true);

drop policy if exists "public read resources" on resources;
create policy "public read resources" on resources for select to anon, authenticated using (true);

-- ---------- 6. Storage bucket for downloadable files ----------
-- Public read; uploads go through the dashboard or the service-role key.
insert into storage.buckets (id, name, public)
values ('course-materials', 'course-materials', true)
on conflict (id) do nothing;
