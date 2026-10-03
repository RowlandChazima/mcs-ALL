"use-client";

import IntroGridSection from "@/components/home/IntroGridSection";
import Navbar from "@/components/layout/Navbar";
import HeroPillStatement from "@/components/home/HeroPillStatement";

import React from "react";
import { YearCardGrid } from "@/components/home/YearCardGrid";
import OpenSourceCard from "@/components/home/OpenSourceCard";
import Footer from "@/components/layout/Footer";

const page = () => {
  return (
    <div>
      <IntroGridSection />
      <HeroPillStatement />

      <YearCardGrid />
      <OpenSourceCard githubRepoUrl="https://github.com/RowlandChazima/mcs-ALL.git" />
    </div>
  );
};

export default page;
