/* eslint-disable */
// TEMPORARY leak diagnostic — revert after the root cause is found.
//
// Self-durable: keeps an in-pod ring buffer of ~2 days of 1-min samples and
// serves it via GET /api/debug/memory?history=1. No log-pipeline dependency —
// pull the full per-pod trend with one curl, anytime, laptop-independent.
//
// Reading the trend (per pod / host):
//   - extMB up + sockets up      -> undici socket/body leak (native)
//   - timers up                  -> leaked timers (AbortSignal/setTimeout)
//   - heapMB up, handles flat     -> JS heap retention (take a heap snapshot)
//   - flat                        -> no leak on this path
//
// MEM_HEAPSNAP=true also writes a heap snapshot every 6h (pauses event loop;
// drained pods only) for object-level naming.

import os from "os";

let started = false;

type ProcWithResources = NodeJS.Process & {
  getActiveResourcesInfo?: () => string[];
};

export type MemSample = {
  t: number; // epoch ms
  up: number; // process uptime (s)
  rssMB: number;
  heapMB: number;
  extMB: number;
  abMB: number;
  offMB: number;
  handles: number;
  sockets: number; // TCPSocketWrap + TLSWrap
  timers: number; // Timeout + Immediate
};

const MAX_SAMPLES = 3000; // ~2 days at 1 sample/min
const host = os.hostname();
const history: MemSample[] = [];

export function getMemHistory() {
  return { host, count: history.length, samples: history };
}

export function startMemMonitor(): void {
  if (started) return;
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") return;
  started = true;

  const MB = (n: number) => Math.round((n / 1048576) * 10) / 10;

  const tick = () => {
    try {
      const m = process.memoryUsage();
      const getRes = (process as ProcWithResources).getActiveResourcesInfo;
      const res = typeof getRes === "function" ? getRes.call(process) : [];
      let sockets = 0;
      let timers = 0;
      for (const r of res) {
        if (r === "TCPSocketWrap" || r === "TLSWrap") sockets++;
        else if (r === "Timeout" || r === "Immediate") timers++;
      }
      const s: MemSample = {
        t: Date.now(),
        up: Math.round(process.uptime()),
        rssMB: MB(m.rss),
        heapMB: MB(m.heapUsed),
        extMB: MB(m.external),
        abMB: MB(m.arrayBuffers),
        offMB: MB(m.rss - m.heapUsed),
        handles: res.length,
        sockets,
        timers,
      };
      history.push(s);
      if (history.length > MAX_SAMPLES) history.shift();
      console.log(JSON.stringify({ tag: "MEMMON", host, ...s }));
    } catch {
      /* never throw from the monitor */
    }
  };

  tick(); // record immediately on start
  const sampler = setInterval(tick, 60000);
  sampler.unref();

  if (process.env.MEM_HEAPSNAP === "true") {
    let n = 0;
    const snap = setInterval(async () => {
      try {
        const v8 = await import("node:v8");
        const file = `/tmp/heap-${host}-${++n}.heapsnapshot`;
        v8.writeHeapSnapshot(file);
        console.log(JSON.stringify({ tag: "MEMMON_SNAP", host, file }));
      } catch {
        /* ignore */
      }
    }, 6 * 60 * 60 * 1000);
    snap.unref();
  }
}
