# Writing lesson notes

Notes live in the `subtopics.content_markdown` column and are rendered as MDX.

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
