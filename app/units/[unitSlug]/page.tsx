import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaGraduationCap } from "react-icons/fa6";
import SubtopicRow from "@/components/curriculum/SubtopicRow";
import ResourceCard from "@/components/curriculum/ResourceCard";
import { getUnitDetails } from "@/lib/db/queries";

// Static class names (Tailwind can't see classes built from strings at runtime).
const HEADER_THEMES = {
  butter: { bg: "bg-butter", text: "text-ink" },
  lilac: { bg: "bg-lilac", text: "text-ink" },
  ice: { bg: "bg-ice", text: "text-ink" },
  charcoal: { bg: "bg-charcoal", text: "text-white" },
} as const;

interface UnitPageProps {
  params: Promise<{
    unitSlug: string;
  }>;
}

// Uses the same cached query as the page below, so it costs no extra request.
export async function generateMetadata({
  params,
}: UnitPageProps): Promise<Metadata> {
  const { unitSlug } = await params;
  const data = await getUnitDetails(unitSlug);
  if (!data) return { title: "Unit not found" };
  return {
    title: `${data.unit.code} ${data.unit.title}`,
    description: data.unit.description,
  };
}

export default async function UnitPage({ params }: UnitPageProps) {
  const { unitSlug } = await params;

  const data = await getUnitDetails(unitSlug);
  if (!data) notFound();

  const { unit, subtopics, resources } = data;
  const theme = HEADER_THEMES[unit.color_variant] ?? HEADER_THEMES.butter;

  return (
    <div className="space-y-12 py-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href={`/years/${unit.academic_years.slug}`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-4 py-2 text-xs font-bold text-ink shadow-chunky-sm transition-transform hover:-translate-x-0.5"
        >
          <FaArrowLeft className="size-3" />
          <span>Back to {unit.academic_years.title}</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          / {unit.code}
        </span>
      </div>

      {/* Unit Overview Header Block */}
      <header
        className={`relative overflow-hidden rounded-[2.5rem] border-2 border-ink ${theme.bg} p-8 sm:p-12 shadow-chunky`}
      >
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border-2 border-ink bg-surface px-3.5 py-1 font-mono text-xs font-black uppercase text-ink">
              {unit.code}
            </span>
            <span className="rounded-full border-2 border-ink bg-canvas px-3.5 py-1 text-xs font-black uppercase text-ink">
              Semester {unit.semester}
            </span>
            <span className="rounded-full border-2 border-ink bg-ink px-3.5 py-1 text-xs font-black text-white">
              {subtopics.length} {subtopics.length === 1 ? "Subtopic" : "Subtopics"}
            </span>
          </div>

          <h1
            className={`text-3xl sm:text-5xl font-black tracking-tight ${theme.text}`}
          >
            {unit.title}
          </h1>

          {unit.description && (
            <p
              className={`text-base sm:text-lg font-medium leading-relaxed opacity-90 ${theme.text}`}
            >
              {unit.description}
            </p>
          )}
        </div>
      </header>

      {/* Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Column: Syllabus Breakdown */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-black text-coral">
                Core Syllabus
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                Topics & Lecture Notes
              </h2>
            </div>
            {subtopics.length > 0 && (
              <span className="text-xs font-bold text-ink-muted">
                Select a topic to start
              </span>
            )}
          </div>

          {subtopics.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-ink/40 bg-surface p-8 text-center">
              <p className="text-sm font-bold text-ink-muted">
                Notes for this unit are on the way.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {subtopics.map((subtopic, index) => (
                <SubtopicRow
                  key={subtopic.id}
                  unitSlug={unit.slug}
                  subtopicSlug={subtopic.slug}
                  orderNumber={index + 1}
                  title={subtopic.title}
                  summary={subtopic.summary}
                  hasVideo={Boolean(subtopic.youtube_id)}
                  videoDuration={subtopic.youtube_duration}
                  readingTimeMinutes={subtopic.reading_minutes ?? undefined}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sidebar Column: Downloads & Exam tip */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-black text-coral">
              Course Downloads
            </span>
            <h3 className="text-2xl font-black text-ink tracking-tight">
              Materials & CATs
            </h3>
          </div>

          {resources.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-ink/40 bg-surface p-5 text-center">
              <p className="text-xs font-bold text-ink-muted">
                No downloads yet. Past papers and slides will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {resources.map((res) => (
                <ResourceCard
                  key={res.id}
                  title={res.title}
                  category={res.category}
                  fileUrl={res.file_url}
                  fileSize={res.file_size ?? undefined}
                />
              ))}
            </div>
          )}

          {unit.exam_tip && (
            <div className="rounded-2xl border-2 border-ink bg-ice/60 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-ink">
                <FaGraduationCap className="size-4 text-coral" />
                <span>Exam Prep Advice</span>
              </div>
              <p className="text-xs font-medium text-ink-muted leading-relaxed">
                {unit.exam_tip}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
