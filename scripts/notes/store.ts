import { createClient } from "@supabase/supabase-js";
import type { ResourceCategory } from "./types";

export interface DbSubtopicRow {
  slug: string;
  title: string;
  order_index: number;
  summary: string | null;
  reading_minutes: number | null;
  content_markdown: string;
  youtube_id: string | null;
  youtube_title: string | null;
  youtube_author: string | null;
  youtube_duration: string | null;
}

export interface DbResourceRow {
  title: string;
  category: ResourceCategory;
  file_url: string;
  file_size: string | null;
}

export interface UnitRecord {
  id: string;
  slug: string;
  order_index: number;
  year_id: string | null;
  code: string | null;
  title: string | null;
  color_variant: string | null;
  semester: number | null;
  category: string | null;
  description: string | null;
  exam_tip: string | null;
}

export type UnitWrite = Partial<Omit<UnitRecord, "id">> & { slug: string };

// Everything the pipeline needs from the outside world. The real version talks
// to Supabase; the self-test uses an in-memory copy.
export interface Store {
  findUnit(slug: string): Promise<UnitRecord | null>;
  findYear(yearNumber: number): Promise<{ id: string } | null>;
  createYear(yearNumber: number, slug: string, title: string): Promise<{ id: string }>;
  nextUnitOrder(yearId: string): Promise<number>;
  upsertUnit(row: UnitWrite): Promise<UnitRecord>;
  listSubtopics(unitId: string): Promise<DbSubtopicRow[]>;
  upsertSubtopics(unitId: string, rows: DbSubtopicRow[]): Promise<void>;
  deleteSubtopics(unitId: string, slugs: string[]): Promise<void>;
  listResources(unitId: string): Promise<DbResourceRow[]>;
  upsertResources(unitId: string, rows: DbResourceRow[]): Promise<void>;
  deleteResources(unitId: string, titles: string[]): Promise<void>;
  /** Pure string building, no network. Same input always gives the same URL. */
  publicUrl(storagePath: string): string;
  /** Safe to call twice: an existing file at the same path is left alone. */
  upload(storagePath: string, data: Buffer, contentType: string): Promise<void>;
}

const UNIT_COLUMNS =
  "id, slug, order_index, year_id, code, title, color_variant, semester, category, description, exam_tip";
const SUBTOPIC_COLUMNS =
  "slug, title, order_index, summary, reading_minutes, content_markdown, youtube_id, youtube_title, youtube_author, youtube_duration";

export function createSupabaseStore(url: string, serviceRoleKey: string, bucket = "course-materials"): Store {
  const db = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

  function must<T>(res: { data: T | null; error: { message: string } | null }, what: string): T | null {
    if (res.error) throw new Error(`${what}: ${res.error.message}`);
    return res.data;
  }

  return {
    async findUnit(slug) {
      const res = await db.from("units").select(UNIT_COLUMNS).eq("slug", slug).maybeSingle();
      return must(res, `looking up unit "${slug}"`) as UnitRecord | null;
    },

    async findYear(yearNumber) {
      const res = await db.from("academic_years").select("id").eq("year_number", yearNumber).maybeSingle();
      return must(res, `looking up year ${yearNumber}`) as { id: string } | null;
    },

    async createYear(yearNumber, slug, title) {
      const res = await db
        .from("academic_years")
        .insert({ year_number: yearNumber, slug, title })
        .select("id")
        .single();
      return must(res, `creating year ${yearNumber}`) as { id: string };
    },

    async nextUnitOrder(yearId) {
      const res = await db
        .from("units")
        .select("order_index")
        .eq("year_id", yearId)
        .order("order_index", { ascending: false })
        .limit(1);
      const rows = (must(res, "reading unit order") ?? []) as Array<{ order_index: number | null }>;
      return (rows[0]?.order_index ?? 0) + 1;
    },

    async upsertUnit(row) {
      const res = await db.from("units").upsert(row, { onConflict: "slug" }).select(UNIT_COLUMNS).single();
      return must(res, `saving unit "${row.slug}"`) as UnitRecord;
    },

    async listSubtopics(unitId) {
      const res = await db.from("subtopics").select(SUBTOPIC_COLUMNS).eq("unit_id", unitId);
      return (must(res, "reading existing notes") ?? []) as DbSubtopicRow[];
    },

    async upsertSubtopics(unitId, rows) {
      if (rows.length === 0) return;
      const now = new Date().toISOString();
      const res = await db
        .from("subtopics")
        .upsert(
          rows.map((r) => ({ ...r, unit_id: unitId, updated_at: now })),
          { onConflict: "unit_id,slug" },
        );
      must(res, "saving notes");
    },

    async deleteSubtopics(unitId, slugs) {
      if (slugs.length === 0) return;
      const res = await db.from("subtopics").delete().eq("unit_id", unitId).in("slug", slugs);
      must(res, "deleting notes");
    },

    async listResources(unitId) {
      const res = await db.from("resources").select("title, category, file_url, file_size").eq("unit_id", unitId);
      return (must(res, "reading existing downloads") ?? []) as DbResourceRow[];
    },

    async upsertResources(unitId, rows) {
      if (rows.length === 0) return;
      const res = await db
        .from("resources")
        .upsert(
          rows.map((r) => ({ ...r, unit_id: unitId })),
          { onConflict: "unit_id,title" },
        );
      must(res, "saving downloads");
    },

    async deleteResources(unitId, titles) {
      if (titles.length === 0) return;
      const res = await db.from("resources").delete().eq("unit_id", unitId).in("title", titles);
      must(res, "deleting downloads");
    },

    publicUrl(storagePath) {
      return db.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
    },

    async upload(storagePath, data, contentType) {
      const { error } = await db.storage.from(bucket).upload(storagePath, data, { contentType, upsert: false });
      if (!error) return;
      const text = `${error.message} ${(error as { statusCode?: string }).statusCode ?? ""}`;
      if (/already exists|duplicate|409/i.test(text)) return; // same content, already uploaded
      throw new Error(`uploading ${storagePath}: ${error.message}`);
    },
  };
}
