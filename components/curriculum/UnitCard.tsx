import Link from "next/link";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";

export interface UnitCardProps {
  code: string;
  title: string;
  slug: string;
  category: "pure_math" | "computer_science" | "applied_math";
  colorVariant: "butter" | "lilac" | "ice" | "charcoal";
  subtopicsCount: number;
  semester: 1 | 2;
  description: string;
  contributorsCount?: number;
}

const UnitCard = ({
  code,
  title,
  slug,
  category,
  colorVariant,
  subtopicsCount,
  semester,
  description,
  contributorsCount = 14,
}: UnitCardProps) => {
  const cardThemes = {
    butter: {
      bg: "bg-butter",
      text: "text-ink",
      badgeBg: "bg-surface",
      badgeText: "text-ink",
      buttonBg: "bg-coral text-white hover:bg-coral-hover",
    },

    lilac: {
      bg: "bg-lilac",
      text: "text-ink",
      badgeBg: "bg-surface",
      badgeText: "text-ink",
      buttonBg: "bg-coral text-white hover:bg-coral-hover",
    },

    ice: {
      bg: "bg-ice",
      text: "text-ink",
      badgeBg: "bg-surface",
      badgeText: "text-ink",
      buttonBg: "bg-coral text-white hover:bg-coral-hover",
    },

    charcoal: {
      bg: "bg-charcoal",
      text: "text-white",
      badgeBg: "bg-white/10",
      badgeText: "text-butter ",
      buttonBg: "bg-coral text-white hover:bg-coral-hover",
    },
  };

  const theme = cardThemes[colorVariant];

  const categoryLabels = {
    pure_math: "Pure Mathematics",
    computer_science: "Computer Science",
    applied_math: "Applied Mathematics",
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-[2rem] border-2 border-ink ${theme.bg} p-6 sm:p-7 shadow-chunky transition-transform duration-200 hover:-translate-y-1`}
    >
      <div>
        {/* Top Badges: Category & Semester */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full border-2 border-ink ${theme.badgeBg} px-3.5 py-1 text-xs font-black uppercase tracking-wider ${theme.badgeText}`}
          >
            {categoryLabels[category]}
          </span>
          <span className="rounded-full border-2 border-ink bg-surface px-3 py-1 text-xs font-black text-ink">
            Sem {semester}
          </span>
        </div>

        {/* Unit Code & Title */}
        <div className="mt-5 space-y-1">
          <span className="font-mono text-xs font-black uppercase tracking-widest opacity-80">
            {code}
          </span>
          <h3
            className={`text-xl sm:text-2xl font-black tracking-tight leading-snug ${theme.text}`}
          >
            {title}
          </h3>
        </div>

        {/* Short Description */}
        <p
          className={`mt-3 text-sm font-medium leading-relaxed opacity-85 line-clamp-2 ${theme.text}`}
        >
          {description}
        </p>
      </div>

      {/* Bottom Metas + Learnify-style Avatar Stack & CTA */}
      <div className="mt-8 pt-5 border-t-2 border-ink/15 flex items-center justify-between gap-3">
        {/* Topic Counter + Mini Stack */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-3 py-1 text-xs font-bold text-ink">
            <FaBookOpen className="size-3 text-coral" />
            <span>{subtopicsCount} Subtopics</span>
          </div>

          <span className="hidden sm:inline-flex rounded-full border-2 border-ink bg-canvas px-2.5 py-0.5 text-[11px] font-black text-ink-muted">
            +{contributorsCount} notes
          </span>
        </div>

        {/* Navigate to Unit View (Level 2) */}
        <Link
          href={`/units/${slug}`}
          className={`inline-flex items-center gap-2 rounded-full border-2 border-ink ${theme.buttonBg} px-5 py-2.5 text-xs sm:text-sm font-extrabold shadow-chunky-sm transition-all active:translate-y-0.5 active:shadow-none`}
        >
          <span>Open</span>
          <FaArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default UnitCard;
