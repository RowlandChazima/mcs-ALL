"use client";

import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";

interface SidebarSubtopic {
  slug: string;
  orderNumber: number;
  title: string;
}

interface CurriculumSidebarProps {
  unitCode: string;
  unitTitle: string;
  unitSlug: string;
  currentSlug: string;
  subtopics: SidebarSubtopic[];
}

const CurriculumSidebar = ({
  unitCode,
  unitTitle,
  unitSlug,
  currentSlug,
  subtopics,
}: CurriculumSidebarProps) => {
  const currentTopic = subtopics.find((s) => s.slug === currentSlug);

  return (
    <>
      {/* Mobile Collapsible Strip (< lg) to prevent pushing article down */}
      <details className="lg:hidden w-full rounded-2xl border-2 border-ink bg-surface shadow-chunky-sm group overflow-hidden">
        <summary className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer list-none select-none">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="font-mono text-xs font-black uppercase text-coral shrink-0">
              {unitCode}
            </span>
            <span className="text-xs sm:text-sm font-black text-ink truncate">
              {currentTopic
                ? `${currentTopic.orderNumber < 10 ? `0${currentTopic.orderNumber}` : currentTopic.orderNumber}. ${currentTopic.title}`
                : unitTitle}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 rounded-full border-2 border-ink bg-butter px-2.5 py-1 text-[11px] font-black text-ink">
            <span>{subtopics.length} Topics</span>
            <FaChevronDown className="size-2.5 transition-transform duration-200 group-open:rotate-180" />
          </div>
        </summary>
        <div className="p-3.5 pt-2 border-t-2 border-ink/10 bg-canvas/50">
          <ul className="space-y-1.5">
            {subtopics.map((subtopic) => {
              const isActive = subtopic.slug === currentSlug;
              const formattedNumber =
                subtopic.orderNumber < 10
                  ? `0${subtopic.orderNumber}`
                  : `${subtopic.orderNumber}`;

              return (
                <li key={subtopic.slug}>
                  <Link
                    href={`/units/${unitSlug}/${subtopic.slug}`}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-butter text-ink border-2 border-ink shadow-sm"
                        : "text-ink-muted hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    <span className="font-mono text-[11px] opacity-70">
                      {formattedNumber}
                    </span>
                    <span className="line-clamp-1 flex-1">
                      {subtopic.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </details>

      {/* Desktop Sticky Sidebar (>= lg) - Exact original layout */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-3xl border-2 border-ink bg-surface p-5 shadow-chunky-sm space-y-4">
          {/* Unit Identifier */}
          <div className="pb-3 border-b-2 border-ink/10">
            <span className="font-mono text-xs font-black uppercase text-coral">
              {unitCode}
            </span>
            <h3 className="text-base font-black text-ink tracking-tight line-clamp-1">
              {unitTitle}
            </h3>
          </div>

          {/* Subtopic Items */}
          <nav aria-label="Curriculum Navigation" className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-ink-muted block mb-2">
              Unit Topics
            </span>
            <ul className="space-y-1.5">
              {subtopics.map((subtopic) => {
                const isActive = subtopic.slug === currentSlug;
                const formattedNumber =
                  subtopic.orderNumber < 10
                    ? `0${subtopic.orderNumber}`
                    : `${subtopic.orderNumber}`;

                return (
                  <li key={subtopic.slug}>
                    <Link
                      href={`/units/${unitSlug}/${subtopic.slug}`}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-butter text-ink border-2 border-ink shadow-sm"
                          : "text-ink-muted hover:bg-canvas hover:text-ink"
                      }`}
                    >
                      <span className="font-mono text-[11px] opacity-70">
                        {formattedNumber}
                      </span>
                      <span className="line-clamp-1 flex-1">
                        {subtopic.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default CurriculumSidebar;
