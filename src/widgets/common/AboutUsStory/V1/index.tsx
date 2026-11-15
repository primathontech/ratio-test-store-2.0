"use client";

import React, { memo } from "react";
import { AboutUsStoryProps } from "../types";

/* ------------------------------------------------------------------ */
/*  Ornamental Divider SVG                                             */
/*  Decorative separator: [curl] [dot] [line] [star] [line] [dot] [curl] */
/*  Rendered at 154x15px, centered below each heading.                 */
/* ------------------------------------------------------------------ */

const OrnamentalDivider = ({ color = "#000" }: { color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="154.469"
    height="14.946"
    viewBox="0 0 154.469 14.946"
    className="mx-auto block"
    aria-hidden="true"
  >
    <g transform="translate(-111.039 -675)">
      <g transform="translate(-1379.632 157.776)">
        <path
          d="M1497.8,533.729s-2.3-1.559-1.877-3.239a1.488,1.488,0,0,0-.278,1.989c.71.892-.559-.992-2.013,1.25,1.454,2.243,2.592.268,2.013,1.25a1.477,1.477,0,0,0,.278,1.989C1495.787,534.989,1497.8,533.729,1497.8,533.729Z"
          transform="translate(-2.961 -9.033)"
          fill={color}
        />
        <path
          d="M1508.979,536.113a1.157,1.157,0,1,1,1.157,1.157A1.157,1.157,0,0,1,1508.979,536.113Z"
          transform="translate(-11.153 -11.417)"
          fill={color}
        />
        <line
          x2="49.034"
          transform="translate(1582.053 524.696)"
          fill="none"
          stroke={color}
          strokeMiterlimit={10}
          strokeWidth={1}
        />
        <line
          x2="49.034"
          transform="translate(1503.51 524.696)"
          fill="none"
          stroke={color}
          strokeMiterlimit={10}
          strokeWidth={1}
        />
        <g transform="translate(1560.326 517.224)">
          <path
            d="M1688.82,524.5l-5.209-.8,1.122-1.95a.191.191,0,0,0-.08-.268.228.228,0,0,0-.187,0l-1.95,1.122-.8-5.209a.2.2,0,0,0-.24-.16c-.08.027-.161.08-.161.16l-.8,5.209-1.95-1.122a.191.191,0,0,0-.267.08.23.23,0,0,0,0,.187l1.123,1.95-5.21.8a.2.2,0,0,0-.16.241c.027.08.08.16.16.16l5.21.8-1.123,1.95a.191.191,0,0,0,.08.267.229.229,0,0,0,.187,0l1.95-1.122.8,5.21a.209.209,0,0,0,.24.16c.08-.027.16-.08.16-.16l.8-5.21,1.95,1.122a.19.19,0,0,0,.267-.08.226.226,0,0,0,0-.187l-1.122-1.95,5.209-.8a.208.208,0,0,0,.16-.241C1688.953,524.576,1688.9,524.5,1688.82,524.5Z"
            transform="translate(-1674.041 -517.224)"
            fill={color}
          />
        </g>
      </g>
      <path
        d="M1493.632,533.729s2.3-1.559,1.877-3.239a1.488,1.488,0,0,1,.278,1.989c-.71.892.559-.992,2.013,1.25-1.454,2.243-2.592.268-2.013,1.25a1.477,1.477,0,0,1-.278,1.989C1495.644,534.989,1493.632,533.729,1493.632,533.729Z"
        transform="translate(-1232.291 148.743)"
        fill={color}
      />
      <path
        d="M1511.293,536.113a1.157,1.157,0,1,0-1.157,1.157A1.157,1.157,0,0,0,1511.293,536.113Z"
        transform="translate(-1252.94 146.36)"
        fill={color}
      />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Default content blocks (from bblunt.com About Us page)             */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  V1 -- AboutUsStory                                                 */
/*  Four centered heading + ornamental SVG divider + paragraph blocks. */
/*  Container: 90% width, centered, 20px top/bottom padding.          */
/*  Typography: Gotham 400 (Montserrat substitute).                    */
/*  H2: 24px/29px, Paragraph: 16px/26px, Color: #1d1d1d.              */
/* ------------------------------------------------------------------ */

export const V1 = memo(function AboutUsStoryV1({
  settings,
  className,
}: AboutUsStoryProps) {
  const blocks = settings?.blocks || [];
  const textColor = settings?.textColor || "#1d1d1d";
  const dividerColor = settings?.dividerColor || "#000000";
  return (
    <section className={className || ""}>
      <div
        className="mx-auto w-[90%] py-5 text-center"
        style={{ color: textColor }}
      >
        {blocks.map((block, index) => (
          <div key={index}>
            {/* Heading block: h2 + ornamental divider */}
            <div className="mt-[30px] mb-5 text-center">
              <h2 className="mx-0 my-5 text-center text-2xl font-normal leading-[29px]">
                {block.heading}
              </h2>
              <OrnamentalDivider color={dividerColor} />
            </div>

            {/* Content paragraph */}
            <div className="mx-auto mb-[30px] px-[30px] text-center text-base leading-[26px]">
              {block.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
