@AGENTS.md

- 1. Academic Years (Year 1 to Year 4)
     create table academic_years (
     id uuid primary key default gen_random_uuid(),
     year_number int not null unique, -- 1, 2, 3, 4
     slug text not null unique, -- 'year-1'
     title text not null, -- 'First Year'
     description text
     );

- 2. Course Units
     create table units (
     id uuid primary key default gen_random_uuid(),
     year_id uuid references academic_years(id) on delete cascade,
     code text not null unique, -- e.g. 'SMA 2100', 'ICS 2101'
     slug text not null unique, -- 'calculus-1', 'computer-architecture'
     title text not null,
     color_variant text default 'butter', -- 'butter' | 'lilac' | 'ice' | 'charcoal'
     semester int not null default 1,
     order_index int default 0
     );

- 3. Topics & Subtopics
     create table subtopics (
     id uuid primary key default gen_random_uuid(),
     unit_id uuid references units(id) on delete cascade,
     slug text not null,
     title text not null,
     order_index int default 0,
     content_markdown text not null default '', -- KaTeX math + code stored as raw text
     youtube_id text, -- e.g. 'dQw4w9WgXcQ'
     youtube_title text,
     youtube_author text,
     youtube_duration text,
     unique(unit_id, slug)
     );

- 4. Downloadable Course Materials (Tutorials, Slides, Past Papers)
     create table resources (
     id uuid primary key default gen_random_uuid(),
     unit_id uuid references units(id) on delete cascade,
     subtopic_id uuid references subtopics(id) on delete set null,
     title text not null, -- 'Calculus I - Assignment 1 Solutions'
     category text not null, -- 'past_paper' | 'lecture_slide' | 'tutorial_sheet'
     file_url text not null, -- Supabase storage public URL
     file_size text, -- '1.4 MB'
     created_at timestamp with time zone default now()
     );

<!-- jdnjdjfdj -->

interface ResourceCardProps {
title: string;
category: "past_paper" | "lecture_slide" | "tutorial_sheet";
fileUrl: string;
fileSize?: string;
}

export function ResourceCard({ title, category, fileUrl, fileSize }: ResourceCardProps) {
const badgeLabels = {
past_paper: { label: "Past Paper", color: "bg-coral text-white" },
lecture_slide: { label: "Lecture Slide", color: "bg-ice text-ink" },
tutorial_sheet: { label: "Tutorial Sheet", color: "bg-butter text-ink" },
};

return (
<div className="flex items-center justify-between rounded-2xl border-2 border-ink bg-white p-4 shadow-chunky-sm transition-transform hover:-translate-y-0.5">
<div className="space-y-1">
<span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeLabels[category].color}`}>
{badgeLabels[category].label}
</span>
<h4 className="font-bold text-ink text-sm md:text-base">{title}</h4>
{fileSize && <p className="text-xs text-ink-muted">{fileSize}</p>}
</div>
<a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="rounded-full border-2 border-ink bg-surface px-4 py-2 text-xs font-black tracking-wider uppercase text-ink transition-colors hover:bg-ink hover:text-white"
      >
Download
</a>
</div>
);
}
