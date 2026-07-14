import React, { memo } from "react";
import type {
  FaqCollapsibleProps,
  FaqCollapsibleHeadingSize,
  FaqCollapsibleImageRatio,
  FaqCollapsibleRow,
} from "./types";
import { schemeColorVars } from "../_shared/scheme-vars";
import "./style.css";

/**
 * FaqCollapsible — V1 (caption + heading over native <details> rows).
 *
 * Renders ONLY the VM (vm.v1 = its native settings, fully resolved by
 * logic.ts — including the unconfigured sample fall-through):
 *  - Centered heading (h1 token → 40px desktop / 30px mobile, weight 400),
 *    optional uppercase caption above.
 *  - "none" layout: narrow centered column (max 734px), rows separated by
 *    top/bottom hairlines. "row" layout: each row is a bordered card.
 *  - Optional media column beside the rows on tablet+ (image_first/_second).
 *  - Native <details>/<summary>: caret rotates 180° on open, summary hover
 *    tints the row and underlines the title. Zero client JS.
 */

/** Desktop/mobile font-size + line-height per heading token (source scale). */
const HEADING_DESKTOP_SIZE: Record<FaqCollapsibleHeadingSize, string> = {
  h2: "28px",
  h1: "40px",
  h0: "52px",
  hxl: "64px",
  hxxl: "80px",
};
const HEADING_MOBILE_SIZE: Record<FaqCollapsibleHeadingSize, string> = {
  h2: "22px",
  h1: "30px",
  h0: "40px",
  hxl: "44px",
  hxxl: "52px",
};
const HEADING_DESKTOP_LH: Record<FaqCollapsibleHeadingSize, string> = {
  h2: "36px",
  h1: "52px",
  h0: "60px",
  hxl: "72px",
  hxxl: "88px",
};
const HEADING_MOBILE_LH: Record<FaqCollapsibleHeadingSize, string> = {
  h2: "29px",
  h1: "39px",
  h0: "48px",
  hxl: "52px",
  hxxl: "60px",
};

/** Fixed media-column heights per image ratio (small/large crops). */
const IMAGE_RATIO_HEIGHT: Record<
  FaqCollapsibleImageRatio,
  { mobile: string; desktop: string }
> = {
  adapt: { mobile: "auto", desktop: "auto" },
  small: { mobile: "194px", desktop: "314px" },
  large: { mobile: "435px", desktop: "695px" },
};

/**
 * Convert a rich-text HTML string into plain paragraph strings, rendered as
 * real <p> elements (no dangerouslySetInnerHTML — this look predates the
 * shared PresetText and keeps the stricter no-HTML path).
 */
function htmlToParagraphs(html: string): string[] {
  const matches = html.match(/<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi);
  const source = matches && matches.length > 0 ? matches : [html];
  return source
    .map((chunk) =>
      chunk
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .trim()
    )
    .filter((line) => line.length > 0);
}

/** Decode the few HTML entities plain titles may carry. */
function decodeText(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"');
}

/** Accordion caret — rotates 180° on open via CSS. */
const Caret = () => (
  <svg
    className="cs-faq-v1__caret"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
      fill="currentColor"
    />
  </svg>
);

/** A single collapsible row. */
const AccordionRow = ({
  row,
  open,
  boxed,
}: {
  row: FaqCollapsibleRow;
  open: boolean;
  boxed: boolean;
}) => {
  const title = decodeText(row?.title ?? "");
  const paragraphs = htmlToParagraphs(row?.body ?? "");

  return (
    <div
      className={[
        "cs-faq-v1__accordion",
        boxed ? "cs-faq-v1__accordion--boxed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid="faq-row"
    >
      <details open={open}>
        <summary className="cs-faq-v1__summary" data-testid="faq-question">
          <h3 className="cs-faq-v1__summary-title">{title}</h3>
          <Caret />
        </summary>
        <div
          className="cs-faq-v1__content"
          role="region"
          data-testid="faq-answer"
        >
          {paragraphs.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </details>
    </div>
  );
};

export const V1 = memo(function V1({ vm, className }: FaqCollapsibleProps) {
  const s = vm.v1 ?? {};

  const caption = s.caption ?? "";
  const heading = s.heading ?? "";
  const headingSize = s.headingSize ?? "h1";
  const headingAlignment = s.headingAlignment ?? "center";
  const layout = s.layout ?? "none";
  const openFirstRow = s.openFirstRow ?? false;
  const image = s.image ?? "";
  const imageAlt = s.imageAlt ?? "";
  const imageRatio = s.imageRatio ?? "adapt";
  const imagePosition = s.imagePosition ?? "image_second";
  const rows = s.rows ?? [];
  const paddingTop = s.paddingTop ?? 36;
  const paddingBottom = s.paddingBottom ?? 36;
  const paddingTopMobile = Math.round(paddingTop * 0.75);
  const paddingBottomMobile = Math.round(paddingBottom * 0.75);

  const boxed = layout === "row";
  const hasImage = image.trim().length > 0;
  const ratioHeight = IMAGE_RATIO_HEIGHT[imageRatio];

  // Color extensions (empty = keep the scheme-driven default from style.css).
  const colorOverrides: Record<string, string> = {};
  if (s.headingColor) {
    colorOverrides["--cs-faq-v1-heading-color"] = s.headingColor;
  }
  if (s.questionColor) {
    colorOverrides["--cs-faq-v1-question-color"] = s.questionColor;
  }
  if (s.answerColor) {
    colorOverrides["--cs-faq-v1-answer-color"] = s.answerColor;
  }
  if (s.dividerColor) {
    colorOverrides["--cs-faq-v1-divider"] = s.dividerColor;
  }
  if (s.sectionBackground) {
    colorOverrides["--cs-faq-v1-bg"] = s.sectionBackground;
  }

  const Accordions = (
    <div className="cs-faq-v1__accordions">
      {rows.map((row, i) => (
        <AccordionRow
          key={`${row?.title ?? "row"}-${i}`}
          row={row}
          open={openFirstRow && i === 0}
          boxed={boxed}
        />
      ))}
    </div>
  );

  const ImageColumn = hasImage ? (
    <div className="cs-faq-v1__media-col">
      <div
        className="cs-faq-v1__media"
        data-testid="faq-media"
        style={
          imageRatio === "adapt"
            ? undefined
            : ({
                ["--cs-faq-v1-media-h-mobile" as string]: ratioHeight.mobile,
                ["--cs-faq-v1-media-h-desktop" as string]: ratioHeight.desktop,
              } as React.CSSProperties)
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={imageAlt}
          className="cs-faq-v1__img"
          loading="lazy"
        />
      </div>
    </div>
  ) : null;

  return (
    <div
      data-testid="faq"
      className={["cs-faq-v1", `cs-faq-v1--${layout}`, className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...schemeColorVars(s.colorScheme),
        ...colorOverrides,
        fontFamily: "var(--font-body--family)",
        ["--cs-faq-v1-pt-mobile" as string]: `${paddingTopMobile}px`,
        ["--cs-faq-v1-pb-mobile" as string]: `${paddingBottomMobile}px`,
        ["--cs-faq-v1-pt-desktop" as string]: `${paddingTop}px`,
        ["--cs-faq-v1-pb-desktop" as string]: `${paddingBottom}px`,
      }}
    >
      <div className="cs-faq-v1__wrapper">
        <div
          className={
            hasImage
              ? "cs-faq-v1__inner cs-faq-v1__inner--wide"
              : "cs-faq-v1__inner cs-faq-v1__inner--narrow"
          }
        >
          <div
            className="cs-faq-v1__header"
            style={{ textAlign: headingAlignment }}
          >
            {caption ? (
              <p className="cs-faq-v1__caption" data-testid="faq-caption">
                {caption}
              </p>
            ) : null}
            {heading ? (
              <h2
                className="cs-faq-v1__heading"
                data-testid="faq-heading"
                style={
                  {
                    fontWeight: 400,
                    letterSpacing: "0.6px",
                    ["--cs-faq-v1-fs-mobile" as string]:
                      HEADING_MOBILE_SIZE[headingSize],
                    ["--cs-faq-v1-lh-mobile" as string]:
                      HEADING_MOBILE_LH[headingSize],
                    ["--cs-faq-v1-fs-desktop" as string]:
                      HEADING_DESKTOP_SIZE[headingSize],
                    ["--cs-faq-v1-lh-desktop" as string]:
                      HEADING_DESKTOP_LH[headingSize],
                  } as React.CSSProperties
                }
              >
                {heading}
              </h2>
            ) : null}
          </div>

          {hasImage ? (
            <div
              className={[
                "cs-faq-v1__grid",
                imagePosition === "image_first"
                  ? "cs-faq-v1__grid--image-first"
                  : "cs-faq-v1__grid--image-second",
              ].join(" ")}
            >
              {ImageColumn}
              <div className="cs-faq-v1__col">{Accordions}</div>
            </div>
          ) : (
            Accordions
          )}
        </div>
      </div>
    </div>
  );
});

export { V1 as default };
