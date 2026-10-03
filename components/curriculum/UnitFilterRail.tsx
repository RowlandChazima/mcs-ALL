"use client";

interface UnitsFilterRailProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    pure_math: number;
    computer_science: number;
    applied_math: number;
  };
}

export default function UnitsFilterRail({
  activeFilter,
  onFilterChange,
  counts,
}: UnitsFilterRailProps) {
  const tabs = [
    { id: "all", label: "All Units", count: counts.all },
    { id: "pure_math", label: "Pure Math", count: counts.pure_math },
    {
      id: "computer_science",
      label: "Computer Science",
      count: counts.computer_science,
    },
    { id: "applied_math", label: "Applied Math", count: counts.applied_math },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5 py-2">
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              isActive
                ? "bg-ink text-white shadow-chunky-sm"
                : "bg-surface text-ink hover:bg-butter"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
                isActive ? "bg-coral text-white" : "bg-canvas text-ink-muted"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
