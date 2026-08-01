import React from "react";
import Link from "next/link";
import { ShopByCategoryProps } from "../types";
import { DEFAULT_CATEGORIES, type CategoryCard } from "../types";
import "../style.css";

const BASE_PATH = "/assets/nintarababy/shop-by-category";

/** Stable test IDs for the well-known category cards; others fall back to the generic id. */
const CATEGORY_TESTIDS: Record<string, string> = {
  "/collections/baby-care": "momsco-home-category-baby-care",
  "/collections/mom-care": "momsco-home-category-mom-care",
  "/collections/essentials": "momsco-home-category-essentials",
};

/**
 * SVG "NEW" badge — desktop variant (91x35px)
 * Pill shape with rounded right side. Fill: #C6D4F6, text: #092A33.
 */
function NewBadgeDesktop() {
  return (
    <svg
      className="nintara-sbc__badge-desktop"
      width="91"
      height="35"
      viewBox="0 0 91 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="New"
    >
      <path
        d="M0 12.9207C0 6.29324 5.37258 0.920654 12 0.920654H91V22.9207C91 29.5481 85.6274 34.9207 79 34.9207H0V12.9207Z"
        fill="#C6D4F6"
      />
      <path
        d="M25.78 24.9207V10.9207H27.8L35.72 21.6407V10.9207H37.7V24.9207H35.72L27.74 14.1007V24.9207H25.78ZM45.2283 25.1607C44.2549 25.1607 43.3949 24.9407 42.6483 24.5007C41.9016 24.0473 41.3149 23.4273 40.8883 22.6407C40.4616 21.854 40.2483 20.9473 40.2483 19.9207C40.2483 18.894 40.4616 17.9873 40.8883 17.2007C41.3149 16.414 41.9016 15.8007 42.6483 15.3607C43.4083 14.9073 44.2749 14.6807 45.2483 14.6807C46.1683 14.6807 46.9749 14.914 47.6683 15.3807C48.3616 15.834 48.9016 16.4873 49.2883 17.3407C49.6883 18.1807 49.8883 19.174 49.8883 20.3207H41.8083L42.1683 20.0207C42.1683 20.7273 42.3083 21.3407 42.5883 21.8607C42.8683 22.3807 43.2483 22.7807 43.7283 23.0607C44.2083 23.3273 44.7549 23.4607 45.3683 23.4607C46.0349 23.4607 46.5883 23.3073 47.0283 23.0007C47.4816 22.6807 47.8349 22.2807 48.0883 21.8007L49.7283 22.5607C49.4616 23.0807 49.1149 23.5407 48.6883 23.9407C48.2616 24.3273 47.7549 24.6273 47.1683 24.8407C46.5949 25.054 45.9483 25.1607 45.2283 25.1607ZM42.2883 19.1207L41.9083 18.8207H48.2283L47.8683 19.1207C47.8683 18.534 47.7483 18.034 47.5083 17.6207C47.2683 17.194 46.9483 16.874 46.5483 16.6607C46.1483 16.434 45.7016 16.3207 45.2083 16.3207C44.7283 16.3207 44.2616 16.434 43.8083 16.6607C43.3683 16.874 43.0016 17.1873 42.7083 17.6007C42.4283 18.014 42.2883 18.5207 42.2883 19.1207ZM60.6128 24.9207L63.9928 14.9207H65.8928L62.4928 24.9207H60.6128ZM53.8728 24.9207L57.1928 14.9207H58.9128L55.6328 24.9207H53.8728ZM53.7328 24.9207L50.3328 14.9207H52.2528L55.5528 24.9207H53.7328ZM60.6128 24.9207L57.3328 14.9207H59.0728L62.3728 24.9207H60.6128Z"
        fill="#092A33"
      />
    </svg>
  );
}

/**
 * SVG "NEW" badge — mobile variant (55x22px)
 */
function NewBadgeMobile() {
  return (
    <svg
      className="nintara-sbc__badge-mobile"
      width="55"
      height="22"
      viewBox="0 0 55 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="New"
    >
      <path
        d="M0.5 7.35522C0.5 2.93695 4.08172 -0.644775 8.5 -0.644775H54.5V13.3552C54.5 17.7735 50.9183 21.3552 46.5 21.3552H0.5V7.35522Z"
        fill="#C6D4F6"
      />
      <path
        d="M13.746 15.3552V5.55522H15.16L20.704 13.0592V5.55522H22.09V15.3552H20.704L15.118 7.78122V15.3552H13.746ZM27.3598 15.5232C26.6785 15.5232 26.0765 15.3692 25.5538 15.0612C25.0311 14.7439 24.6205 14.3099 24.3218 13.7592C24.0231 13.2086 23.8738 12.5739 23.8738 11.8552C23.8738 11.1366 24.0231 10.5019 24.3218 9.95122C24.6205 9.40056 25.0311 8.97122 25.5538 8.66322C26.0858 8.34589 26.6925 8.18722 27.3738 8.18722C28.0178 8.18722 28.5825 8.35056 29.0678 8.67722C29.5531 8.99456 29.9311 9.45189 30.2018 10.0492C30.4818 10.6372 30.6218 11.3326 30.6218 12.1352H24.9658L25.2178 11.9252C25.2178 12.4199 25.3158 12.8492 25.5118 13.2132C25.7078 13.5772 25.9738 13.8572 26.3098 14.0532C26.6458 14.2399 27.0285 14.3332 27.4578 14.3332C27.9245 14.3332 28.3118 14.2259 28.6198 14.0112C28.9371 13.7872 29.1845 13.5072 29.3618 13.1712L30.5098 13.7032C30.3231 14.0672 30.0805 14.3892 29.7818 14.6692C29.4831 14.9399 29.1285 15.1499 28.7178 15.2992C28.3165 15.4486 27.8638 15.5232 27.3598 15.5232ZM25.3018 11.2952L25.0358 11.0852H29.4598L29.2078 11.2952C29.2078 10.8846 29.1238 10.5346 28.9558 10.2452C28.7878 9.94656 28.5638 9.72256 28.2838 9.57322C28.0038 9.41456 27.6911 9.33522 27.3458 9.33522C27.0098 9.33522 26.6831 9.41456 26.3658 9.57322C26.0578 9.72256 25.8011 9.94189 25.5958 10.2312C25.3998 10.5206 25.3018 10.8752 25.3018 11.2952ZM38.129 15.3552L40.495 8.35522H41.825L39.445 15.3552H38.129ZM33.411 15.3552L35.735 8.35522H36.939L34.643 15.3552H33.411ZM33.313 15.3552L30.933 8.35522H32.277L34.587 15.3552H33.313ZM38.129 15.3552L35.833 8.35522H37.051L39.361 15.3552H38.129Z"
        fill="#092A33"
      />
    </svg>
  );
}

/**
 * ShopByCategory V1 Component
 *
 * A 6-card category grid cloned from nintarababy.in.
 * Pure CSS hover effects -- no JS interactivity needed.
 *
 * Features:
 * - 3-column grid (desktop) / 2-column grid (tablet + mobile)
 * - CSS ::before pseudo: background image with zoom on hover (0.6s ease)
 * - CSS ::after pseudo: gradient overlay that lightens on hover (0.4s ease)
 * - "NEW" SVG badges on select cards
 * - Section background image (desktop vs mobile swap)
 * - Responsive aspect ratios: 4:3 desktop, 1:1 mobile
 */
export function V1({ data, settings, className }: ShopByCategoryProps) {
  const heading = settings?.heading ?? "Shop by Category";
  const subtitle = settings?.subtitle ?? "Find your perfect baby must-haves.";

  const categories: CategoryCard[] = React.useMemo(() => {
    const settingsCats = settings?.categories;
    if (Array.isArray(settingsCats) && settingsCats.length > 0) {
      // Build lookup from defaults for superscript inheritance
      const defaultByHref = new Map(DEFAULT_CATEGORIES.map((c) => [c.href, c]));
      return settingsCats.map((sc) => {
        const match = defaultByHref.get(sc.href);
        return {
          label: sc.label,
          href: sc.href,
          image: sc.image,
          hasNewBadge: sc.hasNewBadge === "true",
          superscript: sc.superscript ?? match?.superscript,
        } as CategoryCard;
      });
    }
    return data?.categories && data.categories.length > 0
      ? data.categories
      : DEFAULT_CATEGORIES;
  }, [settings?.categories, data?.categories]);

  return (
    <section
      className={`nintara-sbc ${className ?? ""}`}
      data-testid="momsco-home-category-section"
    >
      <h3 className="nintara-sbc__heading">{heading}</h3>

      {/* <p className="nintara-sbc__subtitle">{subtitle}</p> */}

      <div
        className={`nintara-sbc__grid ${categories.length === 1 ? "!grid-cols-1 !max-w-[380px] mx-auto" : categories.length === 2 || categories.length === 4 ? "!grid-cols-2 !max-w-[760px] mx-auto" : ""}`}
      >
        {categories.map((category) => {
          // Full paths from settings vs relative filenames from defaults
          const imageSrc =
            category.image.startsWith("/") || category.image.startsWith("http")
              ? category.image
              : `${BASE_PATH}/${category.image}`;

          return (
            <Link
              key={category.href}
              href={category.href}
              className="nintara-sbc__card"
              data-testid={
                CATEGORY_TESTIDS[category.href] ?? "momsco-home-category-card"
              }
              style={
                {
                  "--sbc-card-image": `url(${imageSrc})`,
                } as React.CSSProperties
              }
            >
              {category.hasNewBadge && (
                <>
                  <NewBadgeDesktop />
                  <NewBadgeMobile />
                </>
              )}

              <div className="nintara-sbc__card-title">
                {category.label}
                {category.superscript && <sup>{category.superscript}</sup>}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export { V1 as default };
