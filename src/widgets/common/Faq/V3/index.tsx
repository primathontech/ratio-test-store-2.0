"use client";

import React, { memo, useId } from "react";
import type { FaqAnimatedProps } from "./types";
import { resolveLogic } from "../../../_resolve";
import { useFaqLogic } from "../logic";
import { PresetText } from "../_shared/PresetText";
import { TypePreset } from "../_shared/typography";
import { schemeColorVars } from "../_shared/scheme-vars";
import "./style.css";

/**
 * FaqAnimated — V3 (client single-open accordion).
 *
 * Renders ONLY the VM (vm.v3 = its native settings, fully resolved by
 * logic.ts). The open/toggle state comes from useFaqLogic — the section's
 * stateful seam: a merchant fork can wrap it (analytics on question open,
 * multi-open behavior, …) via widgets/_overrides.ts under the
 * "Faq:useFaqLogic" key without touching this file.
 *
 * Look: narrow centered column (max 1000px) → heading → hairline rows; each
 * trigger shows the question left and a 28px circled chevron right (rotates
 * 180° when open); the answer reveals with a grid-rows 0fr→1fr height
 * animation (reduced-motion guarded in style.css).
 */

/** Heading-size buckets → the look's heading scale (33 / 43 / 50 px). */
const HEADING_SIZE: Record<string, string> = {
  small: "text-[33px] leading-[1.1] tracking-[0.025em]",
  medium: "text-[43px] leading-[1.1] tracking-[0.025em]",
  large: "text-[50px] leading-[1.1] tracking-[0.025em]",
};

/** Chevron — rotates 180° when its item is open (down → up). */
function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="cs-faq-v3__circle ml-[15px] flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border border-solid"
    >
      <svg
        viewBox="0 0 28 16"
        className={`block h-[10px] w-[14px] transition-transform duration-300 motion-reduce:transition-none ${
          open ? "rotate-180" : ""
        }`}
        fill="none"
      >
        <path
          d="M1.5 1.5 14 13l12.5-11.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export const V3 = memo(function V3({ vm, className }: FaqAnimatedProps) {
  const s = vm.v3 ?? {};
  const useLogic = resolveLogic("Faq:useFaqLogic", useFaqLogic);
  const { isOpen, toggle } = useLogic(vm);
  const baseId = useId();

  const heading = s.heading ?? "";
  const headingSizeClass =
    HEADING_SIZE[s.headingSize ?? "medium"] ?? HEADING_SIZE.medium;
  const items = s.faqs ?? [];

  const paddingTop = s.paddingTop ?? 75;
  const paddingBottom = s.paddingBottom ?? 75;

  // Text/divider/width extensions (unset = the look's original values).
  const scale =
    s.textSize === "small" ? 0.9 : s.textSize === "large" ? 1.15 : 1;
  const questionStyle: React.CSSProperties = {
    fontSize: `${17 * scale}px`,
    lineHeight: `${19.55 * scale}px`,
    letterSpacing: "0.425px",
    textTransform: s.textCase === "uppercase" ? "uppercase" : undefined,
  };
  const answerStyle: React.CSSProperties = {
    fontSize: `${17 * scale}px`,
    lineHeight: `${23.8 * scale}px`,
    letterSpacing: "0.425px",
  };
  const maxWidth =
    s.contentWidthPx === 0 ? "100%" : `${s.contentWidthPx ?? 1000}px`;

  const overrides: Record<string, string> = {
    "--cs-faq-v3-pt": `${paddingTop}px`,
    "--cs-faq-v3-pb": `${paddingBottom}px`,
    "--cs-faq-v3-pt-m": `${Math.round(paddingTop * 0.55)}px`,
    "--cs-faq-v3-pb-m": `${Math.round(paddingBottom * 0.55)}px`,
  };
  if (s.dividerWidth !== undefined) {
    overrides["--cs-faq-v3-line-w"] = `${s.dividerWidth}px`;
  }
  if (s.headingColor) {
    overrides["--cs-faq-v3-heading-color"] = s.headingColor;
  }
  if (s.questionColor) {
    overrides["--cs-faq-v3-question-color"] = s.questionColor;
  }
  if (s.answerColor) {
    overrides["--cs-faq-v3-answer-color"] = s.answerColor;
  }
  if (s.dividerColor) {
    overrides["--cs-faq-v3-line"] = s.dividerColor;
  }
  if (s.sectionBackground) {
    overrides["--cs-faq-v3-bg"] = s.sectionBackground;
  }

  return (
    <section
      className={["cs-faq-v3", className ?? ""].filter(Boolean).join(" ")}
      data-testid="faq"
      style={
        {
          ...schemeColorVars(s.colorScheme),
          ...overrides,
        } as React.CSSProperties
      }
    >
      <div
        className="mx-auto w-full px-[17px] min-[750px]:px-[40px]"
        style={{ maxWidth }}
      >
        <div
          className="mb-[20px]"
          style={
            { textAlign: s.headingAlignment ?? "left" } as React.CSSProperties
          }
        >
          {s.caption ? (
            <p
              className="cs-faq-v3__caption m-0 text-[13px] font-normal uppercase leading-[1.4] tracking-[1.3px]"
              data-testid="faq-caption"
            >
              {s.caption}
            </p>
          ) : null}
          {heading ? (
            <h2
              className={`cs-faq-v3__heading m-0 font-medium ${headingSizeClass}`}
              data-testid="faq-heading"
            >
              {heading}
            </h2>
          ) : null}
        </div>

        <div>
          {items.map((item, i) => {
            const open = isOpen(i);
            const panelId = `${baseId}-faq-${i}`;
            return (
              <div
                key={`${item.question}-${i}`}
                className="cs-faq-v3__item border-t border-solid last:border-b"
                data-testid="faq-row"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="cs-faq-v3__trigger flex w-full items-center justify-between py-[11px] text-left font-normal"
                  style={questionStyle}
                  data-testid="faq-question"
                >
                  <span>{item.question}</span>
                  <Chevron open={open} />
                </button>

                {/* Collapsible answer — grid-rows 0fr→1fr animates the height. */}
                <div
                  id={panelId}
                  role="region"
                  className={`cs-faq-v3__panel grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <PresetText
                      preset={TypePreset.Custom}
                      html={item.answer}
                      testId="faq-answer"
                      style={answerStyle}
                      className="cs-faq-v3__answer pb-[30px] font-normal [&_a]:underline [&_li]:mt-[4px] [&_p]:m-0 [&_p+p]:mt-[12px] [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-[18px]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export { V3 as default };
