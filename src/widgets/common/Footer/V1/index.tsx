"use client";

import React, { memo } from "react";
import Link from "next/link";
import {
  useMenu,
  getEffectiveUrl,
  isBrokenLink,
} from "@shopkit/navigation/client";
import { FooterProps } from "../types";
import "./style.css";

/**
 * Footer V1 — REFERENCE IMPLEMENTATION.
 *
 * The footer renders the SAME menu tree as the header (a different handle), as
 * column groups of links: depth-0 items are column headings, their children are
 * the links. Same data + helpers as the header (FLOW.md §4.1); restyle freely.
 *
 * Rules: import from "@shopkit/navigation/client" only; degrade gracefully when
 * useMenu() is null (render nothing extra, never crash).
 */
export const V1 = memo(function V1({ settings }: FooterProps) {
  const menu = useMenu(settings?.menuHandle ?? "footer");
  const columns = (menu?.items ?? []).filter((c) => !isBrokenLink(c));

  return (
    <footer className="sf-footer">
      <div className="sf-footer__inner">
        {columns.map((col) => (
          <div key={col.id} className="sf-footer__col">
            <span className="sf-footer__col-title">{col.title}</span>
            <ul className="sf-footer__links">
              {/* A column with children → list them; a bare link → itself. */}
              {(col.items.length > 0 ? col.items : [col]).map((link) =>
                isBrokenLink(link) ? null : (
                  <li key={link.id}>
                    <Link
                      href={getEffectiveUrl(link) ?? "/"}
                      className="sf-footer__link"
                    >
                      {link.title}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
});

export { V1 as default };
