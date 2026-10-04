"use client";

import Link from "next/link";

// Catches anything that throws while rendering a lesson (a note using a
// component that doesn't exist, a database hiccup...) so one bad lesson shows
// a friendly message instead of a blank crash page.
export default function SubtopicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="mx-auto max-w-xl space-y-5 rounded-[2.5rem] border-2 border-ink bg-surface p-8 text-center shadow-chunky">
      <h2 className="text-2xl font-black text-ink">
        This lesson couldn&apos;t be loaded
      </h2>
      <p className="text-sm font-medium text-ink-muted">
        Something went wrong while preparing these notes. You can try again, or
        head back to the syllabus.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-full border-2 border-ink bg-coral px-5 py-2 text-sm font-black text-white shadow-chunky-sm"
        >
          Try again
        </button>
        <Link
          href="/years/year-1"
          className="rounded-full border-2 border-ink bg-surface px-5 py-2 text-sm font-black text-ink shadow-chunky-sm"
        >
          Back to units
        </Link>
      </div>
    </div>
  );
}
