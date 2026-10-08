import YearCard from "@/components/curriculum/YearCard";

const YEARS_DATA = [
  {
    yearNumber: 1,
    slug: "year-1",
    title: "First Year Curriculum",
    tagline:
      "Foundations of Pure Mathematics, Calculus I & II, Discrete Math, Structured Programming, and Computer Architecture.",
    unitCount: 8,
    imageSrc: "/file.svg", // Place an image or use /placeholder-hero.png
    isAvailable: true,
    colorTheme: "butter" as const,
  },
  // Years 2, 3, 4 can easily be uncommented or fetched from Supabase
];

export function YearCardGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest font-black text-coral">
            Academic Tracks
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
            Select Your Academic Year
          </h1>
        </div>
        <p className="max-w-md text-sm sm:text-base text-ink-muted font-medium">
          Direct access to verified syllabus units, vetted lecturer summaries,
          and past CAT questions.
        </p>
      </div>

      <div className="flex justify-center">
        {YEARS_DATA.map((year) => (
          <YearCard key={year.slug} {...year} />
        ))}
      </div>
    </section>
  );
}
