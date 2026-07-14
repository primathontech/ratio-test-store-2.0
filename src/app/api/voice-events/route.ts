/**
 * Voice analytics sink (pilot). Receives the voice funnel events from
 * src/lib/voiceAnalytics.ts and writes them as structured JSON to the server log
 * — enough to build a funnel from logs during the pilot (grep `[voice-analytics]`).
 *
 * PRODUCTION: forward these to your warehouse / Segment / BigQuery instead of
 * (or in addition to) console — the payload shape is already flat and stable.
 * Accepts sendBeacon (text/plain body) and normal JSON POSTs alike.
 */

import { voiceGuard } from "@/lib/voiceGuard";

export async function POST(req: Request) {
  // Origin + rate guard so the open sink can't be spammed. Generous cap — a live
  // session emits many funnel events; a blocked beacon just drops (best-effort).
  const blocked = voiceGuard(req, "events", 600);
  if (blocked) return blocked;
  try {
    const text = await req.text();
    // Cap the beacon size so the open sink can't be used to push huge log volume.
    if (text.length > 16 * 1024) return new Response(null, { status: 413 });
    const data = text ? JSON.parse(text) : {};
    console.log(
      "[voice-analytics]",
      JSON.stringify({ ...data, at: new Date().toISOString() })
    );
  } catch {
    /* ignore malformed beacons — analytics is best-effort */
  }
  return new Response(null, { status: 204 });
}
