import { FaPlay, FaArrowRight } from "react-icons/fa6";
import Link from "next/link";

export interface SubtopicRowProps {
  unitSlug: string;
  subtopicSlug: string;
  orderNumber: number;
  title: string;
  summary: string;
  hasVideo: boolean;
  videoDuration?: string;
  readingTimeMinutes?: number;
}

const SubtopicRow = ({
  unitSlug,
  subtopicSlug,
  orderNumber,
  title,
  summary,
  hasVideo,
  videoDuration,
  readingTimeMinutes = 15,
}: SubtopicRowProps) => {
  const formattedNumber =
    orderNumber < 10 ? `0${orderNumber}` : `${orderNumber}`;

  return (
    <Link
      href={`/units/${unitSlug}/${subtopicSlug}`}
      className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-ink bg-surface p-5 sm:p-6 shadow-chunky-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-canvas hover:shadow-chunky"
    >
      {/* Left: Number + Title & Summary */}
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-butter font-mono text-sm font-black text-ink shadow-sm">
          {formattedNumber}
        </span>

        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-black text-ink tracking-tight transition-colors group-hover:text-coral">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-ink-muted font-medium line-clamp-1 max-w-xl">
            {summary}
          </p>
        </div>
      </div>

      {/* Right: Badges & Action Arrow */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-ink/10">
        <div className="flex items-center gap-2">
          {hasVideo && (
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-lilac/40 px-3 py-0.5 text-xs font-bold text-ink">
              <FaPlay className="size-2.5 text-coral" />
              <span>{videoDuration || "Video"}</span>
            </span>
          )}

          <span className="rounded-full border-2 border-ink bg-canvas px-3 py-0.5 text-xs font-bold text-ink-muted">
            {readingTimeMinutes} min read
          </span>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full border-2 border-ink bg-ink text-white transition-all group-hover:bg-coral group-hover:translate-x-1">
          <FaArrowRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
};

export default SubtopicRow;
