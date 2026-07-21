import type { Metadata } from "next";

/**
 * JSON-LD structured data helpers.
 *
 * The @shopkit/seo layer computes structured data but stashes it into the Next
 * `metadata.other` field under this key. Next renders `other` entries as
 * `<meta name="..." content="...">` tags — so the schema ends up in a
 * `<meta name="script:type=application/ld+json">` tag that search engines
 * cannot read. These helpers let a page extract that payload and render it as a
 * real `<script type="application/ld+json">` instead (and strip the bogus meta
 * tag from the metadata so it isn't emitted twice).
 */

const LD_JSON_KEY = "script:type=application/ld+json";

/** Pull the JSON-LD payload the SEO layer stashed in `metadata.other`. */
export function extractJsonLd(metadata: Metadata): string | null {
  const other = metadata.other;
  const raw = other?.[LD_JSON_KEY];
  if (raw == null) {
    return null;
  }
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" ? value : String(value);
}

/**
 * Return a copy of `metadata` with the JSON-LD entry removed from `other`, so
 * Next doesn't emit the broken `<meta name="script:type=application/ld+json">`
 * tag. Use in `generateMetadata`; render the payload separately via `<JsonLd>`.
 */
export function stripJsonLd(metadata: Metadata): Metadata {
  const other = metadata.other;
  if (!other || !(LD_JSON_KEY in other)) {
    return metadata;
  }
  const rest = { ...other };
  delete (rest as Record<string, unknown>)[LD_JSON_KEY];
  return {
    ...metadata,
    other: Object.keys(rest).length > 0 ? rest : undefined,
  };
}

/**
 * Render a schema payload as a real JSON-LD `<script>`. Accepts either the raw
 * JSON string produced by the SEO layer or an object to be serialized. Renders
 * nothing when there's no data.
 */
export function JsonLd({
  data,
}: {
  data: string | Record<string, unknown> | unknown[] | null | undefined;
}) {
  if (data == null) {
    return null;
  }
  const json = typeof data === "string" ? data : JSON.stringify(data);
  if (!json || json === "null" || json === "[]" || json === "{}") {
    return null;
  }
  return (
    <script
      type="application/ld+json"
      // Schema JSON is produced server-side by @shopkit/seo, not user input.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
