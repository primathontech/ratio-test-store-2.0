import { createPreviewCacheRoute } from "@shopkit/editor-bridge/server";

/**
 * POST /api/editor-preview/cache
 *
 * Iframe-side EditorHost mints a previewKey and POSTs the edited pageConfig +
 * routeContext here same-origin whenever a structural edit settles. The store
 * is the editor backend (shared across pods); the /internal-preview route reads
 * the same record back via createInternalPreviewPage. No CORS, no wiring beyond
 * mounting the factory.
 */
export const { POST } = createPreviewCacheRoute();
