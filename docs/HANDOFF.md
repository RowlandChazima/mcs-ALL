# Project Handoff: Maths & CS Cohort Hub (mcs-ALL)

*Last updated: 2026-11-02*

---

## 1. Current Status & Verification Baseline

- **Repository**: `https://github.com/RowlandChazima/mcs-ALL`
- **Node runtime**: Node.js 22 LTS (specified in `.nvmrc`)
- **Package manager**: `pnpm@11.1.3` (run via `pnpm.cmd` on Windows PowerShell)
- **Baseline checks**:
  - `pnpm exec tsc --noEmit`: PASS (0 errors)
  - `pnpm lint`: PASS (0 errors, 3 unused-import warnings in `CurriculumSidebar.tsx` and `Footer.tsx`)
  - `pnpm notes:selftest`: PASS (all 25 in-memory tests passed)
  - `pnpm notes:check`: PASS (1 unit, 7 notes, 0 errors)
  - `pnpm build`: Webpack production build succeeds. Turbopack on local Windows has a PostCSS worker panic, but Vercel Linux builds run cleanly.

---

## 2. Environments Architecture

```
[Local / Scripts]
  ├── Default (no flag)    ──> .env.local             ──> Staging Supabase
  └── Flag: --env prod     ──> .env.production.local  ──> Production Supabase (requires typed confirmation)

[Vercel Deployments]
  ├── Branch: main         ──> Production Environment ──> Production Supabase
  └── Branches / PRs (dev) ──> Preview Environment    ──> Staging Supabase
```

### Git Ignored Files
- `.env.local` (Staging keys)
- `.env.production.local` (Production keys)
- Both match `.env*` in `.gitignore` and are verified as ignored by git.

### Script Safeguards
All database scripts (`scripts/push-notes.ts`, `scripts/check-db.ts`, `scripts/seed.ts`):
1. Import `scripts/env.ts`.
2. Default to **STAGING** (`.env.local`).
3. Explicitly print the target environment and host before performing any query or upload:
   `🎯 Target database: [STAGING] at <host> (via .env.local)`
4. For production writes (`notes:push --env prod`, `db:seed --env prod`), require typing `"production"` interactively before any mutation.

---

## 3. Database Migrations

- `supabase/migration-001-curriculum.sql`: Made 100% self-contained. Creates `academic_years`, `units` (with `id, title, slug, description, accent_color, icon_path, order_index, created_at` if not already present), adds missing columns/constraints safely via `if not exists`, creates `subtopics`, `resources`, RLS public read policies, and the `course-materials` storage bucket.
- `supabase/migration-002-unit-page-fields.sql`: Adds `subtopics.summary`, `subtopics.reading_minutes`, and `units.exam_tip`.
- **Verified**: Proven against an empty PostgreSQL database and against an existing schema with preexisting rows. Both pass cleanly.

---

## 4. Checkpoints Status

1. **Step 1 (Done)**: Self-contained `migration-001-curriculum.sql`, proved on empty and old Postgres, `.nvmrc` added, staging safeguards added to scripts.
2. **Step 2 (Done)**: Staging project created on Supabase, migrations 001 + 002 applied, keys split into `.env.local` (staging) and `.env.production.local` (production).
3. **Step 3 & 4 (Done)**:
   - Initial row counts verified:
     - Staging: 0 years, 0 units, 0 subtopics, 0 resources.
     - Production: 1 year, 2 units, 7 subtopics, 2 resources.
   - `pnpm db:seed` run against Staging (created Year 1 and 2 units).
   - `pnpm notes:dry` and `pnpm notes:push` run against Staging (created 7 subtopics).
   - Post-push row counts verified:
     - `academic_years`: 1
- `units`: 2 (`calculus-1` and `structured-programming`)
- `subtopics`: 10 (7 in Calculus I, 3 in Structured Programming)
- `resources`: 2 in production (placeholders to be cleaned up), 0 in staging.
4. **Step 5 (Active checkpoint)**: Vercel Preview vs Production configuration & Deployment Protection decision.
5. **Next: Quick Wins**:
   - Fix footer links, repo URL, license text, and remove placeholder "Discussion Board".
   - Make home page metrics data-driven (remove hardcoded "8 Units Active").
   - Rename typo note `01-Intoduction to Functions.md` -> `01-Introduction to Functions.md` (and verify with `notes:dry` that only `intoduction-to-functions` is listed for removal).
   - Add lesson-page metadata and fix topic badge for `>= 10`.
   - Fix home page heading nesting (`<p>` inside `<h1>`).

