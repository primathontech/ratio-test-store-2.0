/* eslint-disable */
// TEMPORARY memory diagnostic endpoint — revert after the leak test.
//
//   curl -s https://store.bblunt.com/api/debug/memory            # current snapshot (this pod)
//   curl -s 'https://store.bblunt.com/api/debug/memory?history=1' # full in-pod ring buffer
//
// The history buffer is self-durable: it lives in the pod and is pulled on demand,
// so it does NOT depend on stdout being shipped to SignOz/CloudWatch. Multi-pod:
// each call hits one pod (its own `host` + buffer); poll a few times to cover all pods.

import { NextResponse } from "next/server";
import os from "os";
import { startMemMonitor, getMemHistory } from "@/lib/debug/mem-monitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Belt-and-suspenders: guarantees the sampler runs even if instrumentation.ts
// didn't fire. startMemMonitor() is idempotent.
startMemMonitor();

export async function GET(req: Request) {
  if (new URL(req.url).searchParams.get("history") === "1") {
    return NextResponse.json(getMemHistory(), {
      headers: { "cache-control": "no-store" },
    });
  }

  const m = process.memoryUsage();
  const MB = (n: number) => Math.round((n / 1024 / 1024) * 10) / 10;
  const hist = getMemHistory();

  return NextResponse.json(
    {
      ts: Date.now(),
      uptimeSec: Math.round(process.uptime()),
      pid: process.pid,
      host: os.hostname(),
      rssMB: MB(m.rss),
      heapUsedMB: MB(m.heapUsed),
      heapTotalMB: MB(m.heapTotal),
      externalMB: MB(m.external),
      arrayBuffersMB: MB(m.arrayBuffers),
      offHeapMB: MB(m.rss - m.heapUsed),
      samplesBuffered: hist.count,
      hint: "add ?history=1 for the full in-pod trend (self-durable)",
    },
    { headers: { "cache-control": "no-store" } }
  );
}
