import { notFound } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaDownload, FaGraduationCap } from "react-icons/fa6";
import SubtopicRow from "@/components/curriculum/SubtopicRow";
import ResourceCard from "@/components/curriculum/ResourceCard";

// Mock Unit Data (Calculus 1 Example)
const UNIT_DETAILS = {
  code: "SMA 2100",
  slug: "calculus-1",
  title: "Calculus I",
  yearSlug: "year-1",
  colorVariant: "butter" as const,
  semester: 1,
  description:
    "An introduction to single-variable differential calculus. Core focal areas include limits, formal epsilon-delta continuity, differentiation from first principles, standard derivatives, and extreme value curve optimization.",
  subtopics: [
    {
      orderNumber: 1,
      slug: "functions-and-domain",
      title: "Functions, Domain, and Codomain",
      summary:
        "Properties of real-valued functions, composite functions, and determination of natural domains.",
      hasVideo: true,
      videoDuration: "24 min",
      readingTimeMinutes: 12,
    },
    {
      orderNumber: 2,
      slug: "limits-and-intuitive-approach",
      title: "Limits: Intuitive & Formal Definition",
      summary:
        "One-sided limits, algebraic techniques for indeterminate forms, and basic squeeze theorem.",
      hasVideo: true,
      videoDuration: "35 min",
      readingTimeMinutes: 18,
    },
    {
      orderNumber: 3,
      slug: "continuity-and-intermediate-value",
      title: "Continuity & Intermediate Value Theorem",
      summary:
        "Removable and jump discontinuities, continuity on closed intervals, and the IVT theorem.",
      hasVideo: true,
      videoDuration: "18 min",
      readingTimeMinutes: 15,
    },
    {
      orderNumber: 4,
      slug: "differentiation-from-first-principles",
      title: "Differentiation from First Principles",
      summary:
        "Derivation of the derivative definition, geometric slope interpretation, and proof for polynomials.",
      hasVideo: true,
      videoDuration: "42 min",
      readingTimeMinutes: 20,
    },
    {
      orderNumber: 5,
      slug: "product-quotient-and-chain-rules",
      title: "Chain Rule & Advanced Differentiation",
      summary:
        "Systematic application of the chain, quotient, and product rules with trigonometric functions.",
      hasVideo: false,
      readingTimeMinutes: 25,
    },
  ],
  resources: [
    {
      id: "res-1",
      title: "CAT 1 Past Examination (2024 with Solutions)",
      category: "past_paper" as const,
      fileUrl: "#",
      fileSize: "1.2 MB",
    },
    {
      id: "res-2",
      title: "Limits & First Principles - Tutorial Sheet 1",
      category: "tutorial_sheet" as const,
      fileUrl: "#",
      fileSize: "480 KB",
    },
    {
      id: "res-3",
      title: "Lecturer Slide Pack: Derivatives & Curve Sketching",
      category: "lecture_slide" as const,
      fileUrl: "#",
      fileSize: "4.8 MB",
    },
  ],
};

interface UnitPageProps {
  params: Promise<{
    unitSlug: string;
  }>;
}

export default async function UnitPage({ params }: UnitPageProps) {
  const { unitSlug } = await params;

  // Static route safeguard (maps to Supabase query in production)
  if (unitSlug !== UNIT_DETAILS.slug) {
    notFound();
  }

  return (
    <div className="space-y-12 py-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href={`/years/${UNIT_DETAILS.yearSlug}`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-4 py-2 text-xs font-bold text-ink shadow-chunky-sm transition-transform hover:-translate-x-0.5"
        >
          <FaArrowLeft className="size-3" />
          <span>Back to Year 1 Units</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          / {UNIT_DETAILS.code}
        </span>
      </div>

      {/* Unit Overview Header Block */}
      <header className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-butter p-8 sm:p-12 shadow-chunky">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border-2 border-ink bg-surface px-3.5 py-1 font-mono text-xs font-black uppercase text-ink">
              {UNIT_DETAILS.code}
            </span>
            <span className="rounded-full border-2 border-ink bg-canvas px-3.5 py-1 text-xs font-black uppercase text-ink">
              Semester {UNIT_DETAILS.semester}
            </span>
            <span className="rounded-full border-2 border-ink bg-ink px-3.5 py-1 text-xs font-black text-white">
              {UNIT_DETAILS.subtopics.length} Subtopics
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-ink">
            {UNIT_DETAILS.title}
          </h1>

          <p className="text-base sm:text-lg text-ink font-medium leading-relaxed opacity-90">
            {UNIT_DETAILS.description}
          </p>
        </div>
      </header>

      {/* Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Column (8 Cols): Syllabus Breakdown Table */}
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
            <span className="text-xs font-bold text-ink-muted">
              Select a topic to start
            </span>
          </div>

          {/* Subtopics Checklist View */}
          <div className="flex flex-col gap-3">
            {UNIT_DETAILS.subtopics.map((subtopic) => (
              <SubtopicRow
                key={subtopic.slug}
                unitSlug={UNIT_DETAILS.slug}
                subtopicSlug={subtopic.slug}
                orderNumber={subtopic.orderNumber}
                title={subtopic.title}
                summary={subtopic.summary}
                hasVideo={subtopic.hasVideo}
                videoDuration={subtopic.videoDuration}
                readingTimeMinutes={subtopic.readingTimeMinutes}
              />
            ))}
          </div>
        </section>

        {/* Sidebar Column (4 Cols): Downloads & Past Papers */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-black text-coral">
              Course Downloads
            </span>
            <h3 className="text-2xl font-black text-ink tracking-tight">
              Materials & CATs
            </h3>
          </div>

          <div className="flex flex-col gap-3.5">
            {UNIT_DETAILS.resources.map((res) => (
              <ResourceCard
                key={res.id}
                title={res.title}
                category={res.category}
                fileUrl={res.fileUrl}
                fileSize={res.fileSize}
              />
            ))}
          </div>

          {/* Study Tip Sticky Note */}
          <div className="rounded-2xl border-2 border-ink bg-ice/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-ink">
              <FaGraduationCap className="size-4 text-coral" />
              <span>Exam Prep Advice</span>
            </div>
            <p className="text-xs font-medium text-ink-muted leading-relaxed">
              Lecturers heavily test{" "}
              <strong>Differentiation from First Principles</strong> and{" "}
              <strong>Composite Limits</strong> in CAT 1. Make sure to work
              through Tutorial Sheet 1 before the CAT.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
