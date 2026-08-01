"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  FAQsAccordionProps,
  FAQItem,
  DEFAULT_HEADING,
  DEFAULT_FAQ_ITEMS,
} from "../types";
import "../style.css";

/**
 * FAQsAccordion V1 Component
 *
 * FAQ accordion section cloned from nintarababy.in product page.
 * Layout: centered h4 heading, 7 accordion items below.
 * Each item has border-bottom 1px solid #ebe6e6.
 * Question row: h5 flex (question text left, +/- icon right).
 * Answer panel: max-height 0 -> scrollHeight, transition 0.2s ease-out.
 * Multiple items can be open simultaneously (Set<number> state).
 * No hover color change on question rows.
 * No scroll-reveal animation.
 */
export function V1({ data, className }: FAQsAccordionProps) {
  const heading = data?.heading ?? DEFAULT_HEADING;
  const items: FAQItem[] = data?.items ?? DEFAULT_FAQ_ITEMS;

  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = useCallback((index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  return (
    <section
      className={`nintara-faq ${className ?? ""}`}
      aria-label="Frequently Asked Questions"
    >
      <div className="nintara-faq__container">
        {/* Section heading */}
        <h4 className="nintara-faq__heading">{heading}</h4>

        {/* Accordion items */}
        {items.map((item, index) => {
          const isOpen = openIndices.has(index);
          const panelHeight = isOpen
            ? `${panelRefs.current[index]?.scrollHeight ?? 0}px`
            : "0";

          return (
            <div key={index} className="nintara-faq__item">
              {/* Question row */}
              <h5
                className={`nintara-faq__question${isOpen ? " nintara-faq__question--active" : ""}`}
                onClick={() => toggleItem(index)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`nintara-faq-panel-${index}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(index);
                  }
                }}
              >
                <span className="nintara-faq__question-text">
                  {item.question}
                </span>
                <span
                  className={`nintara-faq__icon${isOpen ? " nintara-faq__icon--minus" : ""}`}
                  aria-hidden="true"
                >
                  {isOpen ? "\u2212" : "+"}
                </span>
              </h5>

              {/* Answer panel */}
              <div
                id={`nintara-faq-panel-${index}`}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                className="nintara-faq__panel"
                style={{ maxHeight: panelHeight }}
                role="region"
                aria-labelledby={`nintara-faq-question-${index}`}
              >
                <p className="nintara-faq__answer">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { V1 as default };
