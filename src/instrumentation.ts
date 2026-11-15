// Server traces → collector, when OTEL_EXPORTER_OTLP_TRACES_ENDPOINT is set.
// The NEXT_RUNTIME check must stay inline: it lets the bundler drop these Node-only
// imports from the edge build.

// Static files, the browser relay and health checks: high volume, no diagnostic value.
// Errors in a skipped request are dropped too, so robots.txt / sitemap.xml (real routes)
// stay traced.
const UNTRACED =
  /^\/(api\/obs$|health$|_next\/)|\.(png|jpe?g|webp|avif|gif|svg|ico|js|css|map|woff2?)$/;

export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
  ) {
    const { registerOTel } = await import("@vercel/otel");
    const { scrubSpanProcessor, skipPathsSampler } =
      await import("@shopkit/observability/server");
    const { observabilityResource } = await import("@/bootstrap/observability");

    // The exporter comes from OTEL_EXPORTER_OTLP_* env; passing one here too
    // would export every span twice.
    registerOTel({
      serviceName: "storefront-server",
      attributes: { app: "storefront", ...observabilityResource() },
      traceSampler: skipPathsSampler(UNTRACED),
      spanProcessors: [scrubSpanProcessor(), "auto"],
    });
  }
}

// Next doesn't record an error in a streamed page render (the browser shows the error
// page): recorded here with its digest, which the browser's report carries too.
export async function onRequestError(err: unknown) {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
  ) {
    const { recordServerError } = await import("@shopkit/observability/server");
    recordServerError(err);
  }
}
