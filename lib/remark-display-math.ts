// Authors write display maths the way VS Code, GitHub and Obsidian show it:
//
//     $$f(x) = 3x + 1$$          (one line)
//
// but remark-math treats a one-line $$...$$ as *inline* maths. That makes
// fractions small, puts a limit's subscript beside "lim" instead of under it,
// and glues consecutive lines of working onto one line. This plugin marks every
// $$...$$ as display maths so rehype-katex renders it as a centred block.
//
// No dependencies on purpose: it runs on the live site, not just in scripts.
interface MathNode {
  type: string;
  position?: { start: { offset?: number } };
  data?: { hProperties?: { className?: string[] } } & Record<string, unknown>;
  children?: MathNode[];
}

export function remarkDisplayMath() {
  return (tree: MathNode, file: { value?: unknown }) => {
    const source = typeof file.value === "string" ? file.value : "";

    const walk = (node: MathNode) => {
      if (node.type === "inlineMath") {
        const at = node.position?.start.offset;
        if (at !== undefined && source.startsWith("$$", at)) {
          node.data = {
            ...node.data,
            hProperties: {
              ...node.data?.hProperties,
              className: ["language-math", "math-display"],
            },
          };
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
