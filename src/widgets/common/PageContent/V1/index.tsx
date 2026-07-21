"use client";

import React, { memo } from "react";
import { PageContentProps, PageContentBlock } from "../types";
import { getStoreContact } from "@/config/store";

/**
 * PageContent V1
 *
 * A generic, content-driven renderer for static pages — policies (privacy,
 * refund, terms, shipping), Contact, and FAQ all share this component. Styling
 * follows the Refined Monochrome system (ink #1D1D1D + neutral grays).
 */

function toParagraphs(body?: string | string[]): string[] {
  if (!body) {
    return [];
  }
  return (Array.isArray(body) ? body : [body]).filter(Boolean);
}

function sanitizeTel(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export const V1 = memo(function V1({ settings, className }: PageContentProps) {
  const {
    eyebrow,
    title,
    subtitle,
    updatedAt,
    contact,
    sections = [],
  } = settings || {};

  // Resolve contact details env-first (merchant-agnostic), falling back to the
  // locale placeholders. Only opt in when the page actually provides a contact
  // block, so non-contact pages never render a contact card.
  const resolvedContact = contact ? getStoreContact(contact) : undefined;

  const contactItems = [
    resolvedContact?.email && {
      label: "Email",
      value: resolvedContact.email,
      href: `mailto:${resolvedContact.email}`,
    },
    resolvedContact?.phone && {
      label: "Phone",
      value: resolvedContact.phone,
      href: `tel:${sanitizeTel(resolvedContact.phone)}`,
    },
    resolvedContact?.address && {
      label: "Address",
      value: resolvedContact.address,
    },
    resolvedContact?.hours && {
      label: "Support hours",
      value: resolvedContact.hours,
    },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <section className={`w-full bg-white ${className ?? ""}`}>
      <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        {/* Header */}
        <header className="mb-10 sm:mb-14">
          {eyebrow ? (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h1 className="font-body text-3xl font-semibold leading-tight tracking-tight text-[#1D1D1D] sm:text-4xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
              {subtitle}
            </p>
          ) : null}
          {updatedAt ? (
            <p className="mt-5 text-sm text-neutral-400">
              Last updated: {updatedAt}
            </p>
          ) : null}
        </header>

        {/* Optional contact card */}
        {contactItems.length > 0 ? (
          <div className="mb-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/[0.06] sm:grid-cols-2">
            {contactItems.map((item) => (
              <div key={item.label} className="bg-white p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-1.5 block text-base font-medium text-[#1D1D1D] underline-offset-4 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1.5 text-base font-medium text-[#1D1D1D]">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* Content blocks */}
        <div className="space-y-10">
          {sections.map((section: PageContentBlock, idx: number) => {
            const paragraphs = toParagraphs(section.body);
            return (
              <article key={idx}>
                {section.heading ? (
                  <h2 className="mb-3 font-body text-lg font-semibold text-[#1D1D1D] sm:text-xl">
                    {section.heading}
                  </h2>
                ) : null}
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="mb-3 text-[15px] leading-relaxed text-neutral-600 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-[15px] leading-relaxed text-neutral-600"
                      >
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export { V1 as default };
