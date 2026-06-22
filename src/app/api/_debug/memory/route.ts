// TEMPORARY memory diagnostic endpoint — revert this PR after the leak test.
//
// Deploy-only: no env flag, no scaling needed. Just deploy and curl it:
//   curl -s https://store.bblunt.com/api/_debug/memory | jq
//
// Multi-replica friendly: the LB routes each call to some pod; the `pid` field
// lets you bucket samples per pod. Poll it in a loop and group by pid to track
// each pod's memory over a load test.
//
// Reading it: bblunt has no OTel runtime metrics, so this is the JS-vs-native split.
//   - heapUsedMB climbs        -> JS object retention
//   - externalMB/offHeapMB climb while heapUsed flat -> native (undici / data-layer
//     un-drained upstream response bodies)

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const m = process.memoryUsage();
  const MB = (n: number) => Math.round((n / 1024 / 1024) * 10) / 10;

  return NextResponse.json(
    {
      ts: Date.now(),
      uptimeSec: Math.round(process.uptime()),
      pid: process.pid, // bucket samples by this when there are multiple replicas
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
