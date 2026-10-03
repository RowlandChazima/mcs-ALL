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

// unstable_cache to ensure  that queries are cached at the edge and doesnt cause the spamming for supabase queries when a new visitor comes in.

import { createServerClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

// Fetch Year Hub details and all related units
export const getYearBySlug = unstable_cache(
  async (yearSlug: string) => {
    const supabase = createServerClient();

    const { data: year, error: yearError } = await supabase
      .from("academic_years")
      .select("*")
      .eq("slug", yearSlug)
      .single();

    if (yearError || !year) return null;

    const { data: units } = await supabase
      .from("units")
      .select("*, subtopics(count)")
      .eq("year_id", year.id)
      .order("order_index", { ascending: true });

    return {
      year: year as DbAcademicYear,
      units: (units || []) as (DbUnit & { subtopics: [{ count: number }] })[],
    };
  },
  ["year-by-slug"],
  { revalidate: 3600, tags: ["curriculum"] },
);

// Fetch a single Unit and its list of subtopics & downloadable resources
export const getUnitDetails = unstable_cache(
  async (unitSlug: string) => {
    const supabase = createServerClient();

    const { data: unit, error: unitError } = await supabase
      .from("units")
      .select("*, academic_years(slug, title)")
      .eq("slug", unitSlug)
      .single();

    if (unitError || !unit) return null;

    const [{ data: subtopics }, { data: resources }] = await Promise.all([
      supabase
        .from("subtopics")
        .select("id, slug, title, order_index, youtube_id, youtube_duration")
        .eq("unit_id", unit.id)
        .order("order_index", { ascending: true }),

      supabase
        .from("resources")
        .select("*")
        .eq("unit_id", unit.id)
        .order("created_at", { ascending: false }),
    ]);

    return {
      unit: unit as DbUnit & {
        academic_years: { slug: string; title: string };
      },
      subtopics: (subtopics || []) as DbSubtopic[],
      resources: (resources || []) as DbResource[],
    };
  },
  ["unit-details"],
  { revalidate: 3600, tags: ["curriculum"] },
);

// Fetch a specific subtopic reading view + sibling subtopics for sidebar & pagination
export const getSubtopicWorkspace = unstable_cache(
  async (unitSlug: string, subtopicSlug: string) => {
    const supabase = createServerClient();

    const { data: unit, error: unitError } = await supabase
      .from("units")
      .select("id, code, title, slug")
      .eq("slug", unitSlug)
      .single();

    if (unitError || !unit) return null;

    // Get all subtopics for sidebar ordering and sibling linking
    const { data: allSubtopics } = await supabase
      .from("subtopics")
      .select("id, slug, title, order_index")
      .eq("unit_id", unit.id)
      .order("order_index", { ascending: true });

    // Fetch the target subtopic's full markdown content and video
    const { data: currentTopic, error: subtopicError } = await supabase
      .from("subtopics")
      .select("*")
      .eq("unit_id", unit.id)
      .eq("slug", subtopicSlug)
      .single();

    if (subtopicError || !currentTopic) return null;

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
  { revalidate: 3600, tags: ["curriculum"] },
);
