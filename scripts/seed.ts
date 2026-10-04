import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function runSeed() {
  console.log("Seeding database tables...");

  // 1. Insert Year 1
  const { data: year, error: yearErr } = await supabase
    .from("academic_years")
    .upsert(
      {
        year_number: 1,
        slug: "year-1",
        title: "First Year Curriculum",
        description:
          "Foundations of Pure Mathematics and Structured Programming.",
      },
      { onConflict: "slug" },
    )
    .select()
    .single();

  if (yearErr) throw yearErr;

  // 2. Insert Units
  const { error: unitErr } = await supabase
    .from("units")
    .upsert(
      [
        {
          year_id: year.id,
          code: "SMA 2100",
          slug: "calculus-1",
          title: "Calculus I",
          color_variant: "butter",
          semester: 1,
          category: "pure_math",
          description:
            "Limits, continuity, techniques of differentiation, and extreme value analysis.",
          exam_tip:
            "Lecturers heavily test Differentiation from First Principles and composite limits in CAT 1. Work through Tutorial Sheet 1 before the CAT.",
          order_index: 1,
        },
        {
          year_id: year.id,
          code: "ICS 2102",
          slug: "structured-programming",
          title: "Structured Programming",
          color_variant: "lilac",
          semester: 1,
          category: "computer_science",
          description:
            "Foundational logic structures, pointers, memory addressing, and algorithm construction in C.",
          order_index: 2,
        },
      ],
      { onConflict: "slug" },
    );

  if (unitErr) throw unitErr;

  // Notes (subtopics) and downloads are NOT seeded here. They live in notes/
  // and are pushed with `pnpm notes:push`, so re-seeding can never overwrite
  // your work or add placeholder files.

  console.log("Database seeded successfully!");
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
