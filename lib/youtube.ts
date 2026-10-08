// Pure helpers (no Next.js imports) so both the site and the notes push
// script can share them.

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Accepts a bare 11-character id or any common YouTube link:
 *  watch?v=, youtu.be/, /embed/, /shorts/, /live/ (with or without extras
 *  like &t=30s). Returns null when it can't find a valid id. */
export function parseYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const text = input.trim();
  if (VIDEO_ID.test(text)) return text;

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www|m|music)\./, "");
  const pick = (candidate: string | null | undefined) =>
    candidate && VIDEO_ID.test(candidate) ? candidate : null;

  if (host === "youtu.be") {
    return pick(url.pathname.split("/")[1]);
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") return pick(url.searchParams.get("v"));
    const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/);
    if (match) return pick(match[1]);
  }
  return null;
}
