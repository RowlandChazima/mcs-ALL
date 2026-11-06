import type { ComponentProps } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkDisplayMath } from "@/lib/remark-display-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { PillBadge } from "@/components/ui/PillBadge";
import { FunctionPlot } from "@/components/curriculum/FunctionPlot";
import { CloudinaryImg } from "@/components/curriculum/CloudinaryImg";
import { YouTube } from "@/components/curriculum/YouTube";
import { NoteImage } from "@/components/curriculum/NoteImage";
import type { NoteComponentName } from "@/lib/note-components";

// Inside notes the badge should read like an inline highlight, not a hero pill.
function NotePill(props: ComponentProps<typeof PillBadge>) {
  return <PillBadge size="sm" {...props} />;
}

// Everything an author can use inside a note's markdown, e.g.
//   <PillBadge variant="butter">Exam Definition</PillBadge>
//   <FunctionPlot fn="x^2 - 4" />
//   <CloudinaryImg src="https://res.cloudinary.com/..." alt="..." caption="..." />
//   <YouTube url="https://youtu.be/..." title="Extra explanation" />
// Plain markdown images ![caption](url) are routed to NoteImage via `img`.
// `satisfies` makes TypeScript fail if lib/note-components.ts lists a tag that
// isn't provided here (the push script validates notes against that list).
const components = {
  PillBadge: NotePill,
  FunctionPlot,
  CloudinaryImg,
  YouTube,
  img: NoteImage,
} satisfies Record<NoteComponentName, unknown> & { img: unknown };

interface NotesRendererProps {
  content: string;
}

// Compiling is the only step that can throw on malformed MDX, so it is the
// only step inside try/catch. JSX is built outside it.
async function compileNotes(source: string) {
  try {
    const { content } = await compileMDX({
      source,
      components,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath, remarkDisplayMath],
          rehypePlugins: [
            // throwOnError:false -> a typo in one formula renders red instead
            // of taking the whole page down.
            [rehypeKatex, { throwOnError: false, strict: "ignore" }],
            [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
          ],
        },
      },
    });
    return content;
  } catch (err) {
    // Malformed MDX (unclosed tag, stray "{" ...) lands here.
    console.error("[notes] failed to compile MDX:", err);
    return null;
  }
}

export async function NotesRenderer({ content }: NotesRendererProps) {
  if (!content.trim()) {
    return (
      <p className="text-center text-sm font-bold text-ink-muted">
        Notes for this topic are coming soon.
      </p>
    );
  }

  const rendered = await compileNotes(content);

  if (!rendered) {
    return (
      <div className="rounded-2xl border-2 border-coral bg-coral/10 p-5 text-sm font-bold text-ink">
        These notes have a formatting error and can&apos;t be displayed yet.
      </div>
    );
  }

  return (
    <div className="notes prose prose-neutral max-w-none text-ink [overflow-wrap:anywhere]
      prose-headings:font-black prose-headings:tracking-tight prose-headings:text-ink prose-headings:leading-tight sm:prose-headings:leading-snug
      prose-h1:text-[1.75rem] sm:prose-h1:text-4xl
      prose-h2:text-[1.4rem] sm:prose-h2:text-2xl prose-h2:mt-8 sm:prose-h2:mt-10 prose-h2:mb-3 sm:prose-h2:mb-4
      prose-h3:text-[1.15rem] sm:prose-h3:text-xl prose-h3:mt-5 sm:prose-h3:mt-6 prose-h3:mb-2
      prose-p:text-base prose-p:leading-[1.7] prose-strong:text-ink
      prose-ul:ps-5 sm:prose-ul:ps-8 prose-ol:ps-5 sm:prose-ol:ps-8 prose-li:my-1.5 sm:prose-li:my-2">
      {rendered}
    </div>
  );
}
