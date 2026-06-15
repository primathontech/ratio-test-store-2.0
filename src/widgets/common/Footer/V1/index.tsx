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
                isExternal: false,
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
        {entries.map((entry) => (
          <div key={entry.id} className="sf-footer__col">
            <span className="sf-footer__col-title">{entry.label}</span>
            <ul className="sf-footer__links">
              {linksFor(entry).map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="sf-footer__link">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
});

export { V1 as default };
