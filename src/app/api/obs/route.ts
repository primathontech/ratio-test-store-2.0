import {
  createRelayHandler,
  fileSourceMaps,
} from "@shopkit/observability/relay";
import { observabilityResource } from "@/bootstrap/observability";

const endpoint = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
// Collector auth (e.g. signoz-ingestion-key=…): the same env the server SDK reads.
const headers = Object.fromEntries(
  (process.env.OTEL_EXPORTER_OTLP_HEADERS ?? "")
    .split(",")
    .filter((pair) => pair.includes("="))
    .map((pair) => {
      const i = pair.indexOf("=");
      return [pair.slice(0, i).trim(), pair.slice(i + 1).trim()];
    })
);

// Browser telemetry relay: scrubs personal data, stamps server-trusted fields,
// resolves minified stacks, then forwards to the collector.
export const POST = endpoint
  ? createRelayHandler({
      endpoint,
      headers,
      trusted: observabilityResource(),
      // Written by `shopkit-move-sourcemaps .next/static .next/obs-sourcemaps` at build.
      sourceMaps: fileSourceMaps({
        urlPath: "/_next/static/",
        dir: ".next/obs-sourcemaps",
      }),
    })
  : () => new Response(null, { status: 404 });
