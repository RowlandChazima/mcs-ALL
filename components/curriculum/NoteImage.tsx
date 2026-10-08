import type { ImgHTMLAttributes } from "react";

// Renders markdown images (![caption](url)) inside notes. The alt text doubles
// as the visible caption. Built from <span>s on purpose: markdown wraps a
// lone image in a <p>, and a <figure>/<div> inside <p> is invalid HTML.
export function NoteImage({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) {
  if (!src || typeof src !== "string") return null;

  return (
    <span className="not-prose my-6 block">
      {/* Plain <img>: photos live in Supabase Storage and are already
          compressed by the push script, so next/image adds nothing here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className="mx-auto block h-auto max-w-full rounded-2xl border-2 border-ink bg-white shadow-chunky-sm"
      />
      {alt ? (
        <span className="mt-2 block text-center text-xs font-bold text-ink-muted">
          {alt}
        </span>
      ) : null}
    </span>
  );
}
