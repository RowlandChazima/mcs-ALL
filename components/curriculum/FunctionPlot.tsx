// "use client";

// import { useEffect, useRef } from "react";
// import functionPlot from "function-plot";

// interface FunctionPlotProps {
//   fn: string; // e.g., "x^2", "sin(x)", "1/x"
//   title?: string;
//   xDomain?: [number, number];
//   yDomain?: [number, number];
// }

// export function FunctionPlot({
//   fn,
//   title,
//   xDomain = [-6, 6],
//   yDomain = [-4, 6],
// }: FunctionPlotProps) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     try {
//       functionPlot({
//         target: containerRef.current,
//         width: containerRef.current.clientWidth || 500,
//         height: 320,
//         grid: true,
//         data: [
//           {
//             fn,
//             color: "#fa5d38", // Your primary coral accent
//           },
//         ],
//         xAxis: { domain: xDomain },
//         yAxis: { domain: yDomain },
//       });
//     } catch (err) {
//       console.error("Function plot failed to render:", err);
//     }
//   }, [fn, xDomain, yDomain]);

//   return (
//     <div className="my-6 rounded-2xl border-2 border-ink bg-surface p-4 shadow-chunky-sm">
//       {title && (
//         <div className="mb-2 flex items-center justify-between border-b-2 border-ink/10 pb-2">
//           <span className="text-xs font-black uppercase tracking-wider text-coral">
//             Interactive Plot
//           </span>
//           <span className="font-mono text-xs font-bold text-ink">
//             f(x) = {fn}
//           </span>
//         </div>
//       )}
//       <div
//         ref={containerRef}
//         className="w-full overflow-x-auto flex justify-center"
//       />
//     </div>
//   );
// }
