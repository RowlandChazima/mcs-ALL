import IntroGridSection from "@/components/home/IntroGridSection";
import HeroPillStatement from "@/components/home/HeroPillStatement";
import { YearCardGrid } from "@/components/home/YearCardGrid";
import OpenSourceCard from "@/components/home/OpenSourceCard";

export default function HomePage() {
  return (
    <div>
      <IntroGridSection />
      <HeroPillStatement />
      <YearCardGrid />
      <OpenSourceCard githubRepoUrl="https://github.com/RowlandChazima/mcs-ALL.git" />
    </div>
  );
}
