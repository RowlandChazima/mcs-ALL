// Usage:
//   pnpm notes:check     validate every note (no internet or keys needed)
//   pnpm notes:dry       compare with the database and show what would change
//   pnpm notes:push      validate, upload images/files, save notes, refresh the site
// Options:  --unit <slug>   only that unit folder
//           --prune         also delete database notes/downloads that no longer have a file
import * as dotenv from "dotenv";
import path from "node:path";
import { runPipeline, type Mode } from "./notes/pipeline";
import { createSupabaseStore } from "./notes/store";

dotenv.config({ path: ".env.local" });

const args = process.argv.slice(2);
const has = (flag: string) => args.includes(flag);
const unitFlag = args.indexOf("--unit");
const onlyUnit = unitFlag >= 0 ? args[unitFlag + 1] : undefined;
const mode: Mode = has("--check") ? "check" : has("--dry-run") ? "dry" : "push";

async function lookupVideo(id: string) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) return null;
  const data = (await res.json()) as { title?: string; author_name?: string };
  return { title: data.title ?? null, author: data.author_name ?? null };
}

async function revalidate() {
  const secret = process.env.REVALIDATE_SECRET;
  const site = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  if (!secret) {
    return { ok: false, message: "Saved. Site cache not refreshed because REVALIDATE_SECRET isn't set; visitors will see changes within an hour." };
  }
  try {
    const res = await fetch(`${site}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      signal: AbortSignal.timeout(10000),
    });
    return res.ok
      ? { ok: true, message: `Site refreshed (${site}).` }
      : { ok: false, message: `Saved, but ${site}/api/revalidate answered ${res.status}. Check SITE_URL and REVALIDATE_SECRET.` };
  } catch {
    return { ok: false, message: `Saved, but couldn't reach ${site} to refresh it (is the site running? is SITE_URL right?). Changes appear within an hour anyway.` };
  }
}

async function main() {
  let store;
  if (mode !== "check") {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.error("[x] Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
      process.exit(1);
    }
    store = createSupabaseStore(url, key);
  }

  const report = await runPipeline({
    notesDir: path.resolve("notes"),
    mode,
    store,
    prune: has("--prune"),
    onlyUnit,
    lookupVideo,
    revalidate,
  });
  process.exit(report.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(`\n[x] ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
