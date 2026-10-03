import Image from "next/image";
import Link from "next/link";

interface IntroGridSectionProps {
  imageSrc?: string; // Pass your image path or import here
  imageAlt?: string;
}

export default function IntroGridSection({
  imageSrc = "/icons/calculus.svg", // Replace with your image file in /public
  imageAlt = "Mathematics and Computer Science Students Hub",
}: IntroGridSectionProps) {
  return (
    <div className="pt-6 pb-14 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column:  */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full border-2 border-ink bg-butter px-3.5 py-1 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink shadow-chunky-sm">
            First Year • Semester 1
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink leading-[1.05]">
            Your Maths and Computer Science <br />
            <p className="text-coral underline decoration-wavy decoration-2 underline-offset-8">
              study hub.
            </p>
          </h1>

          <p className="text-lg sm:text-xl text-ink-muted max-w-xl font-medium leading-relaxed">
            An open syllabus directory built specifically for our cohort.
            Organized lecture breakdowns, YouTube tutorials, and past papers all
            in one place. If you have extra study materials, notes, exams and
            past papers, feel free to contribute to the cause.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/years/year-1"
              className="inline-flex items-center justify-center rounded-full border-2 border-ink bg-coral px-8 py-3.5 text-base font-bold text-white shadow-chunky transition-all hover:-translate-y-1 hover:bg-coral-hover active:translate-y-0.5 active:shadow-none"
            >
              Explore Year 1 Units
            </Link>
            <a
              href="#manifesto"
              className="inline-flex items-center justify-center rounded-full border-2 border-ink bg-surface px-6 py-3.5 text-base font-bold text-ink shadow-chunky-sm transition-all hover:bg-ice hover:-translate-y-0.5"
            >
              How It Works ↓
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Background accent  */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-ice border-2 border-ink translate-x-3 translate-y-3" />

            {/*  Image Frame */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2.5rem] border-2 border-ink bg-surface shadow-chunky flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {/* Floating  badge on the left bottom corner */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl border-2 border-ink bg-butter px-4 py-2 font-bold text-xs sm:text-sm text-ink shadow-chunky-sm -rotate-3">
              📚 Pure & Applied Notes Inside
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
