"use client";

import { SectionWrapperEditor } from "@shopkit/editor-bridge/client";
import { SectionWrapperCore } from "./SectionWrapperCore";

/**
 * SectionWrapper — picks the correct implementation at build time.
 *
 * NEXT_PUBLIC_ENABLE_EDITOR_CHANGES=true  →  SectionWrapperEditor (from package)
 *   Adds selection markers and subscribes to the override store so the
 *   editor preview reflects unsaved edits. Inert when no editor session
 *   is live.
 *
 * (default)                               →  SectionWrapperCore
 *   Original implementation, no editor-specific logic.
 */
const isEditorChangesEnabled =
  String(process.env.NEXT_PUBLIC_ENABLE_EDITOR_CHANGES).toLowerCase() ===
  "true";

const Wrapper = isEditorChangesEnabled
  ? SectionWrapperEditor
  : SectionWrapperCore;

export const SectionWrapper = (
  props: React.ComponentProps<typeof SectionWrapperCore>
) => <Wrapper {...props} />;

export default SectionWrapper;
