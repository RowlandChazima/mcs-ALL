import React from "react";
import { PillBadge } from "../ui/PillBadge";

const HeroPillStatement = () => {
  return (
    <div
      id="manifesto"
      className="py-16 md:py-24 border-y-2 border-ink/10 my-8"
    >
      <div className="max-w-5xl mx-auto text-center md:text-left">
        <p className="text-xs uppercase tracking-widest font-black text-coral block mb-4">
          The Cohort Blueprint
        </p>

        <p className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-ink leading-relaxed md:leading-[1.6]">
          We are dismantling the confusion of first year. No more missing
          <PillBadge variant="butter">Lecture Slides</PillBadge>
          scattered across chats. Get direct access to curated
          <PillBadge variant="lilac">Mathematical Proofs</PillBadge>
          for pure mathematics, peer-recommended
          <PillBadge variant="coral">YouTube Deep Dives</PillBadge>
          for algorithms, and solved
          <PillBadge variant="ice">Past Papers</PillBadge>
          right before your CATs and end-semester exams.
        </p>
      </div>
    </div>
  );
};

export default HeroPillStatement;
