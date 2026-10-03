"use client";

import { useState, useMemo } from "react";
import UnitCard, { UnitCardProps } from "@/components/curriculum/UnitCard";
import UnitsFilterRail from "./UnitFilterRail";

interface UnitsDirectoryProps {
  units: UnitCardProps[];
}

export function UnitsDirectory({ units }: UnitsDirectoryProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const counts = useMemo(
    () => ({
      all: units.length,
      pure_math: units.filter((u) => u.category === "pure_math").length,
      computer_science: units.filter((u) => u.category === "computer_science")
        .length,
      applied_math: units.filter((u) => u.category === "applied_math").length,
    }),
    [units],
  );

  const filteredUnits = useMemo(() => {
    if (activeFilter === "all") return units;
    return units.filter((u) => u.category === activeFilter);
  }, [units, activeFilter]);

  return (
    <div className="space-y-8">
      {/* Category Pills Rail */}
      <UnitsFilterRail
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredUnits.map((unit) => (
          <UnitCard key={unit.code} {...unit} />
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-ink p-12 text-center bg-surface">
          <p className="font-bold text-ink-muted">
            No units found under this category.
          </p>
        </div>
      )}
    </div>
  );
}
