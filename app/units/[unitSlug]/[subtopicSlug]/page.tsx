import { notFound } from "next/navigation";
import { getSubtopicWorkspace } from "@/lib/db/queries";
import CurriculumSidebar from "@/components/curriculum/CurriculumSidebar";
import { NotesRenderer } from "@/components/curriculum/NotesRenderer";
import { VideoCard } from "@/components/curriculum/VideoCard";
import SubtopicPagination from "@/components/curriculum/SubtopicPagination";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

interface SubtopicPageProps {
  params: Promise<{
    unitSlug: string;
    subtopicSlug: string;
  }>;
}

export default async function SubtopicPage({ params }: SubtopicPageProps) {
  const { unitSlug, subtopicSlug } = await params;
  const data = await getSubtopicWorkspace(unitSlug, subtopicSlug);

  if (!data) notFound();

  const { unit, currentTopic, syllabusTree } = data;

  const currentIndex = syllabusTree.findIndex((s) => s.slug === subtopicSlug);
  const prevTopic = currentIndex > 0 ? syllabusTree[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < syllabusTree.length - 1
      ? syllabusTree[currentIndex + 1]
      : null;

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
      {/* Breadcrumbs (wrap on mobile to prevent overflow) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-3.5 sm:px-4 py-2 text-xs font-bold text-ink shadow-chunky-sm shrink-0"
          href={`/units/${unitSlug}`}
        >
          <FaArrowLeft className="size-3" />
          <span>Back to Syllabus</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted break-words">
          / {unit.code} / {currentTopic.title}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <CurriculumSidebar
          currentSlug={subtopicSlug}
          subtopics={syllabusTree.map((s) => ({
            slug: s.slug,
            orderNumber: s.order_index,
            title: s.title,
          }))}
          unitCode={unit.code}
          unitSlug={unitSlug}
          unitTitle={unit.title}
        />

        {/* Single box on mobile, nested box on tablet/desktop */}
        <article className="flex-1 w-full rounded-3xl sm:rounded-[2.5rem] border-2 border-ink bg-surface p-4 sm:p-10 shadow-chunky space-y-6 sm:space-y-8">
          <div className="space-y-2.5 sm:space-y-3 pb-5 sm:pb-6 border-b-2 border-ink/10">
            <span className="rounded-full border-2 border-ink bg-butter px-3 py-0.5 font-mono text-xs font-black text-ink inline-block">
              Topic {currentTopic.order_index < 10 ? `0${currentTopic.order_index}` : currentTopic.order_index}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
              {currentTopic.title}
            </h1>
          </div>

          {currentTopic.youtube_id && (
            <VideoCard
              author={currentTopic.youtube_author}
              duration={currentTopic.youtube_duration}
              title={currentTopic.youtube_title ?? currentTopic.title}
              youtubeId={currentTopic.youtube_id}
            />
          )}

          {/* On mobile: unboxed, sits directly inside article. sm+: restores container box */}
          <div className="sm:rounded-3xl sm:border-2 sm:border-ink sm:bg-canvas sm:p-10 sm:shadow-chunky-sm">
            <NotesRenderer content={currentTopic.content_markdown} />
          </div>

          <SubtopicPagination
            nextSubtopic={nextTopic}
            prevSubtopic={prevTopic}
            unitSlug={unitSlug}
          />
        </article>
      </div>
    </div>
  );
}
