import { FaYoutube } from "react-icons/fa6";

export interface VideoCardProps {
  title: string;
  youtubeId: string;
  author?: string | null;
  duration?: string | null;
}

export function VideoCard({
  title,
  youtubeId,
  author,
  duration,
}: VideoCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-ink bg-surface shadow-chunky-sm max-w-full">
      <div className="relative aspect-video w-full border-b-2 border-ink bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>

      <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          {author && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FaYoutube className="size-3.5 sm:size-4 text-coral shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-ink-muted truncate">
                Lecturer / Channel: {author}
              </span>
            </div>
          )}
          <h4 className="text-xs sm:text-base font-black text-ink line-clamp-2">{title}</h4>
        </div>

        {duration && (
          <span className="shrink-0 rounded-full border-2 border-ink bg-ice px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-[11px] sm:text-xs font-black text-ink">
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}
