"use client";

import React, { memo } from "react";
import { CustomHtmlProps } from "../types";
import "./styles.css";

/**
 * CustomHtml V1 — rich-text body (policy pages and similar).
 *
 * Body HTML comes from the visual editor (Quill richtext) as plain
 * semantic tags. All styling lives in `./styles.css`, scoped to
 * `.custom-html-body`.
 */

export const V1 = memo(function V1({ settings, className }: CustomHtmlProps) {
  const body = settings?.body ?? "";

  return (
    <div className={`bg-white ${className ?? ""}`}>
      <div
        className="custom-html-body text-black text-[14px] md:text-[16px] leading-[1.7]"
        // eslint-disable-next-line react/no-danger, no-restricted-syntax
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
});

export { V1 as default };
