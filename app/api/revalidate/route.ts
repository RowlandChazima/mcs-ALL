import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

// Called by `pnpm notes:push` after new notes are saved, so visitors see them
// on their next page load instead of up to an hour later.
// POST only, and refuses to do anything unless REVALIDATE_SECRET is set on the
// server AND the request carries the same value.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json(
      { error: "REVALIDATE_SECRET is not configured on this server" },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // expire: 0 -> never serve the old copy; the next visit fetches fresh data.
  revalidateTag("curriculum", { expire: 0 });
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
