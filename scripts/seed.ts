// Usage:
//   pnpm db:seed              seed staging database (default, .env.local)
//   pnpm db:seed --env prod   seed production database (.env.production.local)
import { createClient } from "@supabase/supabase-js";
import { loadTargetEnv, confirmProductionWrite } from "./env";

async function runSeed() {
  const env = loadTargetEnv({ requireServiceKey: true });
  console.log(`\n🎯 Target database: [${env.target.toUpperCase()}] at ${env.host} (via ${env.envFile})`);

  await confirmProductionWrite(`seed initial curriculum rows into database (${env.host})`);

  const supabase = createClient(env.supabaseUrl, env.serviceKey!);
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

  console.log(`[ok] Database seeded successfully on [${env.target.toUpperCase()}]!`);
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
