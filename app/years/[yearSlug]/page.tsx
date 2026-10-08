import { notFound } from "next/navigation";
import { getYearBySlug } from "@/lib/db/queries";
import { UnitsDirectory } from "@/components/curriculum/UnitsDirectory";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

interface YearPageProps {
  params: Promise<{ yearSlug: string }>;
}

export default async function YearPage({ params }: YearPageProps) {
  const { yearSlug } = await params;
  const data = await getYearBySlug(yearSlug);

  if (!data) notFound();

  const formattedUnits = data.units.map((u) => ({
    code: u.code,
    title: u.title,
    slug: u.slug,
    category: u.category,
    colorVariant: u.color_variant,
    subtopicsCount: u.subtopics[0]?.count || 0,
    semester: u.semester,
    description: u.description,
  }));

  return (
    <div className="space-y-10 py-6">
      <div className="flex items-center gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-4 py-2 text-xs font-bold text-ink shadow-chunky-sm transition-transform hover:-translate-x-0.5"
          href="/"
        >
          <FaArrowLeft className="size-3" />
          <span>Back to Hub</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          / Curriculum / {data.year.title}
        </span>
      </div>

      <div className="rounded-[2.5rem] border-2 border-ink bg-surface p-8 sm:p-12 shadow-chunky">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-ink">
          {data.year.title} Course Units
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-muted font-medium">
          {data.year.description}
        </p>
      </div>

      <UnitsDirectory units={formattedUnits} />
    </div>
  );
}
