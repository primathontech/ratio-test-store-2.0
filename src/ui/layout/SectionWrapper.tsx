"use client";

import { SectionWrapperCore } from "./SectionWrapperCore";
import { SectionWrapperEditor } from "./SectionWrapperEditor";

/**
 * SectionWrapper — picks the correct implementation at build time.
 *
 * NEXT_PUBLIC_ENABLE_EDITOR_CHANGES=true  →  SectionWrapperEditor
 *   Adds CSS visibility classes and JS-based visibility for the editor preview.
 *
 * (default)                               →  SectionWrapperCore
 *   Original implementation, no editor-specific logic.
 */
export const SectionWrapper = process.env.NEXT_PUBLIC_ENABLE_EDITOR_CHANGES
  ? SectionWrapperEditor
  : SectionWrapperCore;

export default SectionWrapper;
