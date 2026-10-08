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
    <div className="overflow-hidden rounded-3xl border-2 border-ink bg-surface shadow-chunky-sm">
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

      <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          {author && (
            <div className="flex items-center gap-2">
              <FaYoutube className="size-4 text-coral" />
              <span className="text-xs font-bold text-ink-muted">
                Lecturer / Channel: {author}
              </span>
            </div>
          )}
          <h4 className="text-sm sm:text-base font-black text-ink">{title}</h4>
        </div>

        {duration && (
          <span className="shrink-0 rounded-full border-2 border-ink bg-ice px-3 py-1 font-mono text-xs font-black text-ink">
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}
