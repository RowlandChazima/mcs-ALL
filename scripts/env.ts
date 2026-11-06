import * as dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export type TargetEnv = "staging" | "production";

export interface LoadedEnv {
  target: TargetEnv;
  envFile: string;
  supabaseUrl: string;
  anonKey: string;
  serviceKey?: string;
  host: string;
}

export function getTargetEnvFromArgs(): TargetEnv {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--env");
  if (idx >= 0 && args[idx + 1]) {
    const val = args[idx + 1].toLowerCase();
    if (val === "prod" || val === "production") return "production";
    if (val === "staging" || val === "stage") return "staging";
    throw new Error(`Unknown --env "${args[idx + 1]}". Use "--env staging" or "--env prod".`);
  }
  return "staging";
}

export function loadTargetEnv(options?: { requireServiceKey?: boolean }): LoadedEnv {
  const target = getTargetEnvFromArgs();
  const envFile = target === "production" ? ".env.production.local" : ".env.local";
  const absPath = path.resolve(envFile);

  if (!fs.existsSync(absPath)) {
    if (target === "production") {
      throw new Error(
        `Production config file "${envFile}" not found.\n` +
        `Create "${envFile}" with production SUPABASE keys (it is git-ignored).`
      );
    } else {
      throw new Error(
        `Staging config file "${envFile}" not found.\n` +
        `Create "${envFile}" with staging SUPABASE keys (it is git-ignored).`
      );
    }
  }

  // Load the selected environment file
  dotenv.config({ path: absPath, override: true });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let host = "unknown";
  try {
    if (supabaseUrl) {
      host = new URL(supabaseUrl).host;
    }
  } catch {
    host = supabaseUrl;
  }

  if (options?.requireServiceKey && !serviceKey) {
    throw new Error(`SUPABASE_SERVICE_ROLE_KEY is required in ${envFile} for this operation.`);
  }

  return {
    target,
    envFile,
    supabaseUrl,
    anonKey,
    serviceKey,
    host,
  };
}

export async function confirmProductionWrite(actionDescription: string): Promise<void> {
  const target = getTargetEnvFromArgs();
  if (target !== "production") return;

  if (process.env.CI || process.env.NON_INTERACTIVE) {
    if (process.env.CONFIRM_PROD_WRITE !== "yes") {
      throw new Error(`Production write aborted in non-interactive environment (set CONFIRM_PROD_WRITE=yes).`);
    }
    return;
  }

  const rl = readline.createInterface({ input, output });
  try {
    console.log(`\n⚠️  CAUTION: You are about to ${actionDescription} in PRODUCTION!`);
    const answer = await rl.question(`   Type "production" to proceed: `);
    if (answer.trim().toLowerCase() !== "production") {
      console.log(`Aborted by user.`);
      process.exit(1);
    }
  } finally {
    rl.close();
  }
}

