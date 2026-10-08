import { FaFilePdf, FaDownload } from "react-icons/fa6";

export interface ResourceCardProps {
  title: string;
  category: "past_paper" | "lecture_slide" | "tutorial_sheet";
  fileUrl: string;
  fileSize?: string;
}

const ResourceCard = ({
  title,
  category,
  fileUrl,
  fileSize,
}: ResourceCardProps) => {
  const badgeConfig = {
    past_paper: {
      label: "Past Paper",
      badgeClass: "bg-coral text-white",
    },
    lecture_slide: {
      label: "Lecture Slide",
      badgeClass: "bg-ice text-ink",
    },
    tutorial_sheet: {
      label: "Tutorial Sheet",
      badgeClass: "bg-butter text-ink",
    },
  };

  const currentBadge = badgeConfig[category];

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-chunky-sm transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-canvas text-ink">
          <FaFilePdf className="size-5 text-coral" />
        </div>

        <div className="space-y-1">
          <span
            className={`inline-block rounded-full border border-ink/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${currentBadge.badgeClass}`}
          >
            {currentBadge.label}
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-ink leading-tight line-clamp-1">
            {title}
          </h4>
          {fileSize && (
            <p className="font-mono text-[11px] text-ink-muted">{fileSize}</p>
          )}
        </div>
      </div>

      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        aria-label={`Download ${title}`}
        className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-canvas text-ink transition-colors hover:bg-ink hover:text-white"
      >
        <FaDownload className="size-3.5" />
      </a>
    </div>
  );
};

export default ResourceCard;
