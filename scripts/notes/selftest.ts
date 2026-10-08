// Run with:  pnpm notes:selftest
// Builds a throwaway notes folder, then checks that the pipeline rejects bad
// notes and pushes good ones correctly, against an in-memory fake database.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { parseUnit } from "./parse";
import { runPipeline } from "./pipeline";
import type { DbResourceRow, DbSubtopicRow, Store, UnitRecord, UnitWrite } from "./store";
import type { Issue } from "./types";

// ---------------- in-memory fake of Supabase ----------------
class FakeStore implements Store {
  years = new Map<number, { id: string; slug: string; title: string }>();
  units = new Map<string, UnitRecord>();
  subs = new Map<string, Map<string, DbSubtopicRow>>();
  res = new Map<string, Map<string, DbResourceRow>>();
  files = new Map<string, { data: Buffer; contentType: string }>();
  uploadCalls = 0;
  writes = 0;
  private n = 0;
  private id = () => `id-${++this.n}`;

  async findUnit(slug: string) { return this.units.get(slug) ?? null; }
  async findYear(y: number) { return this.years.get(y) ?? null; }
  async createYear(y: number, slug: string, title: string) { this.writes++; const row = { id: this.id(), slug, title }; this.years.set(y, row); return row; }
  async nextUnitOrder() { return this.units.size + 1; }
  async upsertUnit(row: UnitWrite) {
    this.writes++;
    const prev = this.units.get(row.slug);
    const rec = { id: prev?.id ?? this.id(), order_index: 0, year_id: null, code: null, title: null, color_variant: null, semester: null, category: null, description: null, exam_tip: null, ...prev, ...row } as UnitRecord;
    this.units.set(row.slug, rec);
    return rec;
  }
  async listSubtopics(unitId: string) { return [...(this.subs.get(unitId)?.values() ?? [])].map((r) => ({ ...r })); }
  async upsertSubtopics(unitId: string, rows: DbSubtopicRow[]) { this.writes++; const m = this.subs.get(unitId) ?? new Map(); rows.forEach((r) => m.set(r.slug, { ...r })); this.subs.set(unitId, m); }
  async deleteSubtopics(unitId: string, slugs: string[]) { this.writes++; slugs.forEach((s) => this.subs.get(unitId)?.delete(s)); }
  async listResources(unitId: string) { return [...(this.res.get(unitId)?.values() ?? [])].map((r) => ({ ...r })); }
  async upsertResources(unitId: string, rows: DbResourceRow[]) { this.writes++; const m = this.res.get(unitId) ?? new Map(); rows.forEach((r) => m.set(r.title, { ...r })); this.res.set(unitId, m); }
  async deleteResources(unitId: string, titles: string[]) { this.writes++; titles.forEach((t) => this.res.get(unitId)?.delete(t)); }
  publicUrl(p: string) { return `https://fake.supabase.co/storage/v1/object/public/course-materials/${p}`; }
  async upload(p: string, data: Buffer, contentType: string) { this.uploadCalls++; if (!this.files.has(p)) this.files.set(p, { data, contentType }); }
}

// ---------------- tiny test runner ----------------
let failed = 0;
async function test(name: string, fn: () => Promise<void> | void) {
  try { await fn(); console.log(`  PASS  ${name}`); }
  catch (err) { failed++; console.log(`  FAIL  ${name}\n        ${err instanceof Error ? err.message : err}`); }
}

const root = fs.mkdtempSync(path.join(os.tmpdir(), "notes-selftest-"));
const write = (rel: string, text: string) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const noop = () => {};

async function main() {
  // ---- fixtures: one good unit ----
  const big = await sharp({ create: { width: 3200, height: 2400, channels: 3, background: { r: 200, g: 40, b: 40 } } }).jpeg().toBuffer();
  fs.mkdirSync(path.join(root, "calculus-1/images"), { recursive: true });
  fs.writeFileSync(path.join(root, "calculus-1/images/limit-graph.jpg"), big);
  fs.mkdirSync(path.join(root, "calculus-1/resources"), { recursive: true });
  fs.writeFileSync(path.join(root, "calculus-1/resources/cat1.pdf"), Buffer.from("%PDF-1.4 fake pdf"));
  write("calculus-1/_unit.md", `---\ncode: SMA 2100\ntitle: Calculus I\nyear: 1\nsemester: 1\ncategory: pure_math\ncolor: butter\ndescription: Limits and derivatives.\nexam_tip: Practise first principles.\nresources:\n  - title: CAT 1 (2024)\n    category: past_paper\n    file: resources/cat1.pdf\n---\n`);
  write("calculus-1/01-limits.md", `---\ntitle: Limits\nsummary: What a limit means.\nvideo: https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s\n---\n\nA limit is $\\lim_{x \\to a} f(x) = L$ when $0 < |x - a| < \\delta$.\n\n$$\\frac{f(x)}{g(x)}$$\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n![A graph of the limit](images/limit-graph.jpg)\n\n<FunctionPlot fns='["x^2", "x^3"]' xDomain="[-3, 3]" points="[[1, 1]]" title="Two curves" />\n\n<YouTube url="https://youtu.be/9bZkp7q19f0" title="Extra explanation" />\n\n<PillBadge variant="butter">Exam</PillBadge>\n`);
  write("calculus-1/02-derivatives.md", `---\ntitle: Derivatives\nsummary: Rates of change.\n---\n\nThe derivative is a rate of change.\n`);

  // ---- fixtures: one note per kind of mistake ----
  const bad: Record<string, string> = {
    "01-unknown-tag": `<Nope />`,
    "02-expression-prop": `<FunctionPlot fn="x^2" xDomain={[-3, 3]} />`,
    "03-bad-json": `<FunctionPlot fn="x^2" xDomain="-3 to 3" />`,
    "04-bad-formula": `Here: $\\notacommand{x}$`,
    "05-unclosed": `<PillBadge>never closed`,
    "06-missing-image": `![x](images/nope.png)`,
    "07-escapes-folder": `![x](../../../secret.png)`,
    "08-script": `<script>alert(1)</script>`,
    "09-bad-video": `<YouTube url="https://example.com/video" />`,
    "10-brace": `Some text with {oops} in it.`,
    "11-wrong-type": `![x](images/notes.txt)`,
  };
  fs.mkdirSync(path.join(root, "bad-unit/images"), { recursive: true });
  fs.writeFileSync(path.join(root, "bad-unit/images/notes.txt"), "not an image");
  for (const [name, body] of Object.entries(bad)) write(`bad-unit/${name}.md`, `---\ntitle: ${name}\nsummary: s\n---\n\n${body}\n`);
  write("bad-unit/12-no-title.md", `---\nsummary: no title here\n---\n\ntext\n`);

  console.log("\nValidation");
  const issues: Issue[] = [];
  parseUnit(path.join(root, "bad-unit"), root, issues);
  const errorsFor = (prefix: string) => issues.filter((i) => i.level === "error" && i.file.includes(prefix));
  for (const [name, expected] of [
    ["01-unknown-tag", /Unknown tag <Nope>/],
    ["02-expression-prop", /quoted string/],
    ["03-bad-json", /isn't valid/],
    ["04-bad-formula", /Formula problem/],
    ["05-unclosed", /./],
    ["06-missing-image", /not found/],
    ["07-escapes-folder", /outside the notes folder/],
    ["08-script", /isn't allowed/],
    ["09-bad-video", /valid YouTube link/],
    ["10-brace", /JavaScript in/],
    ["11-wrong-type", /supported image type/],
    ["12-no-title", /Missing "title:"/],
  ] as Array<[string, RegExp]>) {
    await test(`rejects ${name}`, () => {
      const found = errorsFor(name);
      assert.ok(found.length > 0, "no error was reported");
      assert.ok(found.some((e) => expected.test(e.message)), `got: ${found.map((e) => e.message).join(" | ")}`);
    });
  }
  await test("reports line numbers", () => {
    const e = errorsFor("01-unknown-tag")[0];
    assert.ok(e.line && e.line >= 5, `line was ${e.line}`);
  });
  const goodIssues: Issue[] = [];
  const goodUnit = parseUnit(path.join(root, "calculus-1"), root, goodIssues);
  await test("accepts the good unit with no errors", () => {
    assert.deepEqual(goodIssues.filter((i) => i.level === "error"), []);
    assert.equal(goodUnit.notes.length, 2);
    assert.equal(goodUnit.notes[0].slug, "limits");
    assert.equal(goodUnit.notes[0].video?.id, "dQw4w9WgXcQ");
    assert.equal(goodUnit.notes[0].images.length, 1);
  });

  console.log("\nPush flow");
  await test("bad notes: nothing is sent to the database", async () => {
    const store = new FakeStore();
    const r = await runPipeline({ notesDir: root, mode: "push", store, onlyUnit: "bad-unit", log: noop });
    assert.equal(r.ok, false);
    assert.equal(store.writes + store.uploadCalls, 0);
  });

  const store = new FakeStore();
  let lookups = 0, refreshes = 0;
  const run = (extra: Partial<Parameters<typeof runPipeline>[0]> = {}) =>
    runPipeline({
      notesDir: root, mode: "push", store, onlyUnit: "calculus-1", log: noop,
      lookupVideo: async () => { lookups++; return { title: "Stub Title", author: "Stub Channel" }; },
      revalidate: async () => { refreshes++; return { ok: true, message: "refreshed" }; },
      ...extra,
    });

  await test("first push creates unit, year, notes, image and download", async () => {
    const r = await run();
    assert.equal(r.ok, true);
    assert.equal(r.created, 2);
    const unit = store.units.get("calculus-1")!;
    assert.equal(unit.code, "SMA 2100");
    assert.ok(store.years.has(1));
    const rows = await store.listSubtopics(unit.id);
    const limits = rows.find((x) => x.slug === "limits")!;
    assert.ok(!limits.content_markdown.includes("](images/"), "relative image path was not rewritten");
    assert.match(limits.content_markdown, /\]\(https:\/\/fake\.supabase\.co\/.*limit-graph\.webp\)/);
    assert.equal(limits.youtube_id, "dQw4w9WgXcQ");
    assert.equal(limits.youtube_title, "Stub Title");
    assert.ok(limits.reading_minutes && limits.reading_minutes >= 1);
    assert.equal((await store.listResources(unit.id)).length, 1);
    assert.equal(refreshes, 1);
  });
  await test("image was compressed to WebP, max 1600px wide", async () => {
    const [p, file] = [...store.files.entries()].find(([k]) => k.includes("limit-graph"))!;
    assert.ok(p.endsWith(".webp"));
    const meta = await sharp(file.data).metadata();
    assert.equal(meta.format, "webp");
    assert.ok((meta.width ?? 9999) <= 1600, `width ${meta.width}`);
    assert.ok(file.data.length < big.length);
  });
  await test("PDF uploaded with the right content type", () => {
    const f = [...store.files.entries()].find(([k]) => k.endsWith(".pdf"));
    assert.ok(f && f[1].contentType === "application/pdf");
  });
  await test("second push changes nothing and uploads nothing", async () => {
    const uploadsBefore = store.uploadCalls, writesBefore = store.writes;
    const r = await run();
    assert.equal(r.created + r.updated, 0);
    assert.equal(r.unchanged, 2);
    assert.equal(store.uploadCalls, uploadsBefore);
    assert.equal(store.writes, writesBefore);
    assert.equal(refreshes, 1, "site was refreshed although nothing changed");
    assert.equal(lookups, 1, "video was looked up again");
  });
  await test("editing one note updates only that note and refreshes the site", async () => {
    write("calculus-1/02-derivatives.md", `---\ntitle: Derivatives\nsummary: Rates of change.\n---\n\nThe derivative is a rate of change. Now with more words.\n`);
    const r = await run();
    assert.equal(r.updated, 1);
    assert.equal(r.unchanged, 1);
    assert.equal(refreshes, 2);
  });
  await test("dry run reports changes but writes nothing", async () => {
    write("calculus-1/02-derivatives.md", `---\ntitle: Derivatives\nsummary: Rates of change.\n---\n\nChanged again for the dry run.\n`);
    const before = JSON.stringify([store.writes, store.uploadCalls]);
    const r = await run({ mode: "dry" });
    assert.equal(r.updated, 1);
    assert.equal(JSON.stringify([store.writes, store.uploadCalls]), before);
  });
  await test("a removed note stays in the database unless --prune", async () => {
    fs.unlinkSync(path.join(root, "calculus-1/02-derivatives.md"));
    const unit = store.units.get("calculus-1")!;
    await run();
    assert.equal((await store.listSubtopics(unit.id)).length, 2);
    const r = await run({ prune: true });
    assert.equal(r.deleted, 1);
    assert.equal((await store.listSubtopics(unit.id)).length, 1);
  });
  await test("Windows (CRLF) line endings are handled and not stored", async () => {
    write("calculus-1/03-windows.md", "---\r\ntitle: Windows note\r\nsummary: saved on Windows\r\n---\r\n\r\nLine one.\r\n\r\n$x^2$\r\n");
    const r = await run();
    assert.equal(r.ok, true);
    const row = (await store.listSubtopics(store.units.get("calculus-1")!.id)).find((x) => x.slug === "windows");
    assert.ok(row, "note was not saved");
    assert.ok(!row.content_markdown.includes("\r"), "carriage returns were stored");
  });
  await test("error messages are readable", () => {
    const sample: Issue[] = [];
    write("msgs/01-a.md", "---\ntitle: A\nsummary: s\n---\n\ntext {with braces}\n");
    write("msgs/02-b.md", "---\ntitle: B\nsummary: s\n---\n\n$\\notacommand{x}$\n");
    parseUnit(path.join(root, "msgs"), root, sample);
    const all = sample.map((i) => i.message).join(" | ");
    assert.ok(!/acorn/i.test(all), `still mentions acorn: ${all}`);
    assert.ok(/braces/.test(all), all);
    assert.ok(!/̲/.test(all), "KaTeX underline characters leaked into the message");
    assert.ok(/Undefined control sequence/.test(all), all);
  });
  await test("unknown unit without _unit.md is refused before any write", async () => {
    write("ghost-unit/01-a.md", `---\ntitle: A\nsummary: s\n---\n\ntext\n`);
    const fresh = new FakeStore();
    const r = await runPipeline({ notesDir: root, mode: "push", store: fresh, onlyUnit: "ghost-unit", log: noop });
    assert.equal(r.ok, false);
    assert.equal(fresh.writes, 0);
  });

  fs.rmSync(root, { recursive: true, force: true });
  console.log(failed ? `\n${failed} test(s) FAILED` : "\nAll tests passed.");
  process.exit(failed ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
