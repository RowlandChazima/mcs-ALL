import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface YearCardProps {
  yearNumber: number;
  slug: string;
  title: string;
  tagline: string;
  unitCount: number;
  imageSrc: string;
  isAvailable?: boolean;
  colorTheme?: "butter" | "lilac" | "ice";
}

const YearCard = ({
  yearNumber,
  slug,
  title,
  tagline,
  unitCount,
  imageSrc,
  isAvailable,
  colorTheme = "butter",
}: YearCardProps) => {
  const themeStyles = {
    butter: {
      accentBg: "bg-butter",
      borderOffset: "bg-butter",
    },
    lilac: {
      accentBg: "bg-lilac",
      borderOffset: "bg-lilac",
    },
    ice: {
      accentBg: "bg-ice",
      borderOffset: "bg-ice",
    },
  };

  const currentTheme = themeStyles[colorTheme];
  return (
    <div className="relative group max-w-xl mx-auto w-full">
      {/* Playful Don't Board Me hard-offset background shadow layer */}
      <div
        className={`absolute inset-0 rounded-[2.5rem] border-2 border-ink ${currentTheme.borderOffset} translate-x-2.5 translate-y-2.5 transition-transform duration-200 group-hover:translate-x-3.5 group-hover:translate-y-3.5`}
      />

      {/* Main interactive Card Face */}
      <div className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-2 border-ink bg-surface p-6 sm:p-8 shadow-chunky transition-transform duration-200 group-hover:-translate-y-1">
        {/* Top Meta Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-2xl border-2 border-ink bg-ink text-sm font-black text-white">
              0{yearNumber}
            </span>
            <span className="rounded-full border-2 border-ink bg-canvas px-3.5 py-1 text-xs font-black uppercase tracking-wider text-ink">
              {isAvailable ? `${unitCount} Units Active` : "Coming Soon"}
            </span>
          </div>

          <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">
            BSc Maths & CS
          </span>
        </div>

        {/* Visual / Image Slot */}
        <div className="relative my-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border-2 border-ink bg-canvas">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div className="absolute top-3 left-3 rounded-full border-2 border-ink bg-surface/90 px-3 py-1 backdrop-blur-sm">
            <p className="text-xs font-black text-ink">Semester 1 & 2</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-ink-muted font-medium leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Action Button CTA */}
        <div className="mt-8 pt-4 border-t-2 border-ink/10 flex items-center justify-between">
          <span className="text-xs font-extrabold text-ink-muted uppercase tracking-wider">
            Lecture Notes • Videos • CATs
          </span>

          {isAvailable ? (
            <Link
              href={`/years/${slug}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-coral px-6 py-2.5 text-sm font-bold text-white shadow-chunky-sm transition-all hover:bg-coral-hover active:translate-y-0.5 active:shadow-none"
            >
              <span>Explore Units</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-full border-2 border-ink/40 bg-canvas px-6 py-2.5 text-sm font-bold text-ink-muted/60"
            >
              Curating...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearCard;
