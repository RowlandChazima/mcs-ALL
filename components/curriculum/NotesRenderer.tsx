// import { MDXRemote } from "next-mdx-remote/rsc";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
// import rehypePrettyCode from "rehype-pretty-code";
// import { PillBadge } from "@/components/ui/PillBadge";
// // import { FunctionPlot } from "@/components/curriculum/FunctionPlot";
// import { CloudinaryImg } from "@/components/curriculum/CloudinaryImg";

// // const customComponents = {
// //   PillBadge,
// //   FunctionPlot,
// //   CloudinaryImg,
// // };

// interface NotesRendererProps {
//   content: string;
// }

// export function NotesRenderer({ content }: NotesRendererProps) {
//   return (
//     <div className="prose prose-neutral max-w-none text-ink prose-headings:font-black prose-headings:tracking-tight prose-headings:text-ink prose-p:leading-relaxed prose-code:font-mono prose-code:bg-canvas prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-ink/20">
//       <MDXRemote
//         source={content}
//         components={customComponents}
//         options={{
//           mdxOptions: {
//             remarkPlugins: [remarkMath],
//             rehypePlugins: [
//               rehypeKatex,
//               [
//                 rehypePrettyCode,
//                 {
//                   theme: "github-dark",
//                   keepBackground: true,
//                 },
//               ],
//             ],
//           },
//         }}
//       />
//     </div>
//   );
// }
