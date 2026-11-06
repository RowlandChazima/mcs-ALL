import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

interface NavTarget {
  slug: string;
  title: string;
}

interface SubtopicPaginationProps {
  unitSlug: string;
  prevSubtopic?: NavTarget | null;
  nextSubtopic?: NavTarget | null;
}

const SubtopicPagination = ({
  unitSlug,
  prevSubtopic,
  nextSubtopic,
}: SubtopicPaginationProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-8 sm:pt-10 mt-8 sm:mt-12 border-t-2 border-ink/10">
      {prevSubtopic ? (
        <Link
          href={`/units/${unitSlug}/${prevSubtopic.slug}`}
          className="group flex items-center gap-3 rounded-2xl border-2 border-ink bg-surface p-3.5 sm:p-4 shadow-chunky-sm transition-transform hover:-translate-x-0.5 hover:bg-canvas min-h-[44px] w-full sm:w-auto"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-canvas transition-colors group-hover:bg-coral group-hover:text-white">
            <FaArrowLeft className="size-3" />
          </div>
          <div className="text-left min-w-0">
            <span className="text-[10px] font-black uppercase text-ink-muted block">
              Previous Topic
            </span>
            <span className="text-xs sm:text-sm font-bold text-ink truncate block">
              {prevSubtopic.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {nextSubtopic ? (
        <Link
          href={`/units/${unitSlug}/${nextSubtopic.slug}`}
          className="group flex items-center justify-end gap-3 rounded-2xl border-2 border-ink bg-surface p-3.5 sm:p-4 shadow-chunky-sm transition-transform hover:translate-x-0.5 hover:bg-canvas text-right min-h-[44px] w-full sm:w-auto"
        >
          <div className="text-right min-w-0">
            <span className="text-[10px] font-black uppercase text-ink-muted block">
              Next Topic
            </span>
            <span className="text-xs sm:text-sm font-bold text-ink truncate block">
              {nextSubtopic.title}
            </span>
          </div>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral text-white shadow-sm transition-colors group-hover:bg-coral-hover">
            <FaArrowRight className="size-3" />
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
};

export default SubtopicPagination;
