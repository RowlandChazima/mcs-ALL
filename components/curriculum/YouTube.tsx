import { VideoCard } from "@/components/curriculum/VideoCard";
import { parseYouTubeId } from "@/lib/youtube";

interface YouTubeProps {
  /** Any YouTube link, e.g. url="https://youtu.be/dQw4w9WgXcQ" */
  url?: string;
  /** Or just the 11-character id */
  id?: string;
  title?: string;
  author?: string;
  duration?: string;
}

// Use inside a note, anywhere you want an extra explanation video:
//   <YouTube url="https://youtu.be/XXXXXXXXXXX" title="Chain rule, worked examples" />
export function YouTube({ url, id, title, author, duration }: YouTubeProps) {
  const videoId = parseYouTubeId(id ?? url);

  if (!videoId) {
    return (
      <p className="my-6 rounded-xl border-2 border-coral bg-coral/10 p-4 text-sm font-bold text-ink">
        This video link isn&apos;t valid: {url ?? id ?? "(missing)"}
      </p>
    );
  }

  return (
    <div className="not-prose my-6">
      <VideoCard
        title={title ?? "Video explanation"}
        youtubeId={videoId}
        author={author}
        duration={duration}
      />
    </div>
  );
}
