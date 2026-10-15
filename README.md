# Maths & CS Hub

Study materials for Mathematics & Computer Science, all in one place.

To avoid the struggle of always stressing on looking for relevant and understandable
notes and more extra course materials. I built a project and also my own solution to the problem that I know not only I face. It puts them in one website, organised by **year → unit →
topic**, with properly written maths, interactive graphs, embedded videos and
not yet downloadable past papers.

Want to add or fix a note or even make a contribution to what I'm building? Jump to [Contributing](#contributing). You do **not**
need any passwords or database access to contribute.

> **Status: work in progress.** Right now it covers the beginning of Calculus I.
> More units and topics are being added. Feedback is very welcome; see
> [Feedback](#feedback).

It's a web application built with [Next.js](https://nextjs.org) with its variants and [Supabase](https://supabase.com).

---

## Contents

1. [Run it on your computer](#run-it-on-your-computer)
2. [Environment variables](#environment-variables)
3. [How notes are structured](#how-notes-are-structured)
4. [Writing a note](#writing-a-note)
5. [What you can put in a note](#what-you-can-put-in-a-note)
6. [Contributing](#contributing)
7. [Publishing notes to your database](#publishing-notes-to-your-database)
8. [Deploy your own copy](#deploy-your-own-copy)
9. [Feedback](#feedback)
10. [Troubleshooting](#troubleshooting)

---

## How it works

```
notes/*.md ──(pnpm notes:check)──> checked on your computer
    │
    └──(pnpm notes:push)──> Supabase database ──> the website reads from it
```

- Notes are plain **Markdown files** in the `notes/` folder.
- The website reads from the **Supabase database**, not from the files directly.
  So after you write or change a note, you publish it with `pnpm notes:push`.
- `pnpm notes:check` works offline and tells you if a note has a mistake before you publish.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer and [pnpm](https://pnpm.io) (`npm i -g pnpm`).

```bash
git clone https://github.com/RowlandChazima/mcs-ALL.git
cd mcs-ALL
pnpm install

pnpm dev                       # opens at http://localhost:3000
```

The site needs a Supabase database to show anything. To use your own:

1. Create a free project at [supabase.com](https://supabase.com).
2. Set up the database tables. In your Supabase dashboard, open **SQL Editor → New query**, then run the three files in the `supabase/` folder **in this order**. For each one, open the file, copy everything in it, paste it into the editor and click **Run**:

   | Order | File                                 | What it does                                                                                                                                                                                                      |
   | ----- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 1     | `migration-000-base-units.sql`       | Creates the starting `units` table                                                                                                                                                                                |
   | 2     | `migration-001-curriculum.sql`       | Creates `academic_years`, `subtopics` and `resources`, adds the extra unit columns, makes the public key read-only (row-level security), and creates the `course-materials` storage bucket for downloadable files |
   | 3     | `migration-002-unit-page-fields.sql` | Adds the topic summary, reading time and exam tip fields                                                                                                                                                          |

   Run them in order, because 001 builds on 000 and 002 builds on 001. All three are safe to run again if you're unsure whether they worked.

   To confirm everything was created, run this query:

   ```sql
   select table_name
   from information_schema.tables
   where table_schema = 'public'
   order by table_name;
   ```

   You should see `academic_years`, `resources`, `subtopics` and `units` in the list.

3. Create a file named `.env.local` in the project folder and put your project's URL and keys in it (see [Environment variables](#environment-variables)).
4. Run `pnpm db:seed` to create the year and unit records, then `pnpm notes:push` to upload the notes.

Only want to write or check notes? You don't need any of this. `pnpm notes:check` works with no setup beyond `pnpm install`.

## Environment variables

Put these in `.env.local`. This file is git-ignored; never commit it.

| Variable                            | Used by          | Secret? | What it is                                                                                                                            |
| ----------------------------------- | ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`          | site and scripts | No      | Your Supabase project URL                                                                                                             |
| `NEXT_PUBLIC_ANON_KEY`              | site             | No      | Supabase public ("anon") key. Read-only because of row-level security                                                                 |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | site             | No      | Cloudinary cloud name, for images                                                                                                     |
| `REVALIDATE_SECRET`                 | site and scripts | **Yes** | Any long random text. Lets `notes:push` refresh the live site straight away                                                           |
| `SITE_URL`                          | scripts          | No      | Where your site is running, e.g. `http://localhost:3000` or your live address                                                         |
| `SUPABASE_SERVICE_ROLE_KEY`         | scripts only     | **Yes** | Full database access, used only by `notes:push` and `db:seed` on your computer. Never put it on a hosting platform and never share it |

To make a `REVALIDATE_SECRET` for the site refresh:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

## How notes are structured

```
notes/
  calculus-1/                         <- folder name becomes the unit's web address
    _unit.md                          <- unit details (code, title, year, semester, category...)
    01-introduction-to-functions.md   <- one file per topic; the number sets the order
    02-composite-functions.md
    images/diagram.jpg                <- photos go next to the notes
    resources/cat1-2024.pdf           <- past papers, slides, tutorial sheets
  _TEMPLATE.md                        <- copy this to start a topic
  _UNIT_TEMPLATE.md                   <- copy this to start a unit
```

- **One Markdown file = one topic page.**
- The **folder name** must use lowercase letters, numbers and hyphens only.
- The **file name minus its number** becomes the topic's web address:
  `03-rate-of-change.md` appears at `/units/calculus-1/rate-of-change`.
  Renaming a published file changes its address.
- Every unit folder needs a `_unit.md`.

For the full details on every field and component, see [`docs/writing-notes.md`](docs/writing-notes.md).

## Writing a note

1. Go to the unit's folder in `notes/`, or make a new one with a `_unit.md` (copy `notes/_UNIT_TEMPLATE.md`).
2. Copy `notes/_TEMPLATE.md` into it and name it with the next free number, e.g. `07-chain-rule.md`.
3. Fill in the header. `title` and `summary` are required. Put quotes around the title if it contains a colon.

   ```
   ---
   title: "Limits"
   summary: "Factorisation, Rationalization, Direct Substitution etc."
   video: https://youtu.be/XXXXXXXXXXX     # optional
   ---
   ```

4. Write your content using the table below.
5. Check it:

   ```bash
   pnpm notes:check
   ```

   It names the file and line of anything wrong, and works offline. Keep going until it says **All notes look good**.

## What you can put in a note

| You want      | Write                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Inline maths  | `$f(x) = x^2$`                                                                                          |
| Display maths | `$$\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$` on **its own line**, one `$$…$$` per line of working       |
| A table       | Standard Markdown tables                                                                                |
| Code          | A fenced block with the language, e.g. ` ```c `                                                         |
| A photo       | Put the file in `images/`, then `![What it shows](images/photo.jpg)`                                    |
| A video       | `video:` in the header, or `<YouTube url="https://youtu.be/XXXXXXXXXXX" title="Worked examples" />`     |
| A graph       | `<FunctionPlot fn="x^2" xDomain="[-4, 4]" yDomain="[-1, 10]" points="[[2, 4]]" />`                      |
| A highlight   | `<PillBadge variant="butter">Exam definition</PillBadge>` (variants: `coral`, `butter`, `lilac`, `ice`) |

**Rules that stop a note from breaking**

- Array props are quoted JSON strings: `xDomain="[-4, 4]"` works, `xDomain={[-4, 4]}` does not.
- Close every tag. `<div>` needs `</div>`; self-closing tags end in `/>`.
- No stray `{` or `}` outside maths. Put them inside `$…$` or in a code block.
- Set `yDomain` for fast-growing curves like `x^3`, or they get cropped.
- Only use the components listed in [`docs/writing-notes.md`](docs/writing-notes.md).
- A typo inside one formula only turns that formula red; the rest of the page still shows.

## Contributing

Contributions are welcome: new topics, corrections, better explanations, worked
examples, past-paper solutions.

If you are a newbie on how contributing works please refer to the guidelines in [`CONTRIBUTING.md`](CONTRIBUTING.md) to help you get started. If not follow the instructions below:

1. **Fork** this repository (button at the top right on GitHub) and clone your fork.
2. **Create a branch** from `main`: `git checkout -b notes/calculus-chain-rule`
3. **Make your change** (see [Writing a note](#writing-a-note)).
4. **Run the checks.** They must pass before you open a pull request:

   ```bash
   pnpm notes:check
   pnpm lint
   ```

5. **Commit and push** to your fork, then **open a pull request** against `main`. Fill in the checklist in the template.
6. **Respond to review.** The maintainer checks that the maths is correct, the page renders properly, and the structure follows this guide.

## Publishing notes to your database

| Command                             | What it does                                                  |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm notes:check`                  | Validates every note. Offline.                                |
| `pnpm notes:dry`                    | Shows what a push would add or change. Changes nothing.       |
| `pnpm notes:push`                   | Uploads photos and PDFs, saves the notes, refreshes the site. |
| `pnpm notes:push --unit calculus-1` | Only that unit.                                               |
| `pnpm notes:push --prune`           | Also removes topics and downloads whose file you've deleted.  |

Pushing twice is safe: unchanged notes are skipped.

`--prune` deletes live content for any topic whose file is missing from your
folder, so look at `pnpm notes:dry --prune` first.

## Deploy your own copy

The site deploys to [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Add these environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_ANON_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `REVALIDATE_SECRET`.
4. Click **Deploy**.

Don't add `SUPABASE_SERVICE_ROLE_KEY` to Vercel. The running site only reads data; only `notes:push` on your own computer needs that key.

After deploying, set `SITE_URL` in your local `.env.local` to your Vercel address so `notes:push` refreshes the live site immediately.

## Feedback

This is an early version, and feedback is what it needs most. Useful things to tell me:

- Is it easy to find a topic?
- Are the notes clear and correct? Spotted a mistake in the maths?
- Does anything look broken on your phone or browser?
- What units or topics would you want next?

Open an [issue](https://github.com/RowlandChazima/mcs-ALL/issues) on this repository.

Want to fix or add a note yourself? Fork the repository, make your change on a
branch, run `pnpm notes:check`, and open a pull request. You don't need any keys
for that. Your changes show on the site once they're merged and published by me after reviewing it.

## Troubleshooting

| Problem                                          | Fix                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| "These notes have a formatting error" on a page  | An unclosed tag or a stray `{`. Run `pnpm notes:check`.                                           |
| "Couldn't be loaded" card                        | The note uses a component that doesn't exist. Check the spelling against `docs/writing-notes.md`. |
| A graph shows a red error                        | A prop isn't valid JSON. Use `xDomain="[-4, 4]"`.                                                 |
| A curve is cut off                               | Set `yDomain`.                                                                                    |
| An old topic still shows after deleting its file | Publish with `pnpm notes:push --prune`.                                                           |
| Changes don't show on the live site              | Check `REVALIDATE_SECRET` and `SITE_URL`. Without them, changes appear within about an hour.      |
| `notes:push` says a unit has no `_unit.md`       | Every unit folder needs one with `code`, `title`, `year`, `semester`, `category`.                 |
