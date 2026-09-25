"use client";

import React from "react";
import Image from "next/image";
import { OurPromiseProps, DEFAULT_PROMISES, type PromiseItem } from "../types";
import "../style.css";

const DEFAULT_CENTER_IMAGE = "/assets/momsco/images/home/Mom-baby.webp";

/**
 * OurPromise V1 Component
 *
 * Desktop: 3-column layout — left promises, center image, right promises.
 * Mobile: Image on top, then a vertical list of promise items.
 */
export function V1({ data, settings, className }: OurPromiseProps) {
  const s = settings as Record<string, any> | undefined;

  // Build promises from flat settings keys, falling back to array or defaults
  const hasFlatPromiseKeys =
    !!s && Object.keys(s).some((k) => /^promise[1-4]_/.test(k));
  const promises: PromiseItem[] = (() => {
    if (hasFlatPromiseKeys) {
      return [1, 2, 3, 4].map((n) => ({
        icon: s![`promise${n}_icon`] ?? DEFAULT_PROMISES[n - 1].icon,
        title: s![`promise${n}_title`] ?? DEFAULT_PROMISES[n - 1].title,
        description:
          s![`promise${n}_description`] ?? DEFAULT_PROMISES[n - 1].description,
      }));
    }
    if (s?.promises && Array.isArray(s.promises) && s.promises.length > 0) {
      return s.promises;
    }
    if (data?.promises && data.promises.length > 0) {
      return data.promises;
    }
    return DEFAULT_PROMISES;
  })();

  const centerImage = s?.centerImage || "";
  const centerImageAlt = s?.centerImageAlt || "Mom and baby - our promise";

  // Size settings (with sensible defaults matching original hardcoded values).
  // Image heights are kept as static aspect-ratio hints for Next.js — actual
  // rendered height is computed via CSS `height: auto` from the image's
  // intrinsic aspect ratio.
  const centerImageWidth = Number(s?.centerImageWidth) || 400;
  const centerImageMobileWidth = Number(s?.centerImageMobileWidth) || 380;
  const iconSize = Number(s?.iconSize) || 64;
  const iconSizeMobile = Number(s?.iconSizeMobile) || 40;

  // Split promises: first 2 for left column, last 2 for right column
  const leftPromises = promises.slice(0, 2);
  const rightPromises = promises.slice(2, 4);

  // If no promise has title or description, render mobile list as a grid of icons
  const isIconOnly = promises.every((p) => !p.title && !p.description);

  return (
    <section className={`nintara-op ${className ?? ""}`}>
      {/* ── Desktop Layout ── */}
      <div className="nintara-op__desktop">
        <div className="nintara-op__col nintara-op__col--left">
          {leftPromises.map((item, i) => (
            <div key={i} className="nintara-op__item">
              <div className="nintara-op__icon-wrap">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={iconSize}
                  height={iconSize}
                  style={{ width: iconSize, height: iconSize }}
                  className="nintara-op__icon"
                />
              </div>
              <h3 className="nintara-op__title">{item.title}</h3>
              <p className="nintara-op__desc">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="nintara-op__center">
          <Image
            src={centerImage}
            alt={centerImageAlt}
            width={centerImageWidth}
            height={480}
            style={{ maxWidth: centerImageWidth }}
            className="nintara-op__center-img"
          />
        </div>

        <div className="nintara-op__col nintara-op__col--right">
          {rightPromises.map((item, i) => (
            <div key={i} className="nintara-op__item">
              <div className="nintara-op__icon-wrap">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={iconSize}
                  height={iconSize}
                  style={{ width: iconSize, height: iconSize }}
                  className="nintara-op__icon"
                />
              </div>
              <h3 className="nintara-op__title">{item.title}</h3>
              <p className="nintara-op__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile Layout ── */}
      <div className="nintara-op__mobile">
        <div className="nintara-op__mobile-img-wrap">
          <Image
            src={centerImage}
            alt={centerImageAlt}
            width={centerImageMobileWidth}
            height={460}
            style={{ maxWidth: centerImageMobileWidth }}
            className="nintara-op__mobile-img"
          />
        </div>

        <div
          className={`nintara-op__mobile-list${
            isIconOnly ? " nintara-op__mobile-list--grid" : ""
          }`}
        >
          {promises.map((item, i) => (
            <div key={i} className="nintara-op__mobile-item">
              <div className="nintara-op__mobile-icon-wrap">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={iconSizeMobile}
                  height={iconSizeMobile}
                  style={{ width: iconSizeMobile, height: iconSizeMobile }}
                  className="nintara-op__mobile-icon"
                />
              </div>
              {item.title || item.description ? (
                <div className="nintara-op__mobile-text">
                  <h3 className="nintara-op__mobile-title">{item.title}</h3>
                  <p className="nintara-op__mobile-desc">{item.description}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { V1 as default };
