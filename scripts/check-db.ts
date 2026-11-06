// Usage:
//   pnpm db:check              check staging database (default, .env.local)
//   pnpm db:check --env prod   check production database (.env.production.local)
// Reports whether env vars are set, whether tables exist, and what the PUBLIC
// (anon) key can actually see versus the admin (service-role) key.
// Never prints secret values.
import { createClient } from "@supabase/supabase-js";
import { loadTargetEnv } from "./env";

const env = loadTargetEnv();
const { supabaseUrl: url, anonKey, serviceKey, host, target, envFile } = env;

console.log(`\n🎯 Target database: [${target.toUpperCase()}] at ${host} (via ${envFile})`);

console.log("\n1) Environment variables");
for (const [name, value] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_ANON_KEY: anonKey,
  SUPABASE_SERVICE_ROLE_KEY: serviceKey,
})) {
  console.log(`   ${value ? "OK     " : "MISSING"} ${name}`);
}
if (!url || !anonKey) {
  console.log(`\n=> Fix the missing variables in ${envFile} first, then re-run.\n`);
  process.exit(1);
}

const opts = { auth: { persistSession: false } };
const anon = createClient(url, anonKey, opts);
const admin = serviceKey ? createClient(url, serviceKey, opts) : null;

const tables = ["academic_years", "units", "subtopics", "resources"];

async function count(client: typeof anon, table: string) {
  const { count, error } = await client
    .from(table)
    .select("*", { count: "exact", head: true });
  return { count: count ?? 0, error: error?.message ?? null };
}

async function main() {
  console.log("\n2) Row counts: what each key can see");
  console.log("   table             public(anon)   admin(service)");
  const missing: string[] = [];
  const rlsBlocked: string[] = [];
  const empty: string[] = [];

  for (const t of tables) {
    const a = await count(anon, t);
    const s = admin ? await count(admin, t) : null;
    const fmt = (r: { count: number; error: string | null } | null) =>
      !r ? "n/a" : r.error ? "ERROR" : String(r.count);
    console.log(`   ${t.padEnd(17)} ${fmt(a).padEnd(14)} ${fmt(s)}`);

    const err = a.error ?? s?.error;
    if (err) {
      console.log(`      ↳ ${err}`);
      missing.push(t);
    } else if (s && s.count > 0 && a.count === 0) {
      rlsBlocked.push(t);
    } else if (a.count === 0 && (!s || s.count === 0)) {
      empty.push(t);
    }
  }

  const { data: year } = await (admin ?? anon)
    .from("academic_years")
    .select("slug,title")
    .eq("slug", "year-1")
    .maybeSingle();
  console.log(`\n3) Row with slug "year-1": ${year ? `found ("${year.title}")` : "NOT FOUND"}`);

  console.log("\nDiagnosis");
  if (missing.length) {
    console.log(`   - Table problem on: ${missing.join(", ")}`);
    console.log("     => Run supabase/migration-001-curriculum.sql and migration-002-unit-page-fields.sql in the SQL editor.");
  }
  if (rlsBlocked.length) {
    console.log(`   - Data exists but the public key can't read: ${rlsBlocked.join(", ")}`);
    console.log("     => RLS is on without a read policy. Re-run section 5 of migration-001.");
  }
  if (!missing.length && !rlsBlocked.length && empty.includes("academic_years")) {
    console.log("   - Tables exist but are empty.");
    console.log(`     => Run: pnpm db:seed ${target === "production" ? "--env prod" : ""}  (and read its output for errors)`);
  }
  if (!missing.length && !rlsBlocked.length && !empty.includes("academic_years") && !year) {
    console.log('   - Rows exist but none has slug "year-1". Check the slug column.');
  }
  if (!missing.length && !rlsBlocked.length && year) {
    console.log("   - Database looks healthy. If the page still 404s, delete .next and restart.");
  }
  console.log("");
}

main().catch((e) => {
  console.error("check failed:", e);
  process.exit(1);
});
