export interface DbAcademicYear {
  id: string;
  year_number: number;
  slug: string;
  title: string;
  description: string;
}

export interface DbUnit {
  id: string;
  year_id: string;
  code: string;
  slug: string;
  title: string;
  color_variant: "butter" | "lilac" | "ice" | "charcoal";
  semester: 1 | 2;
  category: "pure_math" | "computer_science" | "applied_math";
  description: string;
  exam_tip: string | null;
  order_index: number;
}

export interface DbSubtopic {
  id: string;
  unit_id: string;
  slug: string;
  title: string;
  order_index: number;
  content_markdown: string;
  youtube_id: string | null;
  youtube_title: string | null;
  youtube_author: string | null;
  youtube_duration: string | null;
  summary: string | null;
  reading_minutes: number | null;
}

export interface DbResource {
  id: string;
  unit_id: string;
  subtopic_id: string | null;
  title: string;
  category: "past_paper" | "lecture_slide" | "tutorial_sheet";
  file_url: string;
  file_size: string | null;
}

// unstable_cache keeps results at the data-cache level so a new visitor doesn't
// trigger fresh Supabase queries. IMPORTANT: it caches whatever the function
// returns, including `null`. If a lookup miss were returned as null, a single
// early miss (table not created yet, content not seeded yet) would stay cached
// for the whole revalidate window and keep 404-ing after the data exists.
// So inside the cached functions we THROW on misses/errors (thrown errors are
// never cached) and convert "not found" back to null outside the cache.

import { createServerClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

class CurriculumNotFound extends Error {}

type SupabaseError = { message: string; code?: string } | null;

function failOnError(error: SupabaseError, context: string): void {
  if (error) {
    // Real database problem (missing table, bad key, RLS...): surface it loudly.
    throw new Error(`[curriculum] ${context}: ${error.message}`);
  }
}

async function nullOnMiss<T>(run: () => Promise<T>): Promise<T | null> {
  try {
    return await run();
  } catch (err) {
    if (err instanceof CurriculumNotFound) return null;
    throw err;
  }
}

const cacheOptions = { revalidate: 3600, tags: ["curriculum"] };

// Fetch Year Hub details and all related units
const fetchYear = unstable_cache(
  async (yearSlug: string) => {
    const supabase = createServerClient();

    const { data: year, error: yearError } = await supabase
      .from("academic_years")
      .select("*")
      .eq("slug", yearSlug)
      .maybeSingle();

    failOnError(yearError, `academic_years lookup for "${yearSlug}"`);
    if (!year) throw new CurriculumNotFound();

    const { data: units, error: unitsError } = await supabase
      .from("units")
      .select("*, subtopics(count)")
      .eq("year_id", year.id)
      .order("order_index", { ascending: true });

    failOnError(unitsError, `units lookup for year "${yearSlug}"`);

    return {
      year: year as DbAcademicYear,
      units: (units || []) as (DbUnit & { subtopics: [{ count: number }] })[],
    };
  },
  ["year-by-slug"],
  cacheOptions,
);

export const getYearBySlug = (yearSlug: string) =>
  nullOnMiss(() => fetchYear(yearSlug));

// Fetch a single Unit and its list of subtopics & downloadable resources
const fetchUnitDetails = unstable_cache(
  async (unitSlug: string) => {
    const supabase = createServerClient();

    const { data: unit, error: unitError } = await supabase
      .from("units")
      .select("*, academic_years(slug, title)")
      .eq("slug", unitSlug)
      .maybeSingle();

    failOnError(unitError, `units lookup for "${unitSlug}"`);
    if (!unit) throw new CurriculumNotFound();

    const [subtopicsRes, resourcesRes] = await Promise.all([
      supabase
        .from("subtopics")
        .select(
          "id, slug, title, order_index, summary, reading_minutes, youtube_id, youtube_duration",
        )
        .eq("unit_id", unit.id)
        .order("order_index", { ascending: true }),

      supabase
        .from("resources")
        .select("*")
        .eq("unit_id", unit.id)
        .order("created_at", { ascending: false }),
    ]);

    failOnError(subtopicsRes.error, `subtopics for unit "${unitSlug}"`);
    failOnError(resourcesRes.error, `resources for unit "${unitSlug}"`);

    return {
      unit: unit as DbUnit & {
        academic_years: { slug: string; title: string };
      },
      subtopics: (subtopicsRes.data || []) as DbSubtopic[],
      resources: (resourcesRes.data || []) as DbResource[],
    };
  },
  ["unit-details"],
  cacheOptions,
);

export const getUnitDetails = (unitSlug: string) =>
  nullOnMiss(() => fetchUnitDetails(unitSlug));

// Fetch a specific subtopic reading view + sibling subtopics for sidebar & pagination
const fetchSubtopicWorkspace = unstable_cache(
  async (unitSlug: string, subtopicSlug: string) => {
    const supabase = createServerClient();

    const { data: unit, error: unitError } = await supabase
      .from("units")
      .select("id, code, title, slug")
      .eq("slug", unitSlug)
      .maybeSingle();

    failOnError(unitError, `units lookup for "${unitSlug}"`);
    if (!unit) throw new CurriculumNotFound();

    // All subtopics for sidebar ordering and sibling linking
    const { data: allSubtopics, error: listError } = await supabase
      .from("subtopics")
      .select("id, slug, title, order_index")
      .eq("unit_id", unit.id)
      .order("order_index", { ascending: true });

    failOnError(listError, `subtopic list for "${unitSlug}"`);

    // The target subtopic's full markdown content and video
    const { data: currentTopic, error: subtopicError } = await supabase
      .from("subtopics")
      .select("*")
      .eq("unit_id", unit.id)
      .eq("slug", subtopicSlug)
      .maybeSingle();

    failOnError(subtopicError, `subtopic "${subtopicSlug}"`);
    if (!currentTopic) throw new CurriculumNotFound();

    return {
      unit,
      currentTopic: currentTopic as DbSubtopic,
      syllabusTree: (allSubtopics || []) as Array<{
        id: string;
        slug: string;
        title: string;
        order_index: number;
      }>,
    };
  },
  ["subtopic-workspace"],
  cacheOptions,
);

export const getSubtopicWorkspace = (unitSlug: string, subtopicSlug: string) =>
  nullOnMiss(() => fetchSubtopicWorkspace(unitSlug, subtopicSlug));
