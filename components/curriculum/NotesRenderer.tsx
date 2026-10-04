import type { ComponentProps } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { PillBadge } from "@/components/ui/PillBadge";
import { FunctionPlot } from "@/components/curriculum/FunctionPlot";
import { CloudinaryImg } from "@/components/curriculum/CloudinaryImg";

// Inside notes the badge should read like an inline highlight, not a hero pill.
function NotePill(props: ComponentProps<typeof PillBadge>) {
  return <PillBadge size="sm" {...props} />;
}

// Everything an author can use inside a note's markdown, e.g.
//   <PillBadge variant="butter">Exam Definition</PillBadge>
//   <FunctionPlot fn="x^2 - 4" />
//   <CloudinaryImg src="https://res.cloudinary.com/..." alt="..." caption="..." />
const components = {
  PillBadge: NotePill,
  FunctionPlot,
  CloudinaryImg,
};

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
          remarkPlugins: [remarkGfm, remarkMath],
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
    <div className="notes prose prose-neutral max-w-none text-ink prose-headings:font-black prose-headings:tracking-tight prose-headings:text-ink prose-p:leading-relaxed prose-strong:text-ink">
      {rendered}
    </div>
  );
}
