# Writing lesson notes

## The workflow (everything runs on your laptop)

```
notes/
  calculus-1/                      <- folder name = the unit's web address
    _unit.md                       <- unit details (code, title, year, semester, colour...)
    01-limits.md                   <- one file per topic; the number sets the order
    02-derivatives.md
    images/whiteboard.jpg          <- photos live next to the notes
    resources/cat1-2024.pdf        <- past papers / slides / tutorial sheets
```

| Command | What it does |
|---|---|
| `pnpm notes:check` | Checks every note. No internet or keys needed. Run it as you write. |
| `pnpm notes:dry` | Shows what a push would add or change. Changes nothing. |
| `pnpm notes:push` | Checks, uploads photos/PDFs, saves notes, refreshes the site. |
| `pnpm notes:push --unit calculus-1` | Only that unit. |
| `pnpm notes:push --prune` | Also deletes topics/downloads that no longer have a file. |

Pushing twice is safe: unchanged notes are skipped and nothing is uploaded again.

### Each topic file starts with a header

```
---
title: "Limits: The Epsilon-Delta Formulation"   <- quote it if it contains a colon
summary: "One line shown on the unit page."
video: https://youtu.be/XXXXXXXXXXX              <- optional main video, shown at the top
---
```

The video's title and channel are looked up for you. Add `duration: "18 min"`
under a `video:` block if you want the length shown (see `notes/_TEMPLATE.md`).

### Extra videos, photos, graphs

- More videos anywhere in the note: `<YouTube url="https://youtu.be/XXXXXXXXXXX" title="Worked examples" />`
- Photos: put the file in `images/`, then `![What the photo shows](images/whiteboard.jpg)`.
  The text in `[...]` is shown as the caption. Photos are straightened, shrunk
  to 1600px wide and converted to WebP automatically (a 5 MB phone photo becomes
  a few hundred KB).
- Graphs: see below.

### One-time setup for instant refresh

Add to `.env.local` (any long random text; make one with
`node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`):

```
REVALIDATE_SECRET=paste-the-random-text-here
```

With `pnpm dev` running, `notes:push` then refreshes the site immediately. For
the live site, set the same `REVALIDATE_SECRET` on your host and add
`SITE_URL=https://your-site-address` to `.env.local`. Without the secret
everything still works; visitors just see changes within an hour.

---

## What you can write

Notes are rendered as MDX.

## Math (KaTeX)

Inline: `$f(x) = x^2$`  Block:

    $$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

## Code

Fenced blocks with a language are syntax-highlighted:

    ```c
    int main(void) { return 0; }
    ```

## Tables, lists, bold

Standard GitHub-flavoured markdown (`| a | b |` tables work).

## Components

| Tag | Purpose |
|---|---|
| `<PillBadge variant="butter">Exam definition</PillBadge>` | Inline highlight. Variants: `coral` `butter` `lilac` `ice` |
| `<CloudinaryImg src="https://res.cloudinary.com/..." alt="..." caption="..." />` | Optimised image with caption |
| `<FunctionPlot fn="x^2 - 4" />` | Interactive graph (see below) |

### FunctionPlot

| Prop | Example | Notes |
|---|---|---|
| `fn` | `fn="sin(x)"` | One expression. Also `1/x`, `x^3`, `sqrt(x)`... |
| `fns` | `fns='["x^2", "x^3"]'` | Several curves on one graph (JSON string) |
| `xDomain` | `xDomain="[-4, 4]"` | Horizontal range (default `[-6, 6]`) |
| `yDomain` | `yDomain="[-5, 8]"` | Vertical range. **Set it for fast-growing curves** or they get cropped |
| `points` | `points="[[2, 0], [0, -4]]"` | Marked points |
| `title` | `title="Parabola"` | Heading above the graph |
| `height` | `height="400"` | Pixels (default 320) |
| `interactive` | `interactive="true"` | Enables wheel-zoom and drag (off by default so it doesn't hijack scrolling) |

**Array props are written as quoted JSON strings** (`xDomain="[-4, 4]"`), *not*
`xDomain={[-4, 4]}`. JavaScript expressions in `{...}` are deliberately blocked
in notes because they could run code on the server; without this rule anyone able
to edit a note could read your secret keys. A prop that isn't valid JSON shows a
clear error message on the graph instead of failing silently.

## Things that break a note

- A tag that isn't closed (`<div>` without `</div>`) or a stray `{` outside math
  → the lesson shows "These notes have a formatting error".
- A component that doesn't exist (e.g. `<Nope />`) → the lesson shows the
  "couldn't be loaded" card.
- A typo inside a formula → only that formula turns red; the rest still renders.
