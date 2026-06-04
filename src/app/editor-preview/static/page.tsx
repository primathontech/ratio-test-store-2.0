"use client";

import { createStaticPreviewPage } from "@shopkit/editor-bridge/static";
import { ALLOWED_EDITOR_ORIGINS } from "@/editor-integration/editor-bridge-config";
import { STATIC_TEMPLATES_REGISTRY } from "@/editor-integration/registries";
import { getThemeName } from "@/utils";

/**
 * Editor-only preview route for static (translation-only) templates.
 *
 * Route shape: /editor-preview/static?editor=true&templateId={id}&lang={lang}
 *
 * The factory encapsulates the iframe-only branching, registry resolution,
 * override store reads, and the outbound editor:selectTranslationKey
 * postMessage fired on tEditable click. EditorHostMount in app/layout.tsx
 * provides the bridge listener; this page is purely the static-lane
 * render surface.
 *
 * @deprecated Static-template lane is on a retirement path — see
 * @shopkit/editor-bridge/static. Existing merchants keep working until
 * product removes the static templates entirely.
 */
export default createStaticPreviewPage({
  registry: STATIC_TEMPLATES_REGISTRY,
  getThemeName,
  allowedEditorOrigins: ALLOWED_EDITOR_ORIGINS,
});
