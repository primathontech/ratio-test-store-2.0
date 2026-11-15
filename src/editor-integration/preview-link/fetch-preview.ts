import { cache } from "react";
import type { PageConfig } from "@shopkit/builder";
import { osMerchantHeaders } from "@/utils/os-headers";

const EDITOR_API_BASE =
  process.env.NEXT_PUBLIC_EDITOR_API_URL ||
  "https://api-gw-v4.dev.gokwik.in/uat/os-editor";

/**
 * Fetch a shareable preview snapshot by id (and optional version) from the
 * visual-editor backend:
 *   GET {EDITOR_API}/api/v1/getPreviewLink/{previewId}[?version=N]
 *     → { data: { pageConfig, version, … } }, 404 on miss/expire
 *
 * Latest version when `version` is omitted. Throws on miss. Reads are
 * unauthenticated + `no-store` (shareable; opaque id is the security boundary).
 */
/** A preview snapshot: the pageConfig plus the template it belongs to. */
export interface PreviewSnapshot {
  /** Template this snapshot was authored for (e.g. "dawn_products_default"). */
  templateId: string | null;
  pageConfig: PageConfig;
}

async function fetchPreview(
  previewId: string,
  version?: string | null
): Promise<PreviewSnapshot> {
  const qs = version ? `?version=${encodeURIComponent(version)}` : "";
  const url = `${EDITOR_API_BASE}/api/v1/getPreviewLink/${encodeURIComponent(
    previewId
  )}${qs}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      ...osMerchantHeaders(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
  if (!res.ok) {
    throw new Error(`Preview HTTP ${res.status}`);
  }

  const json = await res.json();
  const data = json?.data;
  const pageConfig = data?.pageConfig;
  if (!pageConfig?.sections) {
    throw new Error("Invalid preview pageConfig");
  }
  // Snapshots may omit `id` (the backend stores pageConfig as
  // {layout,sections,dataSources}); the renderer requires one, so fall back
  // to the previewId. Harmless when an id is already present.
  if (!pageConfig.id) {
    pageConfig.id = `preview-${previewId}`;
  }
  return { templateId: data?.templateId ?? null, pageConfig };
}

/**
 * Request-deduped preview lookup. Returns the snapshot (templateId+pageConfig),
 * or null when the preview is missing/expired/invalid (e.g. purged on publish).
 * Wrapped in React `cache()` so the template loader and the preview banner
 * share a SINGLE backend call per request and agree on whether a preview is
 * active — an expired link then renders pure live with no banner.
 *
 * NOTE: a snapshot belongs to ONE template. Callers must check `templateId`
 * against the current route before applying `pageConfig`, so a preview created
 * for one page (e.g. product) isn't rendered on another (e.g. home).
 */
export const getPreviewSnapshot = cache(
  async (
    previewId: string,
    version?: string | null
  ): Promise<PreviewSnapshot | null> => {
    try {
      return await fetchPreview(previewId, version);
    } catch {
      return null;
    }
  }
);

/**
 * Preview-mode config for the CURRENT route. The storefront always calls this
 * while in preview mode and renders whatever comes back — the backend owns the
 * matching/mapping: it returns the draft for the page being edited and the live
 * config for every other page. Returns null only on transport/backend failure
 * (caller then falls back to its local live resolution).
 */
export const getResolvedPreview = cache(
  async (
    previewId: string,
    version: string | null,
    themeId: string,
    templateId: string
  ): Promise<PageConfig | null> => {
    const params = new URLSearchParams({ themeId, templateId });
    if (version) {
      params.set("version", version);
    }
    const url = `${EDITOR_API_BASE}/api/v1/getPreviewLink/${encodeURIComponent(
      previewId
    )}?${params.toString()}`;
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          ...osMerchantHeaders(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
      if (!res.ok) {
        return null;
      }
      const json = await res.json();
      const pageConfig = json?.data?.pageConfig;
      if (!pageConfig?.sections) {
        return null;
      }
      if (!pageConfig.id) {
        pageConfig.id = `preview-${previewId}`;
      }
      return pageConfig;
    } catch {
      return null;
    }
  }
);
