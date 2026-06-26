/**
 * Shareable-preview cookie names.
 *
 * Kept in a dependency-free module so it can be imported from BOTH the edge
 * middleware and Node route handlers / the template loader without dragging in
 * `next/headers` or the resolver. Changing a name here keeps middleware, the
 * enter/exit handlers, the template loader, and PreviewExitBar in sync.
 */

/** httpOnly — the shareable preview id the loader resolves a snapshot from. */
export const PREVIEW_ID_COOKIE = "editorPreviewId";
/** httpOnly — pins a specific snapshot version (absent → latest). */
export const PREVIEW_VERSION_COOKIE = "editorPreviewVersion";
/** Non-httpOnly mirror flag the client "Exit preview" bar reads ("1"). */
export const PREVIEW_ACTIVE_COOKIE = "editorPreviewActive";
