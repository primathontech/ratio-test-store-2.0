import React, { memo } from "react";
import type { CSSProperties } from "react";
import type {
  FaqAccordionProps,
  FaqAccordionRow,
  FaqAccordionSettings,
} from "./types";
import { PresetText } from "../_shared/PresetText";
import { TypePreset } from "../_shared/typography";
import { schemeColorVars } from "../_shared/scheme-vars";
import "./style.css";

/**
 * FaqAccordion — V2 (heading over flat accordion rows).
 *
 * Renders ONLY the VM (vm.v2 = its native settings, fully resolved by
 * logic.ts). Each row is a native `<details>/<summary>` — zero client JS.
 * The caret/plus modifier, dividers, and per-row open state come straight
 * from the extension; type presets resolve through the folder's shared
 * typography tokens.
 */

/** Chevron toggle — rotates on [open] via CSS. */
function CaretIcon() {
  return (
    <svg viewBox="0 0 10 6" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Plus toggle — becomes a minus on [open] via CSS. */
function PlusIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M1 7h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        className="cs-faq-v2__plus-bar"
        d="M7 1v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Renderable rows (drops rows without a heading defensively). */
function resolveRows(rows?: FaqAccordionRow[]): FaqAccordionRow[] {
  return Array.isArray(rows) ? rows.filter((r) => r && r.heading?.trim()) : [];
}

/** Inline CSS-variable style for the section root (scheme colors + box vars). */
function rootVars(s: FaqAccordionSettings): CSSProperties {
  const vars: Record<string, string> = {
    ...schemeColorVars(s.color_scheme),
    "--cs-faq-v2-gap": `${s.gap ?? 24}px`,
    "--cs-faq-v2-pt": `${s["padding-block-start"] ?? 48}px`,
    "--cs-faq-v2-pb": `${s["padding-block-end"] ?? 48}px`,
  };
  if (s.divider_color) {
    vars["--cs-faq-v2-divider"] = s.divider_color;
  }
  if (s.heading_color) {
    vars["--cs-faq-v2-heading-color"] = s.heading_color;
  }
  if (s.question_color) {
    vars["--cs-faq-v2-question-color"] = s.question_color;
  }
  if (s.answer_color) {
    vars["--cs-faq-v2-answer-color"] = s.answer_color;
  }
  if (s.section_background) {
    vars["--cs-faq-v2-bg"] = s.section_background;
  }
  return vars as CSSProperties;
}

export const V2 = memo(function V2({ vm, className }: FaqAccordionProps) {
  const s = vm.v2 ?? {};
  const rows = resolveRows(s.rows);
  if (!rows.length && !s.heading) {
    return null;
  }

  const fullWidth = s.section_width === "full-width";
  const plus = s.icon === "plus";
  const showDividers = s.dividers !== false; // default: true
  const rowPreset = s.row_preset ?? TypePreset.H6;

  const rootClass = [
    "cs-faq-v2",
    fullWidth ? "" : "cs-faq-v2--page",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const accordionClass = [
    "cs-faq-v2__accordion",
    plus ? "cs-faq-v2__accordion--plus" : "cs-faq-v2__accordion--caret",
    showDividers ? "cs-faq-v2__accordion--dividers" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={rootClass} style={rootVars(s)} data-testid="faq">
      <div className="cs-faq-v2__content">
        {s.caption ? (
          <p
            className="cs-faq-v2__caption"
            style={
              { textAlign: s.heading_alignment ?? "center" } as CSSProperties
            }
            data-testid="faq-caption"
          >
            {s.caption}
          </p>
        ) : null}
        {s.heading ? (
          <PresetText
            as="h2"
            preset={s.heading_preset ?? TypePreset.H3}
            html={s.heading}
            className="cs-faq-v2__heading"
            testId="faq-heading"
            style={
              { textAlign: s.heading_alignment ?? "center" } as CSSProperties
            }
          />
        ) : null}
        <div className={accordionClass}>
          {rows.map((row, i) => (
            <details
              key={i}
              className="cs-faq-v2__row"
              data-testid="faq-row"
              open={row.open_by_default}
            >
              <summary
                className="cs-faq-v2__summary"
                data-testid="faq-question"
              >
                <PresetText
                  as="span"
                  preset={rowPreset}
                  className="cs-faq-v2__title"
                >
                  {row.heading}
                </PresetText>
                <span className="cs-faq-v2__icon cs-faq-v2__icon--caret">
                  <CaretIcon />
                </span>
                <span className="cs-faq-v2__icon cs-faq-v2__icon--plus">
                  <PlusIcon />
                </span>
              </summary>
              {row.body?.trim() ? (
                <div className="cs-faq-v2__panel" data-testid="faq-answer">
                  <PresetText
                    preset={TypePreset.Rte}
                    html={row.body}
                    className="cs-faq-v2__body"
                  />
                </div>
              ) : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
});

export { V2 as default };
