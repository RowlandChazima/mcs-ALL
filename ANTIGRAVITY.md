# Handoff: finish the "Maths & CS Cohort Hub" (mcs-ALL) and get it ready to show my coursemates

You are taking over a half-built project from an earlier AI session that ran out of usage. Everything you need is in this message and in the repo. Read all of it before touching anything, then follow "How to start" at the bottom.

## Goal

Finish a polished, deployed, open-source study site for JKUAT Mathematics & Computer Science students, with real notes on it, ready to demo to my coursemates. Success means a coursemate opens a link on their phone, finds a unit, reads notes (maths, graphs, code, videos, photos), downloads past papers, and can contribute a fix.

## About me

I'm Rowland, a first-year Maths & CS student at JKUAT in Nairobi and a self-taught developer (Next.js, React, TypeScript, Tailwind, Supabase). I'm on **Windows 11 with PowerShell and VS Code**, so give commands that work there, and expect CRLF line endings. I write the course notes myself; your job is to format and check them. Keep explanations short and practical. I'll ask if I want something explained line by line.

## The product

Hierarchy: **Academic year → Unit → Topic (subtopic)**. Each topic page has notes (Markdown with KaTeX maths, highlighted code, tables, interactive function graphs, photos, extra YouTube videos) plus an optional main video. Each unit page lists its topics and downloadable files (past papers, slides, tutorial sheets).

Routes: `/` home, `/years/[yearSlug]`, `/units` (currently just redirects to `/years/year-1`), `/units/[unitSlug]`, `/units/[unitSlug]/[subtopicSlug]`, `POST /api/revalidate`.

Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind v4, pnpm 11, Supabase (Postgres + Storage), next-mdx-remote, KaTeX, rehype-pretty-code (shiki), function-plot, sharp.

Design: neo-brutalist (thick `border-2 border-ink`, hard offset shadows `shadow-chunky` / `shadow-chunky-sm`, rounded corners). Reuse the tokens in `app/globals.css` (`canvas`, `surface`, `ink`, `ink-muted`, `coral`, `butter`, `lilac`, `ice`, `charcoal`). Don't introduce a new visual language.

## Data model (Supabase)

- `academic_years(id, year_number, slug, title, description)`
- `units(id, year_id, code, slug, title, description, color_variant, semester, category, exam_tip, order_index, ...)`, where `color_variant` is butter|lilac|ice|charcoal and `category` is pure_math|computer_science|applied_math
- `subtopics(id, unit_id, slug, title, order_index, summary, reading_minutes, content_markdown, youtube_id, youtube_title, youtube_author, youtube_duration)`
- `resources(id, unit_id, title, category, file_url, file_size)`, where `category` is past_paper|lecture_slide|tutorial_sheet
- Storage bucket `course-materials` (public): `notes/<unit>/<hash>-name.webp` for photos, `resources/<unit>/<hash>-file.pdf` for downloads.
- Row Level Security is on: the public (anon) key is read-only; writes only happen with the service-role key, which stays on my machine / CI secrets.
- `topics` and `lessons` tables are legacy leftovers from an older design (empty, unused).
- Migrations are in `supabase/` (`migration-001-curriculum.sql`, `migration-002-unit-page-fields.sql`). I run SQL myself in the Supabase editor.

Env vars (`.env.local`, never commit, never print): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_ANON_KEY` (non-standard name, keep it), `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `REVALIDATE_SECRET`, `SITE_URL`. Values must have no quotes or trailing `;` (that exact mistake already broke the site once).

## How content flows

Notes are files, not database edits: `notes/<unit-slug>/_unit.md` (unit details, optional downloads list) plus `NN-topic-slug.md` per topic (header: `title`, `summary`, optional `video`). Commands:

- `pnpm notes:check` validates everything offline (maths, tags, props, images, video links).
- `pnpm notes:dry` shows what a push would change, without changing anything.
- `pnpm notes:push` uploads photos/PDFs (photos auto-compressed to WebP), upserts notes, and refreshes the site cache. `--prune` deletes DB rows with no file; `--unit <slug>` limits to one unit.
- `pnpm notes:selftest` runs 25 pipeline tests against an in-memory store.

The authoring guide is `docs/writing-notes.md`. Read it. Notes can use `<PillBadge>`, `<FunctionPlot>`, `<CloudinaryImg>`, `<YouTube>`, markdown images, and `$$...$$` display maths.

## Current state

**Built and tested** (in a sandbox using a _fake_ Supabase and a real browser; **never against my real database**):
the pipeline (create units/years, notes, photos, PDFs, videos; idempotent re-pushes), the notes renderer, function plots, the unit page reading real data, the lesson page, per-lesson error boundary, instant cache refresh via `/api/revalidate`, `pnpm db:check` diagnostics.

**Never verified:** `pnpm build` (the sandbox couldn't reach Google Fonts, so only dev mode and `tsc` were run), anything against my real Supabase, deployment, production behaviour of the cache and revalidate route.

**Known loose ends:**

- ESLint warnings: unused imports in `components/curriculum/CurriculumSidebar.tsx` and `components/layout/Footer.tsx`.
- `components/ui/Button.tsx` and `components/ui/AvatarStack.tsx` are empty files.
- Navbar links `/past-papers` and `/tutorials` have no routes; check where the footer links point too.
- `components/curriculum/UnitsDirectory.tsx` and `UnitFilterRail.tsx` exist; check whether they are wired to anything.
- `README.md` is create-next-app boilerplate. `ARCHITECTURE.md` describes an old Topic/Lesson design. `CLAUDE.md` contains a stale schema. All three need rewriting at the end.
- My database may still contain two placeholder download rows (`file_url like '%your-bucket-url%'`), and `notes/calculus-1/` may contain two older sample topics (epsilon-delta, differentiation) next to my real Calculus I notes. **Ask me before deleting either.**
- Minor: YouTube `?t=` start times are dropped; the checker reports only the first syntax error per file; `FunctionPlot` default y-range can crop fast-growing curves unless `yDomain` is set.

## Rules (decisions made deliberately; don't undo them)

1. **Read `AGENTS.md` and the docs in `node_modules/next/dist/docs/` before using any Next.js API.** This is Next 16: `params` is a Promise, `revalidateTag(tag, profile)` takes two arguments.
2. **Never turn off MDX `blockJS`.** `{...}` expressions in notes can run server code. That's why `FunctionPlot` array props are JSON _strings_ (`xDomain="[-3, 3]"`). The set of allowed tags lives in `lib/note-components.ts` and TypeScript enforces that `NotesRenderer` provides each one.
3. **Keep the caching pattern in `lib/db/queries.ts`**: misses and errors are thrown inside `unstable_cache` so they are never cached (a cached 404 once survived the data being added).
4. One-line `$$...$$` is deliberately rendered as display maths (`lib/remark-display-math.ts`); the checker validates it the same way.
5. **Never invent course content, YouTube IDs/titles, past papers or file URLs.** Use clearly marked placeholders and ask me.
6. **Never** commit or print secrets, run `notes:push` without a successful `notes:dry` I've seen first, use `--prune`, delete DB rows/tables, force-push, or change RLS without asking. I run SQL myself; give me the SQL.
7. Don't claim something works unless you ran it. Verify UI in a real browser (use your browser tool) at desktop width and 375px.
8. Work on a branch, commit in small steps with clear messages.
9. Before finishing any task run `pnpm exec tsc --noEmit`, `pnpm lint` and `pnpm notes:selftest`.
10. No heavy new dependencies without a stated reason.

## Remaining work (priority order)

**A. Stabilise (must)**

1. Run the baseline (below), including `pnpm build`, and fix what it reveals. Clear the lint warnings; delete or implement the empty UI files.
2. With me, confirm migrations 001 and 002 are applied (columns `summary`, `reading_minutes`, `exam_tip` exist, read policies exist, bucket is public). Use `pnpm db:check`.
3. First real content push: `notes:check`, then `notes:dry` (show me the output), then `notes:push`.

**B. Finish the site (must)** 4. Audit the home page and footer for hardcoded or placeholder content. Make the year cards data-driven; a year with no units shows a friendly "coming soon" state. 5. Build `/units` (all-units directory with filtering; use the existing components if suitable). 6. Build Past Papers and Tutorial Sheets pages from the `resources` table (group by unit, filter by category), and fix the dead nav links. 7. App-level `loading.tsx` skeletons, a branded `not-found.tsx`, and an `error.tsx`. 8. SEO and sharing: page metadata, Open Graph image, favicon, `sitemap.xml` and `robots.txt` generated from the DB.

**C. Quality (should)** 9. Mobile QA at 375px on every route, keyboard focus and colour contrast, image alt text, and a Lighthouse pass on a lesson page. Add heading anchor links to notes, and a print stylesheet for notes (students print them).

**D. Contribution and automation (should)** 10. Each lesson's "Suggest an edit" should link to the note's file on GitHub for editing (propose a small migration to store a `source_path`, written by the pipeline). 11. GitHub Actions: on pull requests run tsc, lint, `notes:selftest` and `notes:check`; on merge to main run `notes:push` using repository secrets. Write `CONTRIBUTING.md` so a coursemate can add notes via a PR without any keys.

**E. Nice to have (could)** 12. Search across notes, reading progress/bookmarks, dark mode, offline support for low-data users, automatic y-range for plots, YouTube start times.

**F. Docs (last, as I asked)** 13. Rewrite `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`/`AGENTS.md` to match reality.

**G. Deploy and showcase** 14. Deploy (Vercel unless you recommend otherwise). Give me the exact env-var list, set `REVALIDATE_SECRET` and `SITE_URL`, run the production push, and smoke-test the live site on a phone. 15. Make sure the first screen isn't empty: at least Calculus I fully populated (ask me which units come next). 16. Prepare the showcase: a 2-minute demo script, a 3-sentence pitch, a share card/QR code, a feedback form link, and a launch checklist.

## Things only I can do (ask me clearly when you need them)

Run SQL in Supabase, set env vars on the host, supply notes/photos/PDFs, and approve any destructive action.

## How to start

1. Read `AGENTS.md`, `CLAUDE.md` (partly stale), `docs/writing-notes.md`, `lib/db/queries.ts`, `scripts/notes/pipeline.ts`.
2. Baseline: `pnpm install`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm notes:selftest`, `pnpm notes:check`, `pnpm build`. Report exactly what passes and fails.
3. Post a short plan for phases A and B and **wait for my OK** before changing code.
4. Work phase by phase. After each task tell me: what changed, how you verified it, and what's next.
5. Create `docs/HANDOFF.md` and update it at the end of every session (status, decisions, open questions), so any model can resume from the repo alone. I have limited usage per day, so keep it current.
