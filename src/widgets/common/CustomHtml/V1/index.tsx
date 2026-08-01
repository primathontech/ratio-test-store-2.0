"use client";

import React, { memo, useEffect, useRef } from "react";
import { CustomHtmlProps } from "../types";

/**
 * CustomHtml V1 Component
 *
 * Renders raw HTML with support for <style> and <script> tags.
 * After hydration, it:
 * - Re-runs any <script> tags
 * - Wraps inline script code in a simple try/catch so logical errors
 *   don't break the whole page
 *
 * Error handling ensures that any errors in HTML/JS only affect this widget,
 * not the entire page.
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
  locale,
}: CustomHtmlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawHtml = settings?.html ?? "";

  // Use a stable id for logging; templates can pass a better one via settings later if needed
  const widgetId = "custom-html";

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !rawHtml) {
      return;
    }

    try {
      // Find and execute <script> tags (they don't auto-run from innerHTML)
      const scripts = Array.from(el.querySelectorAll("script"));
      scripts.forEach((oldScript) => {
        try {
          // eslint-disable-next-line no-restricted-syntax
          const newScript = document.createElement("script");

          // Inline scripts: wrap original code in a try/catch to prevent errors from breaking the page
          if (oldScript.textContent) {
            const originalCode = oldScript.textContent;

            const wrappedCode = `
              try {
                ${originalCode}
              } catch (error) {
                console.error('[CustomHtml Widget ${widgetId}] Script error:', error);
              }
            `;
            newScript.textContent = wrappedCode;
          }

          // External scripts: just re-attach src and log load failures
          if (oldScript.src) {
            newScript.onerror = () => {
              console.error(
                `[CustomHtml Widget ${widgetId}] Failed to load external script:`,
                oldScript.src
              );
            };
            newScript.src = oldScript.src;
          }

          if (oldScript.type) {
            newScript.type = oldScript.type;
          }

          // Safely replace script - check parent exists
          const parent = oldScript.parentNode;
          if (parent) {
            parent.replaceChild(newScript, oldScript);
          }
        } catch (error) {
          console.error(
            `[CustomHtml Widget ${widgetId}] Error processing script tag:`,
            error
          );
          // Continue processing other scripts even if one fails
        }
      });
    } catch (error) {
      console.error(
        `[CustomHtml Widget ${widgetId}] Error in script execution:`,
        error
      );
      // Allow widget to render even if script processing fails
    }
  }, [rawHtml, widgetId]);

  // Safe render - dangerouslySetInnerHTML is safe, but wrap in try/catch as extra safety
  try {
    return (
      <div
        ref={containerRef}
        className={className}
        data-custom-html-widget-id={widgetId}
        // eslint-disable-next-line react/no-danger, no-restricted-syntax
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      />
    );
  } catch (error) {
    // Fallback if rendering somehow throws (shouldn't happen, but safety first)
    console.error(`[CustomHtml Widget ${widgetId}] Rendering error:`, error);
    return <div className={className} data-custom-html-widget-id={widgetId} />;
  }
});

export { V1 as default };
