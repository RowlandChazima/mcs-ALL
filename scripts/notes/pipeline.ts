import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { parseUnit, slugify } from "./parse";
import type { DbResourceRow, DbSubtopicRow, Store, UnitRecord, UnitWrite } from "./store";
import type { Issue, ParsedNote, ParsedUnit } from "./types";

export type Mode = "check" | "dry" | "push";

export interface PipelineOptions {
  notesDir: string;
  mode: Mode;
  store?: Store; // required unless mode === "check"
  prune?: boolean;
  onlyUnit?: string;
  lookupVideo?: (id: string) => Promise<{ title: string | null; author: string | null } | null>;
  revalidate?: () => Promise<{ ok: boolean; message: string }>;
  log?: (line: string) => void;
}

export interface Report {
  ok: boolean;
  errors: number;
  warnings: number;
  created: number;
  updated: number;
  unchanged: number;
  deleted: number;
}

const YEAR_WORDS = ["First", "Second", "Third", "Fourth"];
const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
};

const sha = (buf: Buffer) => crypto.createHash("sha1").update(buf).digest("hex").slice(0, 10);

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Phone photos are huge. Straighten them (EXIF rotation), cap the width, and
 *  store as WebP. PNGs (screenshots, diagrams) stay pixel-perfect (lossless). */
export async function prepareImage(original: Buffer, ext: string): Promise<{ buffer: Buffer; contentType: string }> {
  if (ext === ".svg") return { buffer: original, contentType: "image/svg+xml" };
  if (ext === ".gif") return { buffer: original, contentType: "image/gif" };
  const pipeline = sharp(original, { failOn: "none" }).rotate().resize({ width: 1600, withoutEnlargement: true });
  const buffer = await (ext === ".png" ? pipeline.webp({ lossless: true }) : pipeline.webp({ quality: 82 })).toBuffer();
  return { buffer, contentType: "image/webp" };
}

function imagePlan(abs: string, unitSlug: string, store: Store) {
  const original = fs.readFileSync(abs);
  const ext = path.extname(abs).toLowerCase();
  const outExt = ext === ".svg" || ext === ".gif" ? ext : ".webp";
  const base = slugify(path.basename(abs, ext)).slice(0, 40) || "image";
  const storagePath = `notes/${unitSlug}/${sha(original)}-${base}${outExt}`;
  return { abs, ext, original, storagePath, url: store.publicUrl(storagePath) };
}

function printIssues(issues: Issue[], log: (s: string) => void) {
  for (const issue of issues) {
    const where = issue.line ? `${issue.file}:${issue.line}` : issue.file;
    log(`  ${issue.level === "error" ? "[x]" : "[!]"} ${where}  ${issue.message}`);
  }
}

export async function runPipeline(opts: PipelineOptions): Promise<Report> {
  const log = opts.log ?? ((line: string) => console.log(line));
  const report: Report = { ok: true, errors: 0, warnings: 0, created: 0, updated: 0, unchanged: 0, deleted: 0 };
  const fail = (n = 1): Report => ({ ...report, ok: false, errors: report.errors + n });

  if (!fs.existsSync(opts.notesDir)) {
    log(`[x] Notes folder not found: ${opts.notesDir}`);
    return fail();
  }

  const names = fs
    .readdirSync(opts.notesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map((d) => d.name)
    .sort();
  const selected = opts.onlyUnit ? names.filter((n) => n === opts.onlyUnit) : names;
  if (selected.length === 0) {
    log(opts.onlyUnit ? `[x] No folder notes/${opts.onlyUnit}` : "[x] No unit folders found in notes/ (create notes/<unit-slug>/).");
    return fail();
  }

  // ---- 1. read + validate everything (no network) -------------------------
  log("Checking notes...");
  const issues: Issue[] = [];
  const units = selected.map((n) => parseUnit(path.join(opts.notesDir, n), opts.notesDir, issues));
  printIssues(issues, log);
  report.errors = issues.filter((i) => i.level === "error").length;
  report.warnings = issues.filter((i) => i.level === "warning").length;
  const noteCount = units.reduce((n, u) => n + u.notes.length, 0);
  log(`\n${units.length} unit(s), ${noteCount} note(s): ${report.errors} error(s), ${report.warnings} warning(s).`);

  if (report.errors > 0) {
    log("Fix the errors above and run again. Nothing was sent to the database.");
    return { ...report, ok: false };
  }
  if (opts.mode === "check") {
    log("All notes look good.");
    return report;
  }

  const store = opts.store;
  if (!store) throw new Error("A store is required to push notes.");

  // ---- 2. pre-flight (reads only) ----------------------------------------
  const existing = new Map<string, UnitRecord | null>();
  const preflight: Issue[] = [];
  for (const unit of units) {
    const rec = await store.findUnit(unit.slug);
    existing.set(unit.slug, rec);
    if (!rec) {
      const m = unit.meta;
      const missing = (["code", "title", "year", "semester", "category"] as const).filter((k) => m?.[k] === undefined);
      if (!m) {
        preflight.push({ level: "error", file: unit.slug, message: `Unit "${unit.slug}" isn't in the database yet. Add notes/${unit.slug}/_unit.md (see notes/_UNIT_TEMPLATE.md).` });
      } else if (missing.length) {
        preflight.push({ level: "error", file: `${unit.slug}/_unit.md`, message: `New unit needs: ${missing.join(", ")}.` });
      }
    }
  }
  if (preflight.length) {
    printIssues(preflight, log);
    log("Nothing was sent to the database.");
    return fail(preflight.length);
  }

  // ---- 3. sync each unit --------------------------------------------------
  const dry = opts.mode === "dry";
  log(dry ? "\nDRY RUN: showing what would happen, changing nothing.\n" : "\nPushing...\n");
  for (const unit of units) {
    await syncUnit(unit, existing.get(unit.slug) ?? null, store, { dry, prune: Boolean(opts.prune), lookupVideo: opts.lookupVideo, log }, report);
  }

  // ---- 4. refresh the site ------------------------------------------------
  const changedAnything = report.created + report.updated + report.deleted > 0;
  if (!dry && changedAnything && opts.revalidate) {
    const result = await opts.revalidate();
    log(`\n${result.ok ? "[ok]" : "[!]"} ${result.message}`);
  }

  log(
    `\n${dry ? "Would change" : "Done"}: ${report.created} new, ${report.updated} updated, ${report.unchanged} unchanged` +
      (report.deleted ? `, ${report.deleted} ${dry ? "to delete" : "deleted"}` : "") +
      ".",
  );
  return report;
}

interface SyncOptions {
  dry: boolean;
  prune: boolean;
  lookupVideo?: PipelineOptions["lookupVideo"];
  log: (line: string) => void;
}

async function syncUnit(unit: ParsedUnit, existingUnit: UnitRecord | null, store: Store, o: SyncOptions, report: Report) {
  const { dry, log } = o;
  let rec = existingUnit;
  log(unit.slug);

  // ---- unit row (only when notes/<unit>/_unit.md exists) ----
  if (unit.meta) {
    const m = unit.meta;
    let yearId = rec?.year_id ?? null;
    if (m.year !== undefined) {
      const year = await store.findYear(m.year);
      if (year) yearId = year.id;
      else if (dry) log(`  would create year ${m.year}`);
      else {
        yearId = (await store.createYear(m.year, `year-${m.year}`, `${YEAR_WORDS[m.year - 1]} Year Curriculum`)).id;
        log(`  + created year ${m.year}`);
      }
    }
    const write: UnitWrite = { slug: unit.slug };
    if (yearId) write.year_id = yearId;
    if (m.code !== undefined) write.code = m.code;
    if (m.title !== undefined) write.title = m.title;
    if (m.color !== undefined) write.color_variant = m.color;
    if (m.semester !== undefined) write.semester = m.semester;
    if (m.category !== undefined) write.category = m.category;
    if (m.description !== undefined) write.description = m.description;
    if (m.exam_tip !== undefined) write.exam_tip = m.exam_tip;
    if (m.order !== undefined) write.order_index = m.order;
    else if (!rec) write.order_index = yearId ? await store.nextUnitOrder(yearId) : 1;

    const existed = Boolean(rec);
    const differs = !rec || Object.entries(write).some(([k, v]) => (rec as unknown as Record<string, unknown>)[k] !== v);
    if (differs) {
      if (dry) log(`  would ${existed ? "update the unit details" : "create the unit"}`);
      else {
        rec = await store.upsertUnit(write);
        log(`  ${existed ? "~ updated unit details" : "+ created the unit"}`);
      }
    } else {
      log("  = unit details unchanged");
    }
  }

  // ---- notes ----
  const dbRows = rec ? await store.listSubtopics(rec.id) : [];
  const dbBySlug = new Map(dbRows.map((r) => [r.slug, r]));
  const uploaded = new Set<string>();
  const toWrite: DbSubtopicRow[] = [];

  const sorted = [...unit.notes].sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  for (const note of sorted) {
    const { body, plans } = rewriteImages(note, unit.slug, store);
    const dbRow = dbBySlug.get(note.slug);
    const video = await resolveVideo(note, dbRow, o);

    const row: DbSubtopicRow = {
      slug: note.slug,
      title: note.title,
      order_index: note.order,
      summary: note.summary,
      reading_minutes: note.readingMinutes,
      content_markdown: body,
      youtube_id: note.video?.id ?? null,
      youtube_title: video.title,
      youtube_author: video.author,
      youtube_duration: video.duration,
    };

    const status = !dbRow ? "new" : (Object.keys(row) as Array<keyof DbSubtopicRow>).some((k) => row[k] !== dbRow[k]) ? "updated" : "unchanged";
    const extras = [plans.length ? `${plans.length} image${plans.length > 1 ? "s" : ""}` : "", note.video ? "intro video" : ""].filter(Boolean).join(", ");
    const label = status === "new" ? "+ new      " : status === "updated" ? "~ updated  " : "= unchanged";
    log(`  ${dry && status !== "unchanged" ? "would be " : ""}${label} ${path.basename(note.file)}${extras ? `  (${extras})` : ""}`);

    if (status === "unchanged") {
      report.unchanged++;
      continue;
    }
    if (status === "new") report.created++;
    else report.updated++;
    if (dry) continue;

    // Images first: a note is only saved once everything it shows is online.
    for (const plan of plans) {
      if (uploaded.has(plan.storagePath)) continue;
      const prepared = await prepareImage(plan.original, plan.ext);
      await store.upload(plan.storagePath, prepared.buffer, prepared.contentType);
      uploaded.add(plan.storagePath);
      log(`      uploaded ${path.basename(plan.abs)}  ${formatSize(plan.original.length)} -> ${formatSize(prepared.buffer.length)}`);
    }
    toWrite.push(row);
  }
  if (rec && toWrite.length) await store.upsertSubtopics(rec.id, toWrite);

  // notes that exist in the database but no longer have a file
  const localSlugs = new Set(unit.notes.map((n) => n.slug));
  const orphans = dbRows.filter((r) => !localSlugs.has(r.slug)).map((r) => r.slug);
  if (orphans.length) {
    if (o.prune) {
      log(`  ${dry ? "would delete" : "- deleted"} from database: ${orphans.join(", ")}`);
      if (!dry && rec) await store.deleteSubtopics(rec.id, orphans);
      report.deleted += orphans.length;
    } else {
      log(`  note: in the database but no file here: ${orphans.join(", ")} (add --prune to delete)`);
    }
  }

  // ---- downloads (only when _unit.md has a resources: list) ----
  if (unit.meta?.resources) {
    const dbRes = rec ? await store.listResources(rec.id) : [];
    const dbByTitle = new Map(dbRes.map((r) => [r.title, r]));
    const rows: DbResourceRow[] = [];
    for (const spec of unit.meta.resources) {
      const data = fs.readFileSync(spec.absPath);
      const ext = path.extname(spec.absPath).toLowerCase();
      const storagePath = `resources/${unit.slug}/${sha(data)}-${slugify(path.basename(spec.absPath, ext)).slice(0, 40) || "file"}${ext}`;
      const row: DbResourceRow = { title: spec.title, category: spec.category, file_url: store.publicUrl(storagePath), file_size: formatSize(data.length) };
      const current = dbByTitle.get(spec.title);
      const changed = !current || (Object.keys(row) as Array<keyof DbResourceRow>).some((k) => row[k] !== current[k]);
      log(`  ${changed ? (dry ? "would be " : "") + (current ? "~ updated  " : "+ new      ") : "= unchanged"} download: ${spec.title}  (${row.file_size})`);
      if (!changed) continue;
      if (!dry) {
        await store.upload(storagePath, data, CONTENT_TYPES[ext] ?? "application/octet-stream");
        rows.push(row);
      }
    }
    if (rec && rows.length) await store.upsertResources(rec.id, rows);

    const keep = new Set(unit.meta.resources.map((r) => r.title));
    const resOrphans = dbRes.filter((r) => !keep.has(r.title)).map((r) => r.title);
    if (resOrphans.length) {
      if (o.prune) {
        log(`  ${dry ? "would delete" : "- deleted"} downloads: ${resOrphans.join(", ")}`);
        if (!dry && rec) await store.deleteResources(rec.id, resOrphans);
        report.deleted += resOrphans.length;
      } else {
        log(`  note: downloads in the database but not in _unit.md: ${resOrphans.join(", ")} (add --prune to delete)`);
      }
    }
  }
}

/** Swap local image paths for their final public URLs (deterministic, so no
 *  upload is needed just to find out whether a note changed). */
function rewriteImages(note: ParsedNote, unitSlug: string, store: Store) {
  let body = note.body;
  const plans: ReturnType<typeof imagePlan>[] = [];
  const seen = new Map<string, ReturnType<typeof imagePlan>>();
  for (const ref of [...note.images].sort((a, b) => b.start - a.start)) {
    let plan = seen.get(ref.absPath);
    if (!plan) {
      plan = imagePlan(ref.absPath, unitSlug, store);
      seen.set(ref.absPath, plan);
      plans.push(plan);
    }
    const slice = body.slice(ref.start, ref.end);
    const needle = `](${ref.url}`;
    const at = slice.indexOf(needle);
    if (at === -1) throw new Error(`Could not rewrite the image ${ref.url} in ${note.rel}`);
    body = body.slice(0, ref.start) + slice.slice(0, at) + `](${plan.url}` + slice.slice(at + needle.length) + body.slice(ref.end);
  }
  return { body, plans };
}

async function resolveVideo(note: ParsedNote, dbRow: DbSubtopicRow | undefined, o: SyncOptions) {
  const v = note.video;
  if (!v) return { title: null, author: null, duration: null };
  let { title, author } = v;
  let duration = v.duration;
  const sameVideo = dbRow?.youtube_id === v.id;
  if (sameVideo) {
    title ??= dbRow?.youtube_title ?? null;
    author ??= dbRow?.youtube_author ?? null;
    duration ??= dbRow?.youtube_duration ?? null;
  }
  if ((!title || !author) && o.lookupVideo) {
    const info = await o.lookupVideo(v.id).catch(() => null);
    if (info) {
      title ??= info.title;
      author ??= info.author;
    } else {
      o.log(`  [!] ${note.rel}: couldn't look up the video's title online; add "title:" and "author:" under video: if you want them shown.`);
    }
  }
  return { title: title ?? null, author: author ?? null, duration };
}
