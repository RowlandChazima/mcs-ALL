-- =====================================================================
-- Migration 002: fields the unit page shows
-- Safe to re-run. Run AFTER migration-001.
-- =====================================================================

-- One-line description shown under each topic on the unit page
alter table subtopics add column if not exists summary text;

-- Estimated reading time in minutes (the content pipeline will fill this in)
alter table subtopics add column if not exists reading_minutes int
  check (reading_minutes is null or reading_minutes > 0);

-- Optional "Exam Prep Advice" box in the unit page sidebar.
-- Leave NULL and the box is simply not shown.
alter table units add column if not exists exam_tip text;
