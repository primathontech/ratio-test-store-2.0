"use client";

import React, { useState, useCallback } from "react";
import { subscribeNewsletter } from "@/utils/newsletter";
import type { FooterProps } from "../types";
import {
  HELP_LINKS,
  OTHER_LINKS,
  CONTACT_INFO,
  CATEGORY_LINKS,
  SEO_ACCORDION,
  SOCIAL_LINKS,
} from "../types";
import "../style.css";

/** Stable test IDs for the well-known footer policy links, keyed by href. */
const FOOTER_LINK_TESTIDS: Record<string, string> = {
  "/shipping-policy": "momsco-footer-link-shipping",
  "/cancellation-policy": "momsco-footer-link-cancellation",
  "/about-us": "momsco-footer-link-about-us",
  "/privacy-policy": "momsco-footer-link-privacy",
  "/terms-of-use": "momsco-footer-link-terms",
};

/* ------------------------------------------------------------------ */
/*  SVG Icon Components (inline to avoid external asset dependencies)  */
/* ------------------------------------------------------------------ */

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="nintara-footer__social-svg"
    >
      <path
        d="M41.8332 21.2818C41.8332 9.70556 32.5059 0.321167 20.9998 0.321167C9.4939 0.321167 0.166504 9.70556 0.166504 21.2818C0.166504 31.7437 7.78492 40.4153 17.7446 41.9878V27.3408H12.4549V21.2818H17.7446V16.6639C17.7446 11.4107 20.855 8.50892 25.6136 8.50892C27.8932 8.50892 30.2771 8.91831 30.2771 8.91831V14.0766H27.6503C25.0623 14.0766 24.255 15.6925 24.255 17.3501V21.2818H30.033L29.1094 27.3408H24.255V41.9878C34.2148 40.4153 41.8332 31.7441 41.8332 21.2818Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="nintara-footer__social-svg"
      role="presentation"
      viewBox="0 0 448 512"
      width="18"
      height="18"
      fill="currentColor"
    >
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** SEO Accordion: desktop-only expandable text block */
function SeoAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="nintara-footer__seo-accordion">
      <button
        type="button"
        className="nintara-footer__accordion-trigger"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span>{SEO_ACCORDION.title}</span>
        <ChevronDownIcon
          className={`nintara-footer__accordion-icon${isOpen ? " nintara-footer__accordion-icon--open" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="nintara-footer__accordion-panel">
          <p>{SEO_ACCORDION.content}</p>
        </div>
      )}
    </div>
  );
}

/** Dynamic SEO Accordion that accepts title/content props */
function SeoAccordionDynamic({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div className="nintara-footer__seo-accordion">
      <button
        type="button"
        className="nintara-footer__accordion-trigger"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`nintara-footer__accordion-icon${isOpen ? " nintara-footer__accordion-icon--open" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="nintara-footer__accordion-panel">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
}

/** Mobile accordion wrapper for footer columns */
function MobileAccordionColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="nintara-footer__col" data-testid="momsco-footer-column">
      {/* Desktop heading: always visible on md+ */}
      <h3 className="nintara-footer__col-heading nintara-footer__col-heading--desktop">
        {title}
      </h3>
      {/* Mobile: wrap trigger + content so border sits below expanded content */}
      <div className="nintara-footer__mobile-accordion">
        <button
          type="button"
          className="nintara-footer__col-heading nintara-footer__col-heading--mobile"
          onClick={toggle}
          aria-expanded={isOpen}
        >
          <span>{title}</span>
          <ChevronDownIcon
            className={`nintara-footer__collapse-icon${isOpen ? " nintara-footer__collapse-icon--open" : ""}`}
          />
        </button>
        {/* Content: always visible desktop, toggled mobile */}
        <div
          className={`nintara-footer__col-content${isOpen ? " nintara-footer__col-content--open" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Help column links */
function HelpLinks() {
  return (
    <ul className="nintara-footer__linklist">
      {HELP_LINKS.map((link) => (
        <li key={link.href} className="nintara-footer__linkitem">
          <a href={link.href} className="nintara-footer__link">
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Other Links column */
function OtherLinksList() {
  return (
    <ul className="nintara-footer__linklist">
      {OTHER_LINKS.map((link) => (
        <li key={link.href} className="nintara-footer__linkitem">
          <a href={link.href} className="nintara-footer__link">
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Contact Us column (not an accordion, static content) */
function ContactColumn() {
  return (
    <div className="nintara-footer__col">
      <h3 className="nintara-footer__col-heading nintara-footer__col-heading--always">
        Contact Us
      </h3>
      <div className="nintara-footer__contact-content">
        <p className="nintara-footer__contact-text">
          <strong>Registered Office Address: </strong>
          <span>{CONTACT_INFO.address}</span>
        </p>
        <p className="nintara-footer__contact-text">
          <strong>Contact Us: </strong>
          <span
            // href={CONTACT_INFO.whatsappUrl}
            // target="_blank"
            // rel="noopener noreferrer"
            className="nintara-footer__link"
          >
            {CONTACT_INFO.whatsapp}
          </span>
        </p>
        <p className="nintara-footer__contact-text">
          <strong>Email Us: </strong>
          <a href={CONTACT_INFO.emailUrl} className="nintara-footer__link">
            {CONTACT_INFO.email}
          </a>
        </p>
      </div>
    </div>
  );
}

/** Newsletter signup + social icons column */
function NewsletterColumn() {
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (email) {
        setEmail("");
      }
    },
    [email]
  );

  return (
    <div className="nintara-footer__col">
      <p className="nintara-footer__subscribe-heading">
        Subscribe to our Newsletter
      </p>
      <form
        className="nintara-footer__newsletter-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="nintara-footer__newsletter-pill">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="nintara-footer__newsletter-input"
            required
          />
          <button type="submit" className="nintara-footer__newsletter-btn">
            Sign Up
          </button>
        </div>
      </form>
      {/* <div className="nintara-footer__socials">
        <a
          href={SOCIAL_LINKS.facebook.url}
          title={SOCIAL_LINKS.facebook.title}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="nintara-footer__social-link"
        >
          <FacebookIcon />
        </a>
        <a
          href={SOCIAL_LINKS.instagram.url}
          title={SOCIAL_LINKS.instagram.title}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="nintara-footer__social-link"
        >
          <InstagramIcon />
        </a>
      </div> */}
    </div>
  );
}

/** Dynamic Newsletter + social column */
function NewsletterColumnDynamic({
  heading,
  facebookUrl,
  instagramUrl,
}: {
  heading: string;
  facebookUrl: string;
  instagramUrl: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) {
        return;
      }

      setStatus("loading");
      setMessage("");

      const result = await subscribeNewsletter(email);

      if (result.success) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.message ?? "Something went wrong. Please try again.");
      }
    },
    [email]
  );

  return (
    <div className="nintara-footer__col" data-testid="momsco-footer-column">
      <p className="nintara-footer__subscribe-heading">{heading}</p>
      <form
        className="nintara-footer__newsletter-form"
        onSubmit={handleSubmit}
        noValidate
        data-testid="momsco-footer-newsletter-form"
      >
        <div className="nintara-footer__newsletter-pill">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle" && status !== "loading") {
                setStatus("idle");
              }
            }}
            className="nintara-footer__newsletter-input"
            required
            disabled={status === "loading"}
            data-testid="momsco-footer-newsletter-input"
          />
          <button
            type="submit"
            className="nintara-footer__newsletter-btn"
            disabled={status === "loading"}
            data-testid="momsco-footer-newsletter-button"
          >
            {status === "loading" ? "..." : "Sign Up"}
          </button>
        </div>
        {status === "success" && (
          <div className="nintara-footer__newsletter-success">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Thanks for subscribing</span>
          </div>
        )}
        {status === "error" && (
          <p className="nintara-footer__newsletter-error">{message}</p>
        )}
      </form>
      <div
        className="nintara-footer__socials"
        data-testid="momsco-footer-socials"
      >
        <a
          href={facebookUrl}
          title="Follow on Facebook"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="nintara-footer__social-link"
        >
          <FacebookIcon />
        </a>
        <a
          href={instagramUrl}
          title="Follow on Instagram"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="nintara-footer__social-link"
        >
          <InstagramIcon />
        </a>
      </div>
    </div>
  );
}

// /** Dynamic Newsletter + social column */
// function NewsletterColumnDynamic({
//   heading,
//   facebookUrl,
//   instagramUrl,
// }: {
//   heading: string;
//   facebookUrl: string;
//   instagramUrl: string;
// }) {
//   const [email, setEmail] = useState("");
//   const handleSubmit = useCallback(
//     (e: React.FormEvent) => {
//       e.preventDefault();
//       if (email) {
//         setEmail("");
//       }
//     },
//     [email]
//   );

//   return (
//     <div className="nintara-footer__col">
//       <p className="nintara-footer__subscribe-heading">{heading}</p>
//       <form
//         className="nintara-footer__newsletter-form"
//         onSubmit={handleSubmit}
//         noValidate
//       >
//         <div className="nintara-footer__newsletter-pill">
//           <input
//             type="email"
//             placeholder="Your email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="nintara-footer__newsletter-input"
//             required
//           />
//           <button type="submit" className="nintara-footer__newsletter-btn">
//             Sign Up
//           </button>
//         </div>
//       </form>
//       <div className="nintara-footer__socials">
//         <a
//           href={facebookUrl}
//           title="Follow on Facebook"
//           target="_blank"
//           rel="noopener noreferrer nofollow"
//           className="nintara-footer__social-link"
//         >
//           <FacebookIcon />
//         </a>
//         <a
//           href={instagramUrl}
//           title="Follow on Instagram"
//           target="_blank"
//           rel="noopener noreferrer nofollow"
//           className="nintara-footer__social-link"
//         >
//           <InstagramIcon />
//         </a>
//       </div>
//     </div>
//   );
// }

/** Category links (desktop: inline pipe-separated, mobile: accordion list) */
function CategorySection() {
  return (
    <div className="nintara-footer__categories">
      <span className="nintara-footer__categories-heading">Categories</span>
      <p className="nintara-footer__categories-links">
        {CATEGORY_LINKS.map((link, i) => (
          <React.Fragment key={link.href}>
            {i > 0 && " | "}
            <a href={link.href} className="nintara-footer__category-link">
              {link.text}
            </a>
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}

/** Mobile-only categories accordion */
function MobileCategoriesColumn() {
  return (
    <MobileAccordionColumn title="Categories">
      <ul className="nintara-footer__linklist">
        {CATEGORY_LINKS.map((link) => (
          <li key={link.href} className="nintara-footer__linkitem">
            <a href={link.href} className="nintara-footer__link">
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </MobileAccordionColumn>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Footer V1 Component                                           */
/* ------------------------------------------------------------------ */

export function V1({ settings, className }: FooterProps) {
  const seoHeading = settings?.seoHeading ?? "Best Baby Care Products Online";
  const contactAddress = settings?.contactAddress ?? CONTACT_INFO.address;
  const contactWhatsapp = String(
    settings?.contactWhatsapp ?? CONTACT_INFO.whatsapp
  );
  const contactEmail = settings?.contactEmail ?? CONTACT_INFO.email;
  const contactUsHeading = settings?.contactUsHeading ?? "Contact Us";
  const registeredOfficeLabel =
    settings?.registeredOfficeLabel ?? "Registered Office Address";
  const whatsappUsLabel = settings?.whatsappUsLabel ?? "Whatsapp Us";
  const emailUsLabel = settings?.emailUsLabel ?? "Email Us";
  const categoriesHeading = settings?.categoriesHeading ?? "Our Range";
  const helpHeading = settings?.helpHeading ?? "Help";
  const otherLinksHeading = settings?.otherLinksHeading ?? "Other Links";
  const newsletterHeading =
    settings?.newsletterHeading ?? "Subscribe to our newsletter";
  const facebookUrl = settings?.facebookUrl ?? SOCIAL_LINKS.facebook.url;
  const instagramUrl = settings?.instagramUrl ?? SOCIAL_LINKS.instagram.url;

  const helpLinksData =
    Array.isArray(settings?.helpLinks) && settings!.helpLinks!.length > 0
      ? settings!.helpLinks!
      : HELP_LINKS;
  const otherLinksData =
    Array.isArray(settings?.otherLinks) && settings!.otherLinks!.length > 0
      ? settings!.otherLinks!
      : OTHER_LINKS;
  // "Our Range" footer links are admin-controlled exclusively. Use the curated
  // allowlist from settings.categoryLinks (resolved from
  // common.footer.categoryLinks in the theme locale) so creating a new
  // collection no longer auto-populates the footer.
  const categoryLinksData =
    Array.isArray(settings?.categoryLinks) &&
    settings!.categoryLinks!.length > 0
      ? settings!.categoryLinks!
      : CATEGORY_LINKS;

  return (
    <footer
      className={`nintara-footer${className ? ` ${className}` : ""}`}
      data-testid="momsco-footer-container"
    >
      <div className="nintara-footer__inner">
        <div className="nintara-footer__container">
          {/* SEO Heading */}
          <div className="border-b-[1px] border-[#c3c7c8] sm:mb-[50px]">
            <h2 className="nintara-footer__seo-heading">{seoHeading}</h2>
          </div>

          {/* Main 5-column grid */}
          <div className="nintara-footer__grid">
            {/* Column 1: Mobile-only categories accordion */}
            <div className="nintara-footer__grid-col nintara-footer__grid-col--categories-mobile">
              <MobileAccordionColumn title={categoriesHeading}>
                <ul className="nintara-footer__linklist">
                  {categoryLinksData.map((link: any) => (
                    <li key={link.href} className="nintara-footer__linkitem">
                      <a href={link.href} className="nintara-footer__link">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </MobileAccordionColumn>
            </div>

            {/* Column 2: Help */}
            <div className="nintara-footer__grid-col">
              <MobileAccordionColumn title={helpHeading}>
                <ul className="nintara-footer__linklist">
                  {helpLinksData.map((link: any) => (
                    <li key={link.href} className="nintara-footer__linkitem">
                      <a
                        href={link.href}
                        className="nintara-footer__link"
                        data-testid={FOOTER_LINK_TESTIDS[link.href]}
                      >
                        {link.text}
                        {link.badge && (
                          <span className="nintara-footer__imp-badge">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </MobileAccordionColumn>
            </div>

            {/* Column 3: Other Links */}
            <div className="nintara-footer__grid-col">
              <MobileAccordionColumn title={otherLinksHeading}>
                <ul className="nintara-footer__linklist">
                  {otherLinksData.map((link: any) => (
                    <li key={link.href} className="nintara-footer__linkitem">
                      <a
                        href={link.href}
                        className="nintara-footer__link"
                        data-testid={FOOTER_LINK_TESTIDS[link.href]}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </MobileAccordionColumn>
            </div>

            {/* Column 4: Contact Us */}
            <div className="nintara-footer__grid-col">
              <div
                className="nintara-footer__col"
                data-testid="momsco-footer-column"
              >
                <h3 className="nintara-footer__col-heading nintara-footer__col-heading--always">
                  {contactUsHeading}
                </h3>
                <div className="nintara-footer__contact-content">
                  <p className="nintara-footer__contact-text">
                    <strong>{registeredOfficeLabel}: </strong>
                    <span>{contactAddress}</span>
                  </p>
                  <p className="nintara-footer__contact-text">
                    <strong>{whatsappUsLabel}: </strong>
                    <span className="nintara-footer__link">
                      {contactWhatsapp}
                    </span>
                  </p>
                  <p className="nintara-footer__contact-text">
                    <strong>{emailUsLabel}: </strong>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="nintara-footer__link"
                      data-testid="momsco-footer-link-contact-email"
                    >
                      {contactEmail}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Column 5: Newsletter + Social */}
            <div className="nintara-footer__grid-col">
              <NewsletterColumnDynamic
                heading={newsletterHeading}
                facebookUrl={facebookUrl}
                instagramUrl={instagramUrl}
              />
            </div>
          </div>

          {/* Desktop-only inline categories section */}
          <div className="nintara-footer__categories-desktop">
            <div className="nintara-footer__categories">
              <span className="nintara-footer__categories-heading">
                {categoriesHeading}
              </span>
              <p className="nintara-footer__categories-links">
                {categoryLinksData.map((link: any, i: number) => (
                  <React.Fragment key={link.href}>
                    {i > 0 && " | "}
                    <a
                      href={link.href}
                      className="nintara-footer__category-link"
                    >
                      {link.text}
                    </a>
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
