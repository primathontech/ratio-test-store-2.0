// TEMPORARY leak diagnostic — revert after the root cause is found.
//
// Near-zero-overhead per-pod sampler. Logs one JSON line (tag "MEMMON") every
// 30s; query these in your log pipeline / SignOz over 1-2 days, group by `host`.
//
// Reading the per-pod trend:
//   - externalMB up + TCPSocketWrap/TLSWrap count up -> undici socket/body leak (native)
//   - Timeout count up                               -> leaked timers (AbortSignal/setTimeout)
//   - heapUsedMB up, handle counts flat              -> JS heap retention (take a heap snapshot)
//   - everything flat across pods                    -> no leak on this path
//
// MEM_HEAPSNAP=true also writes a heap snapshot every 6h. That PAUSES the event
// loop for seconds while serializing — only enable on a drained / no-traffic pod,
// then `kubectl cp` the file out and diff two snapshots in Chrome DevTools.

import os from "os";

let started = false;

type ProcWithResources = NodeJS.Process & {
  getActiveResourcesInfo?: () => string[];
};

export function startMemMonitor(): void {
  if (started) return;
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") return;
  started = true;

  const host = os.hostname();
  const MB = (n: number) => Math.round((n / 1048576) * 10) / 10;

  const sampler = setInterval(() => {
    try {
      const m = process.memoryUsage();
      const getRes = (process as ProcWithResources).getActiveResourcesInfo;
      const res = typeof getRes === "function" ? getRes.call(process) : [];
      const byType: Record<string, number> = {};
      for (const r of res) byType[r] = (byType[r] || 0) + 1;

      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify({
          tag: "MEMMON",
          host,
          uptimeSec: Math.round(process.uptime()),
          rssMB: MB(m.rss),
          heapUsedMB: MB(m.heapUsed),
          heapTotalMB: MB(m.heapTotal),
          externalMB: MB(m.external),
          arrayBuffersMB: MB(m.arrayBuffers),
          handles: res.length,
          byType,
        })
      );
    } catch {
      /* never throw from the monitor */
    }
  }, 30_000);
  sampler.unref();

  if (process.env.MEM_HEAPSNAP === "true") {
    let n = 0;
    const snap = setInterval(async () => {
      try {
        const v8 = await import("node:v8");
        const file = `/tmp/heap-${host}-${++n}.heapsnapshot`;
        v8.writeHeapSnapshot(file);
        // eslint-disable-next-line no-console
        console.log(JSON.stringify({ tag: "MEMMON_SNAP", host, file }));
      } catch {
        /* ignore */
      }
    }, 6 * 60 * 60 * 1000);
    snap.unref();
  }
}
