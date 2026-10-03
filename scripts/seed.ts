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
  const { data: units, error: unitErr } = await supabase
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
    )
    .select();

  if (unitErr) throw unitErr;

  const calcUnit = units.find((u) => u.slug === "calculus-1")!;

  // 3. Insert Subtopics for Calculus I with KaTeX formulas
  const { error: subtopicErr } = await supabase.from("subtopics").upsert(
    [
      {
        unit_id: calcUnit.id,
        slug: "formal-definition-of-limits",
        title: "Limits: The Epsilon-Delta Formulation",
        order_index: 1,
        youtube_id: "kfF40MiS7zA",
        youtube_title: "Understanding Epsilon-Delta Formulations",
        youtube_author: "3Blue1Brown",
        youtube_duration: "18:24",
        content_markdown: `### The Rigorous Definition of a Limit

Let $f(x)$ be defined on an open interval around $x_0$, except possibly at $x_0$ itself. We write:

$$\\lim_{x \\to x_0} f(x) = L$$

if for every real $\\varepsilon > 0$, there exists a corresponding real $\\delta > 0$ such that:

$$0 < |x - x_0| < \\delta \\implies |f(x) - L| < \\varepsilon$$

<PillBadge variant="butter">Exam Definition Required</PillBadge>

#### Key Properties of Limits
When analyzing standard algebraic expressions, the following limit identities hold true provided $\\lim f(x)$ and $\\lim g(x)$ exist:

1. **Sum Rule**: $\\lim [f(x) + g(x)] = \\lim f(x) + \\lim g(x)$
2. **Quotient Rule**: $\\lim \\left[\\frac{f(x)}{g(x)}\\right] = \\frac{\\lim f(x)}{\\lim g(x)}$, where $\\lim g(x) \\neq 0$.

<FunctionPlot fn="x^2 - 4" title="Parabolic Curve f(x) = x^2 - 4"/>
`,
      },
      {
        unit_id: calcUnit.id,
        slug: "differentiation-from-first-principles",
        title: "Differentiation from First Principles",
        order_index: 2,
        youtube_id: "rAof9Ld5sOg",
        youtube_title: "Derivatives by First Principles",
        youtube_author: "Khan Academy",
        youtube_duration: "14:10",
        content_markdown: `### The Derivative as a Limit of Secants

The derivative of $f$ at $x$, denoted $f'(x)$, is established via the difference quotient limit:

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

provided this limit exists.

\`\`\`c
// Numerical Secant Approximation Example in C
#include <stdio.h>
#include <math.h>

double derivative(double (*f)(double), double x, double h) {
    return (f(x + h) - f(x)) / h;
}
\`\`\`
`,
      },
    ],
    { onConflict: "unit_id, slug" },
  );

  if (subtopicErr) throw subtopicErr;

  // 4. Insert Downloadable Resources
  await supabase.from("resources").upsert([
    {
      unit_id: calcUnit.id,
      title: "Calculus I CAT 1 Solutions (2024)",
      category: "past_paper",
      file_url:
        "[https://your-bucket-url.supabase.co/storage/v1/object/public/course-materials/calc1-cat1-2024.pdf](https://your-bucket-url.supabase.co/storage/v1/object/public/course-materials/calc1-cat1-2024.pdf)",
      file_size: "1.4 MB",
    },
    {
      unit_id: calcUnit.id,
      title: "Tutorial Sheet 1: Limits & Continuity",
      category: "tutorial_sheet",
      file_url:
        "[https://your-bucket-url.supabase.co/storage/v1/object/public/course-materials/calc1-sheet1.pdf](https://your-bucket-url.supabase.co/storage/v1/object/public/course-materials/calc1-sheet1.pdf)",
      file_size: "620 KB",
    },
  ]);

  console.log("Database seeded successfully!");
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
