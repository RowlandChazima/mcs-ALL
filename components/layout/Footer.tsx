import Link from "next/link";
import { FaGithub, FaHeart } from "react-icons/fa6";

const FOOTER_NAV = {
  curriculum: [
    { label: "Year 1 Hub", href: "/years/year-1" },
    { label: "Calculus & Pure Math", href: "/years/year-1#pure-math" },
    { label: "Computer Systems & Code", href: "/years/year-1#cs-units" },
    { label: "Past Papers & CATs", href: "/past-papers" },
  ],
  cohort: [
    {
      label: "GitHub Repository",
      href: "https://github.com/your-username/maths-cs-hub",
    },
    {
      label: "Report an Issue",
      href: "https://github.com/your-username/maths-cs-hub/issues",
    },
    { label: "Syllabus Breakdown", href: "#manifesto" },
    { label: "Discussion Board", href: "#" },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear(); // to avoid hardcoding the year each time i refactor

  return (
    <div className="mt-auto border-t-2 border-ink bg-surface pt-16 pb-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: Brand Statement & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b-2 border-ink/10">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <p className="flex size-9 items-center justify-center px-6 py-3.5 rounded-md bg-butter border-2 border-ink text-sm font-black text-ink transition-transform group-hover:rotate-12">
                M&CS
              </p>
              <span className="text-xl font-extrabold tracking-tight text-ink">
                Maths<span className="text-coral">CS</span>.hub
              </span>
            </Link>

            <p className="max-w-sm text-sm font-medium text-ink-muted leading-relaxed">
              An open, student-maintained directory for Mathematics & Computer
              Science undergraduates. Built to turn messy academic clutter on
              your devices into structured, accessible knowledge.
            </p>

            <div className="inline-flex items-center gap-2   bg-canvas px-3.5 py-1 text-xs font-bold text-ink">
              Maintained for the Cohort
            </div>
          </div>

          {/* Quick Curriculum Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-ink">
              Curriculum Tracks
            </h4>
            <ul className="space-y-2">
              {FOOTER_NAV.curriculum.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-ink-muted transition-colors hover:text-coral"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contributing / GitHub */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-ink">
              Open Collaboration
            </h4>
            <ul className="space-y-2">
              {FOOTER_NAV.cohort.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm font-semibold text-ink-muted transition-colors hover:text-coral"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright  */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-ink-muted">
          <p>
            © {currentYear} Maths & CS Hub. Public domain academic reference.
          </p>

          <div className="inline-flex items-center gap-1.5">
            <span>Crafted with</span>
            <FaHeart className="size-3 text-coral" />
            <span>for the course mates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
