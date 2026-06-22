/* eslint-disable */
// TEMPORARY memory diagnostic endpoint — revert after the leak test.
//
// Deploy-only: curl -s https://store.bblunt.com/api/debug/memory | jq
// Also boots the background MEMMON sampler on first load (fallback).

import { NextResponse } from "next/server";
import os from "os";
import { startMemMonitor } from "@/lib/debug/mem-monitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Belt-and-suspenders: guarantees the 30s sampler runs even if the Next
// instrumentation hook didn't fire. startMemMonitor() is idempotent.
startMemMonitor();

export async function GET() {
  const m = process.memoryUsage();
  const MB = (n: number) => Math.round((n / 1024 / 1024) * 10) / 10;

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
    },
    { headers: { "cache-control": "no-store" } }
  );
}
