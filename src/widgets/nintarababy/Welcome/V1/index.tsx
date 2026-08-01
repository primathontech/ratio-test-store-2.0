import React from "react";
import Image from "next/image";
import { WelcomeProps } from "../types";
import {
  DEFAULT_BADGES,
  DEFAULT_BODY_TEXT,
  IMAGE_PATHS,
  type WelcomeBadge,
} from "../types";
import "../style.css";

/**
 * Welcome V1 Component
 *
 * Brand introduction section cloned from nintarababy.in.
 * Static section with no animations.
 *
 * Layout:
 * - Desktop (>650px): Full-width background image with content centered via
 *   absolute positioning + translate(-50%, -50%). 4-column badge grid.
 * - Tablet (660-950px): Same layout with padding and smaller body text.
 * - Mobile (<=650px): Desktop bg hidden. Inner section uses CSS background-image
 *   (mobile variant). 2-column badge grid with horizontal icon+text layout.
 */
export function V1({ data, settings, className }: WelcomeProps) {
  const imageOnly = settings?.imageOnly === true;
  const headingPrefix =
    settings?.headingPrefix ?? data?.headingPrefix ?? "Welcome to";
  const bodyText = settings?.bodyText ?? data?.bodyText ?? DEFAULT_BODY_TEXT;
  const logoPath = settings?.logoPath ?? IMAGE_PATHS.logo;
  const bgDesktopPath = settings?.bgDesktopPath ?? IMAGE_PATHS.bgDesktop;
  const badges: WelcomeBadge[] =
    Array.isArray(settings?.badges) && settings!.badges!.length > 0
      ? (settings!.badges as WelcomeBadge[])
      : data?.badges && data.badges.length > 0
        ? data.badges
        : DEFAULT_BADGES;

  const bgMobilePath = settings?.bgMobilePath ?? IMAGE_PATHS.bgMobile;

  if (imageOnly) {
    return (
      <section
        className={`nintara-welcome nintara-welcome--image-only ${className ?? ""}`.trim()}
        aria-label="Welcome banner"
        data-testid="momsco-home-welcome-section"
      >
        <div className="nintara-welcome__banner">
          <Image
            src={bgDesktopPath}
            alt="Welcome banner"
            width={1920}
            height={720}
            sizes="100vw"
            className="nintara-welcome__banner-img nintara-welcome__banner-img--desktop"
            priority={true}
            data-testid="momsco-home-welcome-banner"
          />

          <Image
            src={bgMobilePath}
            alt="Welcome banner"
            width={1080}
            height={1350}
            sizes="100vw"
            className="nintara-welcome__banner-img nintara-welcome__banner-img--mobile"
            priority={true}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`nintara-welcome ${className ?? ""}`}
      style={
        {
          "--nintara-welcome-mobile-bg-url": `url(${bgMobilePath})`,
        } as React.CSSProperties
      }
      aria-label="Welcome to Nintara Baby"
      data-testid="momsco-home-welcome-section"
    >
      {/* Desktop background image (hidden on mobile via CSS) */}
      <div className="nintara-welcome__banner">
        <Image
          src={bgDesktopPath}
          alt="Nintara welcome banner background"
          width={1600}
          height={420}
          className="nintara-welcome__banner-img"
          loading="lazy"
          priority={false}
        />
      </div>

      {/* Content overlay */}
      <div className="nintara-welcome__content">
        <div className="nintara-welcome__text-center">
          <h3 className="nintara-welcome__heading">{headingPrefix}</h3>

          <Image
            src={logoPath}
            alt="Nintara Baby"
            width={940}
            height={140}
            className="nintara-welcome__logo"
            loading="eager"
          />

          <p className="nintara-welcome__body">{bodyText}</p>
        </div>

        {/* Certification badges */}
        <div className="nintara-welcome__badges">
          {badges.map((badge) => (
            <div key={badge.label} className="nintara-welcome__badge-item">
              <Image
                src={badge.iconSrc}
                alt={badge.alt}
                width={60}
                height={60}
                className="nintara-welcome__badge-icon"
                loading="eager"
              />
              <p className="nintara-welcome__badge-label">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { V1 as default };
