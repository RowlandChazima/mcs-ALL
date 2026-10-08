"use client";

import { useEffect, useRef, useState } from "react";

// Brand-friendly line colours: coral, ink, purple, blue.
const COLORS = ["#fa5d38", "#191a1d", "#6d4cd6", "#1d8fd1"];

// Inside notes (MDX) JavaScript expressions like fns={["x^2"]} are blocked on
// purpose (they could run server code), so array props are written as JSON
// strings instead:  fns='["x^2", "x^3"]'  xDomain="[-3, 3]"
// From regular TypeScript/React code you can still pass real arrays.
type MaybeJson<T> = T | string;

export interface FunctionPlotProps {
  /** One expression, e.g. "x^2 - 4", "sin(x)", "1/x" */
  fn?: string;
  /** Several expressions drawn together, e.g. fns='["x^2", "x^3"]' */
  fns?: MaybeJson<string[]>;
  /** Marked points, e.g. points="[[2, 0], [-2, 0]]" */
  points?: MaybeJson<[number, number][]>;
  title?: string;
  /** e.g. xDomain="[-3, 3]" */
  xDomain?: MaybeJson<[number, number]>;
  /** Leave out to keep a square-ish aspect ratio automatically. */
  yDomain?: MaybeJson<[number, number]>;
  height?: number | string;
  /** Enable mouse-wheel zoom and drag-to-pan. Off by default so the plot
   *  never hijacks page scrolling (especially on phones). */
  interactive?: boolean | string;
}

function parseJsonProp<T>(
  name: string,
  value: MaybeJson<T> | undefined,
): { value: T | undefined; error: string | null } {
  if (typeof value !== "string") return { value, error: null };
  try {
    return { value: JSON.parse(value) as T, error: null };
  } catch {
    return {
      value: undefined,
      error: `${name} must be valid JSON, e.g. ${name}="[-3, 3]" (got: ${value})`,
    };
  }
}

export function FunctionPlot({
  fn,
  fns: fnsProp,
  points: pointsProp,
  title,
  xDomain: xDomainProp,
  yDomain: yDomainProp,
  height: heightProp = 320,
  interactive: interactiveProp = false,
}: FunctionPlotProps) {
  // Inside notes every prop arrives as a string: height="400", interactive="true".
  const parsedHeight = Number(heightProp);
  const height = Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : 320;
  const interactive = interactiveProp === true || interactiveProp === "true";
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const parsedFns = parseJsonProp<string[]>("fns", fnsProp);
  const parsedPoints = parseJsonProp<[number, number][]>("points", pointsProp);
  const parsedX = parseJsonProp<[number, number]>("xDomain", xDomainProp);
  const parsedY = parseJsonProp<[number, number]>("yDomain", yDomainProp);

  const propError =
    parsedFns.error ?? parsedPoints.error ?? parsedX.error ?? parsedY.error;

  const expressions = parsedFns.value ?? (fn ? [fn] : []);
  const points = parsedPoints.value;
  const xDomain = parsedX.value ?? [-6, 6];
  const yDomain = parsedY.value;

  // MDX hands us fresh array objects on every render. Serialising the config
  // gives the effect a stable dependency, so it only redraws on real changes.
  const configKey = JSON.stringify({
    expressions,
    points,
    xDomain,
    yDomain,
    height,
    interactive,
  });

  useEffect(() => {
    const el = containerRef.current;
    const config = JSON.parse(configKey) as {
      expressions: string[];
      points?: [number, number][];
      xDomain: [number, number];
      yDomain?: [number, number];
      height: number;
      interactive: boolean;
    };
    if (!el || config.expressions.length === 0) return;

    let cancelled = false;

    async function draw() {
      try {
        // Loaded on demand so d3 + function-plot never weigh down pages
        // that have no plots, and so nothing touches `window` during SSR.
        const { default: functionPlot } = await import("function-plot");
        if (cancelled || !el) return;

        el.innerHTML = "";
        functionPlot({
          target: el,
          width: Math.max(el.clientWidth, 280),
          height: config.height,
          grid: true,
          disableZoom: !config.interactive,
          xAxis: { domain: config.xDomain },
          ...(config.yDomain ? { yAxis: { domain: config.yDomain } } : {}),
          data: [
            ...config.expressions.map((expr, i) => ({
              fn: expr,
              color: COLORS[i % COLORS.length],
            })),
            ...(config.points?.length
              ? [
                  {
                    points: config.points,
                    fnType: "points" as const,
                    graphType: "scatter" as const,
                    color: "#191a1d",
                    attr: { r: 5 },
                  },
                ]
              : []),
          ],
        });
        setError(null);
        setReady(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    draw();

    // Redraw when the container's width really changes (rotation, sidebar...).
    let lastWidth = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (Math.abs(el.clientWidth - lastWidth) > 8) {
        lastWidth = el.clientWidth;
        draw();
      }
    });
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      el.innerHTML = "";
    };
  }, [configKey]);

  const label = expressions.map((e) => `f(x) = ${e}`).join(",  ");

  return (
    <div className="my-6 rounded-2xl border-2 border-ink bg-surface p-4 shadow-chunky-sm not-prose">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/10 pb-2">
        <span className="text-xs font-black tracking-wide text-coral">
          {title ?? "Graph"}
        </span>
        <span className="font-mono text-xs font-bold text-ink">{label}</span>
      </div>

      {propError ? (
        <p className="rounded-xl border-2 border-coral bg-coral/10 p-4 text-sm font-bold text-ink">
          {propError}
        </p>
      ) : expressions.length === 0 ? (
        <p className="py-6 text-center text-sm font-bold text-ink-muted">
          This plot needs a function, e.g. fn=&quot;x^2&quot;.
        </p>
      ) : error ? (
        <p className="rounded-xl border-2 border-coral bg-coral/10 p-4 text-sm font-bold text-ink">
          Couldn&apos;t draw this graph: {error}
        </p>
      ) : (
        <div className="relative" style={{ minHeight: height }}>
          {!ready && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ink-muted">
              Loading graph…
            </span>
          )}
          <div
            ref={containerRef}
            role="img"
            aria-label={`Graph of ${label}`}
            className="w-full overflow-x-auto flex justify-center"
          />
        </div>
      )}
    </div>
  );
}
