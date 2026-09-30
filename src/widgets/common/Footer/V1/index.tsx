"use client";

import React, { memo } from "react";
import Link from "next/link";
import {
  useNav,
  type NavEntry,
  type MegaMenuLeaf,
} from "@shopkit/navigation/client";
import { FooterProps } from "../types";
import "./style.css";

/**
 * Footer V1 — REFERENCE IMPLEMENTATION.
 *
 * Same one-hook contract as the header: `useNav(handle)` → NavEntry[]. The footer
 * renders each entry as a column group — heading + links. A `dropdown` entry's
 * children are the links; a `link`/`external` entry is a single link; a `mega`
 * entry's panel is flattened to links. Restyle freely; you never parse JSON.
 */
export const V1 = memo(function V1({ settings }: FooterProps) {
  const entries = useNav(settings?.menuHandle ?? "footer");

  // Resolve each top-level entry to a column's worth of links (uniform leaves).
  const linksFor = (entry: NavEntry): MegaMenuLeaf[] => {
    if (entry.kind === "dropdown") {
      return entry.items;
    }
    if (entry.kind === "mega") {
      return entry.panel.columns.flatMap((c) =>
        c.items.length > 0
          ? c.items
          : [
              {
                id: c.id,
                title: c.title,
                href: c.href ?? "/",
                image: c.image,
                isExternal: c.isExternal,
              },
            ]
      );
    }
    // link / external → the entry itself is the single link.
    return [
      {
        id: entry.id,
        title: entry.label,
        href: entry.href,
        image: null,
        isExternal: entry.kind === "external",
      },
    ];
  };

  return (
    <footer className="sf-footer">
      <div className="sf-footer__inner">
        {entries.map((entry) => {
          // A standalone link/external entry is a single clickable heading — no
          // sub-list, so we never render the same label twice.
          if (entry.kind === "link" || entry.kind === "external") {
            return (
              <div key={entry.id} className="sf-footer__col">
                {entry.kind === "external" ? (
                  <a
                    href={entry.href}
                    className="sf-footer__col-title"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.label}
                  </a>
                ) : (
                  <Link href={entry.href} className="sf-footer__col-title">
                    {entry.label}
                  </Link>
                )}
              </div>
            );
          }

          // dropdown / mega → heading + its links. The heading is itself clickable
          // when the group points somewhere (e.g. "Shop" → /collections), and
          // that link may be external.
          return (
            <div key={entry.id} className="sf-footer__col">
              {entry.href ? (
                entry.isExternal ? (
                  <a
                    href={entry.href}
                    className="sf-footer__col-title"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.label}
                  </a>
                ) : (
                  <Link href={entry.href} className="sf-footer__col-title">
                    {entry.label}
                  </Link>
                )
              ) : (
                <span className="sf-footer__col-title">{entry.label}</span>
              )}
              <ul className="sf-footer__links">
                {linksFor(entry).map((link) =>
                  link.isExternal ? (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        className="sf-footer__link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.title}
                      </a>
                    </li>
                  ) : (
                    <li key={link.id}>
                      <Link href={link.href} className="sf-footer__link">
                        {link.title}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </footer>
  );
});

export { V1 as default };
