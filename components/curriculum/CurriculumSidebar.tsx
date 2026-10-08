"use client";

import Link from "next/link";
import { FaCheckCircle, FaCircle } from "react-icons/fa";

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
  return (
    <aside className="w-full lg:w-72 shrink-0">
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
  );
};

export default CurriculumSidebar;
