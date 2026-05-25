import { createPreviewCacheRoute } from "@shopkit/editor-bridge/server";

/**
 * POST /api/editor-preview/cache
 *
 * Iframe-side EditorHost mints a previewKey and POSTs the edited
 * pageConfig here same-origin whenever a structural edit settles; the
 * page render at /?previewKey=... reads back via readEditorPreviewState.
 *
 * Cache instance is owned internally by @shopkit/editor-bridge — both
 * this handler and the page-side reader share the same singleton. No
 * CORS, no wiring beyond mounting the factory.
 */
export const { POST } = createPreviewCacheRoute();
