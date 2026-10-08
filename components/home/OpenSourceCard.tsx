import { FaGithub } from "react-icons/fa6";

interface OpenSourceCardProps {
  githubRepoUrl?: string;
}

const OpenSourceCard = ({ githubRepoUrl }: OpenSourceCardProps) => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-3xl border-2 border-ink bg-surface p-8 md:p-12 shadow-chunky">
        <span className="text-xs uppercase tracking-widest font-black text-coral">
          Built For The Course / Open For All
        </span>
        <h3 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
          Notice a bug in the proofs or missing code examples? Fork it.
        </h3>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted leading-relaxed">
          This project was built to help our Mathematics & Computer Science
          cohort sail through first year and beyond. Everything is open source
          on GitHub. If you have extra tutorial sheets, past papers, or
          corrections:
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={`${githubRepoUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-white transition-all hover:bg-coral hover:shadow-chunky-sm"
          >
            <FaGithub className="size-5" />
            <span>Fork Repo & Submit PR</span>
          </a>
          <a
            href={`${githubRepoUrl}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3.5 font-bold text-ink transition-colors hover:bg-butter"
          >
            <span>Open an Issue</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceCard;
