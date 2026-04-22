"use client";

import Image from "next/image";
import Link from "next/link";
import React, { memo, useState } from "react";

import {
  AccordionToggleIcon,
  FooterSection,
  MyAccountFooterSection,
  PaymentMethods,
  ServiceSections,
  SocialLinks,
} from "../components";
import {
  DEFAULT_ABOUT_LINKS,
  DEFAULT_CATEGORIES_LINKS,
  DEFAULT_MY_ACCOUNT_LINKS,
  DEFAULT_OUR_SALONS_LINKS,
  DEFAULT_PAYMENT_METHODS,
  DEFAULT_SERVICE_ICONS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_USEFUL_LINKS,
  FOOTER_CONSTANTS,
} from "../constants";
import { FooterProps } from "../types";

export const V1 = memo(function V1({ settings = {} }: FooterProps) {
  const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState(false);

  const {
    backgroundColor = FOOTER_CONSTANTS.DEFAULT_SETTINGS.backgroundColor,
    showSocialLinks = FOOTER_CONSTANTS.DEFAULT_SETTINGS.showSocialLinks,
    showPaymentMethods = FOOTER_CONSTANTS.DEFAULT_SETTINGS.showPaymentMethods,
    showAppDownload = FOOTER_CONSTANTS.DEFAULT_SETTINGS.showAppDownload,
    mobileFooterTagline = FOOTER_CONSTANTS.DEFAULT_SETTINGS.mobileFooterTagline,
    logoUrl = "/Footer/images/logo.png",
    logoAlt = "BBlunt",
    appDownloadText = "Get the app",
    googlePlayUrl = "https://onelink.to/zwhyy8",
    appStoreUrl = "https://onelink.to/zwhyy8",
    googlePlayImage = "/Footer/images/app-store-android.png",
    googlePlayAlt = "Download on Google Play",
    appStoreImage = "/Footer/images/app-store-ios.png",
    appStoreAlt = "Download on App Store",
    serviceSectionsIcons = DEFAULT_SERVICE_ICONS,
    aboutTitle = "About Us",
    aboutLinks = DEFAULT_ABOUT_LINKS,
    usefulLinksTitle = "Useful Links",
    usefulLinks = DEFAULT_USEFUL_LINKS,
    ourSalonsTitle = "Our Salons",
    ourSalonsLinks = DEFAULT_OUR_SALONS_LINKS,
    categoriesTitle = "Categories",
    categoriesLinks = DEFAULT_CATEGORIES_LINKS,
    myAccountTitle = "My Account",
    myAccountLinks = DEFAULT_MY_ACCOUNT_LINKS,
    socialLinks = DEFAULT_SOCIAL_LINKS,
    paymentProtectionText = "100% Payment Protection, Easy Return Policy",
    copyrightText = "© 2026 Honasa Consumer Limited. All rights reserved.",
    paymentMethods = DEFAULT_PAYMENT_METHODS,
  } = settings;

  return (
    <footer className="w-full rounded-t-[4px]" style={{ backgroundColor }}>
      <div className="mx-auto">
        {/* Main Footer Content */}
        <div
          className={`mx-0 md:mx-[30px] xl:mx-[70px] px-[15px] pt-[22px] md:px-0 md:pt-[70px] transition-all duration-300 pb-[30px] ${
            isMobileAccordionOpen ? "pb-[100px]" : "pb-[120px] md:pb-[40px]"
          }`}
        >
          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Main Accordion Header */}
            <button
              onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
              className={`w-full text-left flex justify-between items-center transition-all duration-300 ${
                isMobileAccordionOpen ? "my-[15px]" : "mb-4"
              }`}
              aria-expanded={isMobileAccordionOpen}
              aria-controls="mobile-footer-content"
            >
              <h3
                className="text-[14px] font-medium text-white !leading-none font-[Gotham,sans-serif]"
                // eslint-disable-next-line no-restricted-syntax
                dangerouslySetInnerHTML={{ __html: mobileFooterTagline }}
              />
              <AccordionToggleIcon isOpen={isMobileAccordionOpen} />
            </button>

            {/* Main Accordion Content */}
            <div
              id="mobile-footer-content"
              className={`overflow-hidden transition-all duration-300 ${
                isMobileAccordionOpen
                  ? "max-h-[3000px] opacity-100 ease-linear"
                  : "max-h-0 opacity-0 ease-linear"
              }`}
            >
              <div className="pt-[20px] md:pt-0">
                {aboutTitle && (
                  <FooterSection
                    title={aboutTitle}
                    links={aboutLinks}
                    className="border-b border-[#424242]"
                  />
                )}
                {usefulLinksTitle && (
                  <FooterSection
                    title={usefulLinksTitle}
                    links={usefulLinks}
                    className="border-b border-[#424242]"
                  />
                )}
                {ourSalonsTitle && (
                  <FooterSection
                    title={ourSalonsTitle}
                    links={ourSalonsLinks}
                    className="border-b border-[#424242]"
                  />
                )}
                {categoriesTitle && (
                  <FooterSection
                    title={categoriesTitle}
                    links={categoriesLinks}
                    className="border-b border-[#424242]"
                  />
                )}
                {myAccountTitle && (
                  <MyAccountFooterSection
                    title={myAccountTitle}
                    links={myAccountLinks}
                    className="border-b border-[#424242]"
                  />
                )}

                {/* Get the app */}
                {showAppDownload && appDownloadText && (
                  <div className="py-[24px] border-b border-[#424242]">
                    <h6 className="text-[18px] font-bold md:font-medium text-white !leading-none mb-[16px] font-[Gotham,sans-serif]">
                      {appDownloadText}
                    </h6>
                    <div className="flex gap-[16px] justify-between">
                      {appStoreUrl && appStoreImage && (
                        <Link
                          href={appStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Image
                            src={appStoreImage}
                            alt={appStoreAlt}
                            width={188}
                            height={55}
                            loading="lazy"
                            className="object-cover"
                          />
                        </Link>
                      )}
                      {googlePlayUrl && googlePlayImage && (
                        <Link
                          href={googlePlayUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Image
                            src={googlePlayImage}
                            alt={googlePlayAlt}
                            width={188}
                            height={55}
                            loading="lazy"
                            className="object-cover"
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Service Icons */}
                <ServiceSections icons={serviceSectionsIcons} />

                {/* Payment Methods */}
                {showPaymentMethods && (
                  <div className="pb-[24px] border-b border-[#424242]">
                    <PaymentMethods paymentMethods={paymentMethods} />
                  </div>
                )}

                {/* Social Links */}
                {showSocialLinks && (
                  <SocialLinks
                    socialLinks={socialLinks}
                    className="py-[24px]"
                  />
                )}

                {/* Copyright */}
                {copyrightText && (
                  <div className="py-0 md:py-[36px]">
                    <p className="text-[12px] text-[#727272] text-center font-[Gotham,sans-serif]">
                      {copyrightText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block px-10 md:px-0 xl:px-0">
            {/* Tablet Layout (768px-1024px) */}
            <div className="xl:hidden grid grid-cols-2 gap-8">
              {/* Left column: Logo + social, Useful Links, Categories */}
              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col items-start">
                  {logoUrl && (
                    <div>
                      <Image
                        src={logoUrl}
                        alt={logoAlt}
                        width={180}
                        height={53}
                        loading="lazy"
                        className="object-cover mb-[20px] md:mb-[30px]"
                      />
                    </div>
                  )}
                  {showSocialLinks && <SocialLinks socialLinks={socialLinks} />}
                </div>
                {usefulLinksTitle && (
                  <FooterSection title={usefulLinksTitle} links={usefulLinks} />
                )}
                {categoriesTitle && (
                  <FooterSection
                    title={categoriesTitle}
                    links={categoriesLinks}
                  />
                )}
              </div>

              {/* Right column: About Us, Our Salons, My Account */}
              <div className="flex flex-col gap-[32px]">
                {aboutTitle && (
                  <FooterSection title={aboutTitle} links={aboutLinks} />
                )}
                {ourSalonsTitle && (
                  <FooterSection
                    title={ourSalonsTitle}
                    links={ourSalonsLinks}
                  />
                )}
                {myAccountTitle && (
                  <MyAccountFooterSection
                    title={myAccountTitle}
                    links={myAccountLinks}
                  />
                )}
              </div>
            </div>

            {/* Desktop Layout (1024px+) */}
            <div className="hidden xl:flex xl:flex-row xl:flex-wrap">
              <div className="xl:pr-[18.89%]">
                <div className="flex flex-col items-start">
                  {logoUrl && (
                    <div>
                      <Image
                        src={logoUrl}
                        alt={logoAlt}
                        width={180}
                        height={53}
                        loading="lazy"
                        className="object-cover mb-[20px] md:mb-[30px]"
                      />
                    </div>
                  )}
                  {showSocialLinks && <SocialLinks socialLinks={socialLinks} />}
                </div>
              </div>

              {aboutTitle && (
                <FooterSection title={aboutTitle} links={aboutLinks} />
              )}
              {usefulLinksTitle && (
                <FooterSection
                  title={usefulLinksTitle}
                  links={usefulLinks}
                  className="pt-8 md:pt-0"
                />
              )}
              {ourSalonsTitle && (
                <FooterSection
                  title={ourSalonsTitle}
                  links={ourSalonsLinks}
                  className="pt-8 md:pt-0"
                />
              )}
              {categoriesTitle && (
                <FooterSection
                  title={categoriesTitle}
                  links={categoriesLinks}
                  className="pt-8 md:pt-0"
                />
              )}
              {myAccountTitle && (
                <MyAccountFooterSection
                  title={myAccountTitle}
                  links={myAccountLinks}
                  className="pt-8 md:pt-0"
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section (desktop/tablet) */}
        <div
          className="hidden md:block w-full"
          style={{
            borderTop: "2px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div className="pt-6 md:pt-[23px] pb-[19px] xl:pb-[23px] flex flex-col md:flex-row items-center gap-16 justify-between gap-y-8 mx-auto px-[15px] md:px-[30px] lg:px-[70px] ">
            {/* Copyright */}
            {copyrightText && (
              <div>
                <p className="text-[12px] text-[#727272] font-normal !leading-[24.62px] mb-0 xl:mb-0 font-[Gotham,sans-serif]">
                  {copyrightText}
                </p>
              </div>
            )}

            <div className="flex flex-col items-start">
              {/* Payment Protection Text */}
              {paymentProtectionText && (
                <div className="flex items-center gap-2 text-[16px] text-[#cecece] !leading-[21.28px] font-[400] font-[Gotham,sans-serif]">
                  <span>
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1_9329)">
                        <path
                          d="M22.0589 3.5631C18.6962 3.33874 15.4599 2.19394 12.704 0.253915C12.5014 0.0896431 12.2484 0 11.9875 0C11.7266 0 11.4737 0.0896431 11.271 0.253915C8.51504 2.19377 5.2788 3.33855 1.91608 3.5631C1.63789 3.59081 1.37985 3.72069 1.19188 3.92763C1.00391 4.13457 0.899351 4.40387 0.898438 4.68344C0.898438 19.85 11.1137 24.4627 11.5569 24.645C11.6977 24.7043 11.8475 24.7396 12 24.7495C12.1544 24.7553 12.3076 24.7191 12.4431 24.645C12.8863 24.4599 23.1016 19.85 23.1016 4.68344C23.0903 4.40293 22.9789 4.13574 22.7877 3.93023C22.5964 3.72472 22.3379 3.59449 22.0589 3.5631ZM11.975 17.688C10.8515 17.6882 9.75315 17.3552 8.81883 16.7312C7.88452 16.1073 7.1562 15.2202 6.72595 14.1824C6.2957 13.1445 6.18284 12.0023 6.40165 10.9003C6.62046 9.79833 7.1611 8.78594 7.95523 7.99117C8.74935 7.1964 9.7613 6.65493 10.8631 6.43522C11.965 6.21552 13.1072 6.32745 14.1454 6.75685C15.1837 7.18625 16.0712 7.91385 16.696 8.84766C17.3207 9.78146 17.6546 10.8795 17.6553 12.0031C17.6563 12.7496 17.51 13.489 17.2249 14.1789C16.9398 14.8688 16.5214 15.4957 15.9937 16.0238C15.466 16.5518 14.8394 16.9706 14.1496 17.2562C13.4599 17.5417 12.7215 17.6885 11.975 17.688Z"
                          fill="#CECECE"
                        />
                        <path
                          d="M13.5614 9.9007L11.2171 12.245L10.2865 11.3124C10.1859 11.2044 10.0645 11.1176 9.92968 11.0575C9.79484 10.9973 9.64926 10.9649 9.50162 10.9623C9.35399 10.9596 9.20734 10.9867 9.07042 11.042C8.9335 11.0973 8.80913 11.1796 8.70472 11.284C8.60031 11.3884 8.51801 11.5128 8.46274 11.6497C8.40746 11.7866 8.38034 11.9333 8.38299 12.0809C8.38564 12.2285 8.41802 12.3741 8.47818 12.509C8.53835 12.6438 8.62506 12.7652 8.73316 12.8657L10.428 14.5606C10.5321 14.6629 10.6559 14.7432 10.7918 14.7967C10.9277 14.8501 11.073 14.8755 11.219 14.8714C11.5115 14.8665 11.7924 14.7561 12.01 14.5606L15.1452 11.4253C15.3484 11.2178 15.4621 10.939 15.4621 10.6487C15.4621 10.3583 15.3484 10.0795 15.1452 9.87202C14.9255 9.6778 14.641 9.57301 14.3477 9.57832C14.0545 9.58363 13.774 9.69865 13.5614 9.9007Z"
                          fill="#CECECE"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_9329">
                          <rect width="24" height="24.75" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  {paymentProtectionText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export { V1 as default };
