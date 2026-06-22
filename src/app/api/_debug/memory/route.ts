// Env-gated memory diagnostic endpoint.
//
// Enable by setting ENABLE_MEM_DEBUG=true in the deployment env; returns 404 otherwise.
// Read it:  curl -s <pod>/api/_debug/memory | jq
//
// Purpose: bblunt has no OTel/Sentry runtime metrics, so this is how we read the
// JS-heap-vs-native split under load. If `heapUsed` climbs -> JS retention; if
// `external`/`offHeap` climb while heapUsed stays flat -> native/undici (un-drained
// upstream response bodies in the @shopkit/data-layer commerce client).

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.ENABLE_MEM_DEBUG !== "true") {
    return NextResponse.json({ error: "disabled" }, { status: 404 });
  }

  const m = process.memoryUsage();
  const MB = (n: number) => Math.round((n / 1024 / 1024) * 10) / 10;

  return NextResponse.json(
    {
      ts: Date.now(),
      uptimeSec: Math.round(process.uptime()),
      pid: process.pid,
      rssMB: MB(m.rss), // total resident — what cAdvisor / HPA see
      heapUsedMB: MB(m.heapUsed), // V8 JS heap (objects) -> climbs = JS leak
      heapTotalMB: MB(m.heapTotal),
      externalMB: MB(m.external), // C++/Buffers tied to JS -> native
      arrayBuffersMB: MB(m.arrayBuffers), // ArrayBuffer/Buffer bytes -> undici bodies/sockets
      offHeapMB: MB(m.rss - m.heapUsed), // share of RSS that is NOT the JS heap
    },
    { headers: { "cache-control": "no-store" } }
  );
}
