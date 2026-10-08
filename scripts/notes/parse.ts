import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import katex from "katex";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";
import { parseYouTubeId } from "../../lib/youtube";
import { NOTE_COMPONENT_NAMES } from "../../lib/note-components";
import type {
  ImageRef,
  Issue,
  ParsedNote,
  ParsedUnit,
  ResourceCategory,
  ResourceSpec,
  UnitFileMeta,
  VideoMeta,
} from "./types";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const RESOURCE_EXTS = new Set([".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".zip"]);
const RESOURCE_CATEGORIES = ["past_paper", "lecture_slide", "tutorial_sheet"];
const BLOCKED_HTML = new Set(["script", "iframe", "style", "object", "embed", "link", "meta", "base", "form"]);
const PILL_VARIANTS = ["coral", "butter", "lilac", "ice"];
const FUNCTION_PLOT_PROPS = ["fn", "fns", "points", "title", "xDomain", "yDomain", "height", "interactive"];
const WORDS_PER_MINUTE = 180;

interface AnyNode {
  type: string;
  name?: string | null;
  value?: unknown;
  url?: string;
  alt?: string | null;
  depth?: number;
  attributes?: Array<{ type: string; name?: string; value?: unknown }>;
  position?: { start: { line: number; offset?: number }; end: { offset?: number } };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function readSource(file: string): string {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

function frontmatter(
  file: string,
  rel: string,
  issues: Issue[],
): { data: Record<string, unknown>; content: string; lineOffset: number } | null {
  const raw = readSource(file);
  try {
    const parsed = matter(raw);
    const lineOffset = raw.slice(0, raw.length - parsed.content.length).split("\n").length - 1;
    return { data: parsed.data as Record<string, unknown>, content: parsed.content, lineOffset };
  } catch (err) {
    issues.push({
      level: "error",
      file: rel,
      message: `The header between the --- lines could not be read: ${(err instanceof Error ? err.message.split("\n")[0] : String(err)).replace(/:\s*$/, "")}. Most often a value contains a colon (:). Wrap it in quotes, e.g. title: "Limits: The Epsilon-Delta Formulation".`,
    });
    return null;
  }
}

function insideDir(child: string, parent: string): boolean {
  const relative = path.relative(parent, child);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

const isNumberPair = (v: unknown) =>
  Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === "number" && Number.isFinite(n));


// MDX's own messages talk about "acorn" and "names". Translate the common ones.
function explainSyntaxError(reason: string): string {
  if (/acorn|expression/i.test(reason)) {
    return "Text inside { braces } was read as code. To show literal braces write \\{ and \\}, or put the text in backticks.";
  }
  if (/closing tag|before the end|unclosed/i.test(reason)) {
    return `A tag is opened but never closed (look for a missing </...> or a missing /> ). Details: ${reason}`;
  }
  if (/before name|local name|start a name/i.test(reason)) {
    return "A < in normal text was read as the start of a tag. Write \\< instead, or put it in backticks (inside formulas, use $...$).";
  }
  return `${reason}. Common causes: a tag that is never closed, a stray { or < in normal text, or an unknown tag.`;
}

// ---------------------------------------------------------------------------
// Body validation: syntax, allowed tags, props, maths, images
// ---------------------------------------------------------------------------
function validateBody(
  body: string,
  ctx: { rel: string; noteDir: string; notesRoot: string; lineOffset: number },
  issues: Issue[],
): { images: ImageRef[]; readingMinutes: number } {
  const images: ImageRef[] = [];
  const add = (level: "error" | "warning", message: string, line?: number) =>
    issues.push({ level, file: ctx.rel, line: line !== undefined ? line + ctx.lineOffset : undefined, message });

  let tree: AnyNode;
  try {
    tree = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath).parse(body) as unknown as AnyNode;
  } catch (err) {
    const e = err as { line?: number; reason?: string; message?: string };
    const reason = (e.reason ?? e.message ?? String(err)).split("\n")[0];
    add("error", explainSyntaxError(reason), e.line);
    return { images, readingMinutes: 1 };
  }

  let words = 0;
  const allowed = new Set<string>(NOTE_COMPONENT_NAMES);

  visit(tree as never, (rawNode: unknown) => {
    const node = rawNode as AnyNode;
    const line = node.position?.start.line;

    switch (node.type) {
      case "text":
        words += String(node.value ?? "").split(/\s+/).filter(Boolean).length;
        break;
      case "code":
        words += Math.ceil(String(node.value ?? "").split(/\s+/).filter(Boolean).length / 2);
        break;
      case "heading":
        if (node.depth === 1) {
          add("warning", "A single # heading repeats the page title. Start with ## or ###.", line);
        }
        break;
      case "math":
      case "inlineMath":
        try {
          katex.renderToString(String(node.value ?? ""), {
            // One-line $$...$$ is shown as display maths by the site (see
            // lib/remark-display-math.ts), so it must be checked as display too.
            displayMode:
              node.type === "math" || body.startsWith("$$", node.position?.start.offset ?? -1),
            throwOnError: true,
            strict: "ignore",
          });
        } catch (err) {
          const detail = (err instanceof Error ? err.message : String(err))
            .split("\n")[0]
            .replace(/^KaTeX parse error: /, "")
            .replace(/ at position \d+:[\s\S]*$/, "");
          add("error", `Formula problem: ${detail}`, line);
        }
        break;
      case "mdxFlowExpression":
      case "mdxTextExpression":
        add(
          "error",
          "JavaScript in { braces } is blocked in notes. To show a literal brace write \\{ and \\}, or put the text in backticks.",
          line,
        );
        break;
      case "image": {
        const url = node.url ?? "";
        if (/^(https?:)?\/\//i.test(url) || url.startsWith("/") || url.startsWith("data:")) break; // already hosted
        if (!/^[A-Za-z0-9._/-]+$/.test(url)) {
          add("error", `Image path "${url}" has spaces or special characters. Rename the file using only letters, numbers, - and _.`, line);
          break;
        }
        const abs = path.resolve(ctx.noteDir, url);
        if (!insideDir(abs, ctx.notesRoot)) {
          add("error", `Image "${url}" points outside the notes folder.`, line);
        } else if (!IMAGE_EXTS.has(path.extname(abs).toLowerCase())) {
          add("error", `"${url}" isn't a supported image type (png, jpg, jpeg, webp, gif, svg).`, line);
        } else if (!fs.existsSync(abs)) {
          add("error", `Image file not found: ${url}`, line);
        } else {
          images.push({
            url,
            absPath: abs,
            start: node.position?.start.offset ?? 0,
            end: node.position?.end.offset ?? 0,
            line: (line ?? 0) + ctx.lineOffset,
          });
        }
        break;
      }
      case "mdxJsxFlowElement":
      case "mdxJsxTextElement": {
        const name = node.name;
        if (!name) break; // fragment <>...</>
        const attrs = node.attributes ?? [];

        for (const attr of attrs) {
          if (attr.type === "mdxJsxExpressionAttribute") {
            add("error", `<${name}> uses a spread {...}, which is blocked in notes.`, line);
          } else if (isObject(attr.value) && attr.value.type === "mdxJsxAttributeValueExpression") {
            add(
              "error",
              `<${name} ${attr.name}={...}> uses a JavaScript expression, which the site blocks. Write it as a quoted string instead, e.g. ${attr.name}="[-3, 3]".`,
              line,
            );
          }
        }
        const attr = (n: string): string | null | undefined => {
          const found = attrs.find((a) => a.name === n);
          if (!found) return undefined;
          return typeof found.value === "string" ? found.value : found.value === null ? null : undefined;
        };

        if (/^[a-z]/.test(name)) {
          if (BLOCKED_HTML.has(name)) add("error", `<${name}> isn't allowed in notes.`, line);
          break;
        }
        if (!allowed.has(name)) {
          add("error", `Unknown tag <${name}>. Available tags: ${NOTE_COMPONENT_NAMES.join(", ")}.`, line);
          break;
        }

        if (name === "YouTube") {
          const source = attr("url") ?? attr("id");
          if (!source) add("error", `<YouTube> needs a url, e.g. <YouTube url="https://youtu.be/XXXXXXXXXXX" />.`, line);
          else if (!parseYouTubeId(source)) add("error", `<YouTube> link isn't a valid YouTube link: ${source}`, line);
        }

        if (name === "PillBadge") {
          const variant = attr("variant");
          if (variant && !PILL_VARIANTS.includes(variant)) {
            add("warning", `<PillBadge variant="${variant}"> isn't one of: ${PILL_VARIANTS.join(", ")}.`, line);
          }
        }

        if (name === "FunctionPlot") {
          for (const a of attrs) {
            if (a.name && !FUNCTION_PLOT_PROPS.includes(a.name)) {
              add("warning", `<FunctionPlot> doesn't have a "${a.name}" option (available: ${FUNCTION_PLOT_PROPS.join(", ")}).`, line);
            }
          }
          if (attr("fn") === undefined && attr("fns") === undefined) {
            add("error", `<FunctionPlot> needs fn="..." or fns='["...", "..."]'.`, line);
          }
          const checks: Array<[string, (v: unknown) => boolean, string]> = [
            ["fns", (v) => Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === "string"), `fns='["x^2", "x^3"]'`],
            ["points", (v) => Array.isArray(v) && v.every(isNumberPair), `points="[[1, 2], [3, 4]]"`],
            ["xDomain", (v) => isNumberPair(v) && (v as number[])[0] < (v as number[])[1], `xDomain="[-4, 4]"`],
            ["yDomain", (v) => isNumberPair(v) && (v as number[])[0] < (v as number[])[1], `yDomain="[-5, 8]"`],
          ];
          for (const [prop, ok, example] of checks) {
            const raw = attr(prop);
            if (typeof raw === "string" && !ok(parseJson(raw))) {
              add("error", `<FunctionPlot ${prop}="${raw}"> isn't valid. Use quoted JSON like ${example}.`, line);
            }
          }
          const height = attr("height");
          if (typeof height === "string" && !(Number(height) > 0)) {
            add("warning", `<FunctionPlot height="${height}"> should be a number of pixels, e.g. height="400".`, line);
          }
        }

        if (name === "CloudinaryImg" && attr("src") === undefined) {
          add("error", `<CloudinaryImg> needs a src.`, line);
        }
        break;
      }
      default:
        break;
    }
  });

  return { images, readingMinutes: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)) };
}

// ---------------------------------------------------------------------------
// One note file
// ---------------------------------------------------------------------------
function parseVideo(value: unknown, rel: string, issues: Issue[]): VideoMeta | null {
  if (value === undefined || value === null || value === "") return null;
  const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : typeof v === "number" ? String(v) : null);
  const obj = isObject(value) ? value : { url: value };
  const source = text(obj.url) ?? text(obj.id);
  const id = parseYouTubeId(source);
  if (!id) {
    issues.push({ level: "error", file: rel, message: `video: "${source ?? ""}" isn't a valid YouTube link.` });
    return null;
  }
  return { id, title: text(obj.title), author: text(obj.author), duration: text(obj.duration) };
}

function parseNote(file: string, unitDir: string, notesRoot: string, position: number, issues: Issue[]): ParsedNote | null {
  const rel = path.relative(notesRoot, file).split(path.sep).join("/");
  const fm = frontmatter(file, rel, issues);
  if (!fm) return null;
  const before = issues.length;
  const { data, content, lineOffset } = fm;
  const baseName = path.basename(file, ".md");
  const prefixed = baseName.match(/^(\d+)[-_ ]*(.*)$/);

  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) issues.push({ level: "error", file: rel, message: `Missing "title:" in the header (between the --- lines at the top).` });

  const slug =
    typeof data.slug === "string" && data.slug.trim()
      ? data.slug.trim()
      : slugify(prefixed ? prefixed[2] : baseName) || slugify(title);
  if (!SLUG.test(slug)) issues.push({ level: "error", file: rel, message: `Slug "${slug}" must be lowercase letters, numbers and hyphens (e.g. "chain-rule").` });

  let order = position * 10 + 1000;
  if (data.order !== undefined) {
    if (typeof data.order === "number" && Number.isFinite(data.order)) order = data.order;
    else issues.push({ level: "error", file: rel, message: `"order:" must be a number.` });
  } else if (prefixed) {
    order = Number(prefixed[1]);
  } else {
    issues.push({ level: "warning", file: rel, message: `No order. Name the file like 01-${baseName}.md (or add "order: 1") so topics appear in the right sequence.` });
  }

  let summary: string | null = null;
  if (typeof data.summary === "string" && data.summary.trim()) {
    summary = data.summary.trim();
    if (summary.length > 140) issues.push({ level: "warning", file: rel, message: `Summary is ${summary.length} characters; it's shown on one line, so keep it under about 140.` });
  } else {
    issues.push({ level: "warning", file: rel, message: `No "summary:" (a one-line description shown on the unit page).` });
  }

  const video = parseVideo(data.video, rel, issues);

  if (!content.trim()) issues.push({ level: "warning", file: rel, message: "The note body is empty." });
  const { images, readingMinutes } = validateBody(content, { rel, noteDir: path.dirname(file), notesRoot, lineOffset }, issues);

  if (issues.slice(before).some((i) => i.level === "error") && !title) return null;
  return { file, rel, slug, title, order, summary, video, body: content, images, readingMinutes };
}

// ---------------------------------------------------------------------------
// _unit.md
// ---------------------------------------------------------------------------
function parseUnitFile(file: string, notesRoot: string, unitDir: string, issues: Issue[]): UnitFileMeta | null {
  const rel = path.relative(notesRoot, file).split(path.sep).join("/");
  const fm = frontmatter(file, rel, issues);
  if (!fm) return null;
  const d = fm.data;
  const err = (message: string) => issues.push({ level: "error", file: rel, message });
  const meta: UnitFileMeta = {};

  const str = (key: string): string | undefined => {
    if (d[key] === undefined) return undefined;
    if (typeof d[key] === "string") return (d[key] as string).trim();
    err(`"${key}:" must be text. Put it in quotes if it contains a colon.`);
    return undefined;
  };
  meta.code = str("code");
  meta.title = str("title");
  meta.description = str("description");
  meta.exam_tip = str("exam_tip");

  if (d.year !== undefined) {
    if (typeof d.year === "number" && [1, 2, 3, 4].includes(d.year)) meta.year = d.year;
    else err(`"year:" must be 1, 2, 3 or 4.`);
  }
  if (d.semester !== undefined) {
    if (d.semester === 1 || d.semester === 2) meta.semester = d.semester;
    else err(`"semester:" must be 1 or 2.`);
  }
  if (d.category !== undefined) {
    if (["pure_math", "computer_science", "applied_math"].includes(String(d.category))) meta.category = d.category as UnitFileMeta["category"];
    else err(`"category:" must be pure_math, computer_science or applied_math.`);
  }
  if (d.color !== undefined) {
    if (["butter", "lilac", "ice", "charcoal"].includes(String(d.color))) meta.color = d.color as UnitFileMeta["color"];
    else err(`"color:" must be butter, lilac, ice or charcoal.`);
  }
  if (d.order !== undefined) {
    if (typeof d.order === "number") meta.order = d.order;
    else err(`"order:" must be a number.`);
  }

  if (d.resources !== undefined) {
    if (!Array.isArray(d.resources)) {
      err(`"resources:" must be a list.`);
    } else {
      const specs: ResourceSpec[] = [];
      const seen = new Set<string>();
      d.resources.forEach((entry: unknown, i: number) => {
        const label = `resources item ${i + 1}`;
        if (!isObject(entry) || typeof entry.title !== "string" || typeof entry.file !== "string" || typeof entry.category !== "string") {
          return err(`${label} needs title, category and file.`);
        }
        if (!RESOURCE_CATEGORIES.includes(entry.category)) return err(`${label}: category must be ${RESOURCE_CATEGORIES.join(", ")}.`);
        if (seen.has(entry.title)) return err(`${label}: duplicate title "${entry.title}".`);
        seen.add(entry.title);
        const abs = path.resolve(unitDir, entry.file);
        if (!insideDir(abs, notesRoot)) return err(`${label}: "${entry.file}" points outside the notes folder.`);
        if (!RESOURCE_EXTS.has(path.extname(abs).toLowerCase())) return err(`${label}: "${entry.file}" isn't a supported file type (${[...RESOURCE_EXTS].join(" ")}).`);
        if (!fs.existsSync(abs)) return err(`${label}: file not found: ${entry.file}`);
        specs.push({ title: entry.title, category: entry.category as ResourceCategory, file: entry.file, absPath: abs });
      });
      meta.resources = specs;
    }
  }
  return meta;
}

// ---------------------------------------------------------------------------
// One unit folder
// ---------------------------------------------------------------------------
export function parseUnit(unitDir: string, notesRoot: string, issues: Issue[]): ParsedUnit {
  const slug = path.basename(unitDir);
  if (!SLUG.test(slug)) {
    issues.push({ level: "error", file: slug, message: `Folder name "${slug}" must be a unit slug: lowercase letters, numbers, hyphens (e.g. "calculus-1").` });
  }

  const unitFile = path.join(unitDir, "_unit.md");
  const meta = fs.existsSync(unitFile) ? parseUnitFile(unitFile, notesRoot, unitDir, issues) : null;

  const files = fs
    .readdirSync(unitDir)
    .filter((f) => f.toLowerCase().endsWith(".md") && !f.startsWith("_"))
    .sort();

  const notes: ParsedNote[] = [];
  files.forEach((f, i) => {
    const note = parseNote(path.join(unitDir, f), unitDir, notesRoot, i, issues);
    if (note) notes.push(note);
  });

  const bySlug = new Map<string, ParsedNote>();
  for (const note of notes) {
    const other = bySlug.get(note.slug);
    if (other) issues.push({ level: "error", file: note.rel, message: `Same slug "${note.slug}" as ${other.rel}. Give one a different slug.` });
    else bySlug.set(note.slug, note);
  }
  return { slug, dir: unitDir, meta, notes };
}
