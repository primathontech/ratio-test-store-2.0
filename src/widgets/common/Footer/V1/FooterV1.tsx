"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { FooterProps } from "../types";
import { FOOTER_CONSTANTS, MOBILE_NAVIGATION_ITEMS } from "../constants";
import { FooterSection, SocialLinks, PaymentMethods } from "../components";
import { AccordionToggleIcon } from "../components/AccordionToggleIcon";
import { ServiceSections } from "../components/ServiceSections";
import { StickyFooter } from "../components/StickyFooter";

interface FooterV1Props extends Omit<FooterProps, "variant"> {
  // Add any V1-specific props here
}

export const FooterV1: React.FC<FooterV1Props> = ({ settings = {}, data }) => {
  const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState(false);

  const {
    backgroundColor = FOOTER_CONSTANTS.DEFAULT_SETTINGS.backgroundColor,
    showSocialLinks = FOOTER_CONSTANTS.DEFAULT_SETTINGS.showSocialLinks,
    showPaymentMethods = FOOTER_CONSTANTS.DEFAULT_SETTINGS.showPaymentMethods,
    showAppDownload = FOOTER_CONSTANTS.DEFAULT_SETTINGS.showAppDownload,
    mobileFooterTagline = FOOTER_CONSTANTS.DEFAULT_SETTINGS.mobileFooterTagline,
  } = settings;

  // Get footer data from settings (passed via translation keys)
  const {
    logoUrl,
    logoAlt,
    appDownloadText,
    googlePlayUrl,
    appStoreUrl,
    googlePlayImage,
    googlePlayAlt,
    appStoreImage,
    appStoreAlt,
    serviceSectionsIcons = [],
    aboutTitle,
    aboutLinks = [],
    usefulLinksTitle,
    usefulLinks = [],
    ourSalonsTitle,
    ourSalonsLinks = [],
    categoriesTitle,
    categoriesLinks = [],
    myAccountTitle,
    myAccountLinks = [],
    socialLinks = [],
    paymentProtectionText,
    copyrightText,
    paymentMethods = [],
    addToCartText,
    soldOutText,
  } = settings;
  const product = data?.data;
  return (
    <>
      <footer
        className="w-full rounded-t-[4px]"
        style={{
          backgroundColor,
        }}
      >
        <div className="mx-auto">
          {/* Main Footer Content */}
          <div
            className={`max-w-[1240px] mx-auto px-[1.6rem] pt-14 md:px-0 md:pt-[24px] transition-all duration-300 ${isMobileAccordionOpen ? "pb-[32px]" : "pb-[116px] md:pb-[24px] md:border-b md:border-[#424242]"}`}
          >
            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Main Accordion Header */}
              <button
                onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
                className={`w-full text-left flex justify-between items-center transition-all duration-300 ${isMobileAccordionOpen ? "mb-16" : ""}`}
                aria-expanded={isMobileAccordionOpen}
                aria-controls="mobile-footer-content"
              >
                <h3
                  className="text-text-base font-medium text-white !leading-none"
                  dangerouslySetInnerHTML={{ __html: mobileFooterTagline }}
                />

                {/* Plus/Minus Icon */}
                <AccordionToggleIcon isOpen={isMobileAccordionOpen} />
              </button>

              {/* Main Accordion Content - ALL FOOTER CONTENT */}
              <div
                id="mobile-footer-content"
                className={`overflow-hidden transition-all duration-300 ${
                  isMobileAccordionOpen
                    ? "max-h-[3000px] opacity-100 ease-linear"
                    : "max-h-0 opacity-0 ease-linear"
                }`}
              >
                <div>
                  {/* Individual Section Accordions */}
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
                      className="border-b border-[#424242] mt-[24px] md:mt-0"
                    />
                  )}

                  {ourSalonsTitle && (
                    <FooterSection
                      title={ourSalonsTitle}
                      links={ourSalonsLinks}
                      className="border-b border-[#424242] mt-[24px] md:mt-0"
                    />
                  )}

                  {categoriesTitle && (
                    <FooterSection
                      title={categoriesTitle}
                      links={categoriesLinks}
                      className="border-b border-[#424242] mt-[24px] md:mt-0"
                    />
                  )}

                  {myAccountTitle && (
                    <FooterSection
                      title={myAccountTitle}
                      links={myAccountLinks}
                      className="border-b border-[#424242] mt-[24px] md:mt-0"
                    />
                  )}

                  {/* Get the app section */}
                  {showAppDownload && appDownloadText && (
                    <div className="py-[24px] border-b border-[#424242]">
                      <h6 className="text-text-lg font-bold md:font-medium text-white !leading-none mb-[16px]">
                        {appDownloadText}
                      </h6>
                      <div className="flex gap-[17px]">
                        {appStoreUrl && appStoreImage && (
                          <Link
                            href={appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <Image
                              src={appStoreImage}
                              alt={appStoreAlt || "Download on App Store"}
                              width={155}
                              height={46}
                              priority
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
                              alt={googlePlayAlt || "Download on Google Play"}
                              width={155}
                              height={46}
                              priority
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
                    <div className="pt-4 pb-[24px] border-b border-[#424242]">
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
                    <div className="py-[48px]">
                      <p className="text-text-sm text-[#727272] text-center">
                        {copyrightText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block pt-6 px-10 xl:px-0">
              {/* Tablet Layout (768px-1024px) */}
              <div className="xl:hidden">
                <div
                  className="grid gap-4 mb-8"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                >
                  <div>
                    <div className="flex flex-col items-start">
                      {logoUrl && (
                        <div className="mb-2">
                          <Image
                            src={logoUrl}
                            alt={logoAlt || "Footer Logo"}
                            width={180}
                            height={53}
                            priority
                            className="object-cover"
                          />
                        </div>
                      )}
                      {showSocialLinks && (
                        <SocialLinks socialLinks={socialLinks} />
                      )}
                    </div>
                  </div>
                  {aboutTitle && (
                    <div>
                      <FooterSection title={aboutTitle} links={aboutLinks} />
                    </div>
                  )}
                  {usefulLinksTitle && (
                    <div>
                      <FooterSection
                        title={usefulLinksTitle}
                        links={usefulLinks}
                        className="pt-8 md:pt-0"
                      />
                    </div>
                  )}
                  {ourSalonsTitle && (
                    <div>
                      <FooterSection
                        title={ourSalonsTitle}
                        links={ourSalonsLinks}
                        className="pt-8 md:pt-0"
                      />
                    </div>
                  )}
                </div>

                {/* Second Row - Categories and My Account only */}
                <div className="grid grid-cols-5 gap-4">
                  {categoriesTitle && (
                    <div className="col-span-2">
                      <FooterSection
                        title={categoriesTitle}
                        links={categoriesLinks}
                        className="pt-8 md:pt-0"
                      />
                    </div>
                  )}
                  {myAccountTitle && (
                    <div className="col-span-2">
                      <FooterSection
                        title={myAccountTitle}
                        links={myAccountLinks}
                        className="pt-8 md:pt-0"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Layout (1024px+) */}
              <div className="hidden xl:flex xl:flex-row xl:flex-wrap justify-between">
                {/* Logo and App Download Section */}
                <div className="xl:pr-[17.5%]">
                  <div className="flex flex-col items-start">
                    {/* Logo */}
                    {logoUrl && (
                      <div className="mb-2">
                        <Image
                          src={logoUrl}
                          alt={logoAlt || "Footer Logo"}
                          width={220}
                          height={65}
                          priority
                          className="object-cover"
                        />
                      </div>
                    )}
                    {/* Social Links */}
                    {showSocialLinks && (
                      <SocialLinks socialLinks={socialLinks} />
                    )}
                  </div>
                </div>

                {/* About Us */}
                {aboutTitle && (
                  <FooterSection title={aboutTitle} links={aboutLinks} />
                )}

                {/* Useful Links */}
                {usefulLinksTitle && (
                  <FooterSection
                    title={usefulLinksTitle}
                    links={usefulLinks}
                    className="pt-8 md:pt-0"
                  />
                )}

                {/* Our Salons */}
                {ourSalonsTitle && (
                  <FooterSection
                    title={ourSalonsTitle}
                    links={ourSalonsLinks}
                    className="pt-8 md:pt-0"
                  />
                )}

                {/* Categories */}
                {categoriesTitle && (
                  <FooterSection
                    title={categoriesTitle}
                    links={categoriesLinks}
                    className="pt-8 md:pt-0"
                  />
                )}

                {/* My Account */}
                {myAccountTitle && (
                  <FooterSection
                    title={myAccountTitle}
                    links={myAccountLinks}
                    className="pt-8 md:pt-0"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="hidden px-10 xl:px-0 pt-6 pb-[32px] md:flex flex-col md:flex-row items-center gap-16 justify-between gap-y-8 max-w-[1240px] mx-auto">
            {/* Copyright */}
            {copyrightText && (
              <div className="">
                <p className="text-text-lg text-white font-normal !leading-[24.62px] mb-20 xl:mb-0">
                  {copyrightText}
                </p>
              </div>
            )}

            <div className="flex flex-col items-start">
              {/* Payment Protection Text */}
              {paymentProtectionText && (
                <div className="flex items-center gap-2 text-text-lg text-[#cecece] mb-4 !leading-[21.28px]">
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

              {/* Payment Methods */}
              {showPaymentMethods && (
                <div>
                  <PaymentMethods paymentMethods={paymentMethods} />
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>

      <div
        className={`fixed bottom-[16px] left-[16px] right-[16px] z-50 transition-all duration-300 ease-in-out block md:hidden`}
      >
        <StickyFooter
          items={MOBILE_NAVIGATION_ITEMS}
          productData={product}
          addToCartText={addToCartText}
          soldOutText={soldOutText}
        />
      </div>
    </>
  );
};
