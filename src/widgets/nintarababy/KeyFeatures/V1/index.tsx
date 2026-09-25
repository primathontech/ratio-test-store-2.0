"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { KeyFeaturesProps, DEFAULT_HEADING, DEFAULT_FEATURES } from "../types";
import "../style.css";

// next/image throws (crashing the whole page) if `src` isn't a leading-slash
// path or an absolute URL. Placeholder/unset image values (e.g. the default
// "pdp-key-fe-1") would otherwise take down the render — guard against them.
const isRenderableImage = (src?: string): boolean =>
  !!src && (src.startsWith("/") || /^https?:\/\//.test(src));

/**
 * KeyFeatures V1 Component
 *
 * 4-column icon+label grid cloned from nintarababy.in product page.
 * Background: decorative leaf pattern (webp).
 * Heading: "The Little Details That Matter" centered, Figtree 700 32px.
 * Grid: 4 columns desktop, 2 columns tablet, 2 columns mobile (horizontal layout).
 * Icons: golden SVG star (64x63px desktop, 30px mobile).
 * Labels: Figtree 400 20px desktop, 14px mobile.
 *
 * Animation: IntersectionObserver scroll-reveal (translateY 2rem -> 0, opacity 0.01 -> 1).
 * All elements animate simultaneously, 0.6s cubic-bezier(0, 0, 0.3, 1).
 * Fires once only. Respects prefers-reduced-motion.
 */
export function V1({ data, settings, className }: KeyFeaturesProps) {
  const heading = data?.heading ?? settings?.heading ?? DEFAULT_HEADING;
  const features =
    (Array.isArray(data?.features) && data!.features!.length > 0
      ? data!.features!
      : null) ??
    (Array.isArray(settings?.features) && settings!.features!.length > 0
      ? settings!.features!
      : null) ??
    DEFAULT_FEATURES;
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasAnimated.current) {
      return;
    }

    /* Respect prefers-reduced-motion */
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      const offscreen = section.querySelectorAll(".nintara-kf-offscreen");
      offscreen.forEach((el) => {
        el.classList.remove("nintara-kf-offscreen");
      });
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const offscreen = section.querySelectorAll(".nintara-kf-offscreen");
            offscreen.forEach((el) => {
              el.classList.remove("nintara-kf-offscreen");
              el.classList.add("nintara-kf-reveal");
            });
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "0px 0px -50px 0px",
        threshold: 0,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`nintara-kf ${className ?? ""}`}
      aria-label="Key Features"
      // style={{
      //   backgroundImage: `url(${IMAGE_PATHS.backgroundDesktop})`,
      // }}
    >
      <div className="nintara-kf__inner">
        {/* Heading */}
        <div className="nintara-kf__top-heading nintara-kf-offscreen">
          <h3 className="nintara-kf__heading">{heading}</h3>
        </div>

        {/* Feature grid */}
        <div className="nintara-kf__grid">
          {features.map((feature) => (
            <div key={feature.image} className="nintara-kf__col">
              {/* Icon wrapper — skip the image when src is a placeholder /
                  invalid path (next/image would otherwise throw). */}
              <div className="nintara-kf__icon-wrap nintara-kf-offscreen">
                {isRenderableImage(feature.image) && (
                  <Image
                    className="nintara-kf__icon"
                    src={feature.image}
                    alt={feature.alt ?? feature.label ?? "Key Feature"}
                    width={120}
                    height={118}
                  />
                )}
              </div>

              {/* {feature.label && (
                <div className="nintara-kf__label-wrap nintara-kf-offscreen">
                  <p className="nintara-kf__label">{feature.label}</p>
                </div>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { V1 as default };
