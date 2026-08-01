"use client";

import React from "react";
import Image from "next/image";
import {
  HowToUseInstructionsProps,
  DEFAULT_HEADING,
  DEFAULT_STEPS,
  IMAGE_PATHS,
} from "../types";
import "../style.css";

/**
 * HowToUseInstructions V1
 *
 * Static two-column layout: text with 6 bullet steps (left) and lifestyle
 * product image (right) on desktop. On mobile, single column with image
 * stacked above text. Sage green (#e4edd3) card background with 20px
 * border-radius on desktop, 12px + 0.5px border on mobile.
 *
 * No animations -- fully static section per source.
 */
export function V1({ data, className }: HowToUseInstructionsProps) {
  const heading = data?.heading || DEFAULT_HEADING;
  const steps = data?.steps || DEFAULT_STEPS;
  const sectionCls =
    "nintara-htu__section" + (className ? " " + className : "");

  return (
    <section className={sectionCls}>
      <div className="nintara-htu__container">
        <div className="nintara-htu__instruction">
          <div className="nintara-htu__card">
            {/* Text column */}
            <div className="nintara-htu__text-col">
              <h4 className="nintara-htu__heading">{heading}</h4>
              {steps.map((step) => (
                <div key={step.id} className="nintara-htu__step">
                  <div className="nintara-htu__bullet">
                    <Image
                      src={IMAGE_PATHS.bulletIcon}
                      alt="bullet point"
                      width={24}
                      height={24}
                      className="nintara-htu__bullet-img"
                    />
                  </div>
                  <div className="nintara-htu__step-text">
                    <p className="nintara-htu__step-p">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image column */}
            <div className="nintara-htu__img-col">
              {/* Desktop image (hidden on mobile) */}
              <div className="nintara-htu__img-desktop">
                <Image
                  src={IMAGE_PATHS.desktopImage}
                  alt="How to Use"
                  width={700}
                  height={400}
                  className="nintara-htu__img"
                  priority={false}
                />
              </div>
              {/* Mobile image (hidden on desktop) */}
              <div className="nintara-htu__img-mobile">
                <Image
                  src={IMAGE_PATHS.mobileImage}
                  alt="How to Use"
                  width={304}
                  height={304}
                  className="nintara-htu__img-mobile-el"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
