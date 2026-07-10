/* eslint-disable */
import { startMemMonitor } from "./src/lib/debug/mem-monitor";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // TEMPORARY: per-pod memory/handle sampler for leak diagnosis (revert later).
    startMemMonitor();
  }
}
