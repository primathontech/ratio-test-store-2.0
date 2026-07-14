/**
 * Voice collections — the retrieval source for the "browse a collection" flow.
 *
 * The voice agent must NEVER guess collection handles (a guessed
 * /collections/best-sellers → empty page). This route returns the merchant's
 * REAL collections so the agent can pick a genuine handle and open the real
 * collection page. Same pattern as /api/nav-menu: the commerce client is
 * server-only (merchant-id header + no CORS), so the browser can't call it
 * directly — it reads through this same-origin proxy.
 *
 * Reuses `getCommerceClient().getCollections()` — the exact call the sitemap
 * uses — so it's the same Data-Cache-backed, backend-agnostic path every other
 * consumer uses. Returns a slim [{ handle, title }] list (the only fields the
 * agent needs) so the tool payload stays small.
 */

import { getCommerceClient } from "@/config";
import { voiceGuard } from "@/lib/voiceGuard";

// Guarded (origin + per-IP rate limit) via voiceGuard, which reads request
// headers — that makes this handler dynamic, so no route-level `revalidate`.
// Upstream stays cheap because getCommerceClient().getCollections() is itself
// Data-Cache-backed (the same path the sitemap uses).

interface VoiceCollection {
  handle: string;
  title: string;
}

export async function GET(req: Request) {
  const blocked = voiceGuard(req, "read", 150);
  if (blocked) return blocked;
  try {
    const client = getCommerceClient();
    const result = await client.getCollections({ first: 100 });

    const raw: unknown = (result as { data?: unknown })?.data;
    const list = Array.isArray(raw)
      ? (raw as Array<Record<string, unknown>>)
      : [];

    // Keep only entries with a usable handle; title falls back to name → handle.
    const collections: VoiceCollection[] = list
      .map((c) => {
        const handle = typeof c.handle === "string" ? c.handle : "";
        const title =
          (typeof c.title === "string" && c.title) ||
          (typeof c.name === "string" && (c.name as string)) ||
          handle;
        return { handle, title };
      })
      .filter((c) => c.handle.length > 0);

    return Response.json({ collections });
  } catch {
    // Graceful: the tool falls back to keyword search when the list is empty. Return
    // an empty list only — never echo the upstream/exception message to the client.
    return Response.json({ collections: [] });
  }
}
