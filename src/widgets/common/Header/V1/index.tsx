"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useNav,
  type NavEntry,
  type MegaMenuColumn,
  type MegaMenuLeaf,
} from "@shopkit/navigation/client";
import { HeaderProps } from "../types";
import "./style.css";

/**
 * Header V1 — REFERENCE IMPLEMENTATION for the mega menu.
 *
 * This is the canonical pattern every merchant storefront COPIES and RESTYLES.
 *
 * ── The entire data contract is ONE hook ───────────────────────────────────────
 *   const entries = useNav(handle);   // NavEntry[] — render-ready, by `kind`
 *
 * You never parse JSON, never call a helper, never inspect resource_type/depth/url.
 * `entry.kind` is one of "link" | "external" | "dropdown" | "mega"; switch on it and
 * render your markup. TypeScript makes the switch exhaustive — if the platform ever
 * adds a kind, your build tells you. `useNav` returns [] when the menu is
 * unavailable (no env/backend/handle), so keep a small fallback and you're done.
 *
 * The visual design is YOURS — only the data (useNav) is shared.
 */

/** Graceful fallback — shown when useNav() returns [] (no env/backend/handle, or
 *  the editor preview). Keep SOMETHING so the header is never blank. */
const FALLBACK_NAV: { title: string; href: string }[] = [
  { title: "Home", href: "/" },
];

/* ── Desktop: a single leaf inside a mega-menu column (image → card, else link) ── */
function DesktopLeaf({ leaf }: { leaf: MegaMenuLeaf }) {
  const content = leaf.image ? (
    <>
      {/* Admin-supplied remote image of unknown domain — `unoptimized` so
          next/image needs no per-merchant remotePatterns. CSS controls size. */}
      <Image
        src={leaf.image.src}
        alt={leaf.image.alt_text || leaf.title || ""}
        className="sf-mega__card-img"
        width={400}
        height={400}
        loading="lazy"
        unoptimized
      />
      <span className="sf-mega__card-title">{leaf.title}</span>
    </>
  ) : (
    leaf.title
  );
  const className = leaf.image ? "sf-mega__card" : "sf-mega__link";

  return leaf.isExternal ? (
    <a
      href={leaf.href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link href={leaf.href} className={className}>
      {content}
    </Link>
  );
}

/* ── Desktop: a column inside a mega panel ────────────────────────────────────── */
function DesktopColumn({ column }: { column: MegaMenuColumn }) {
  const cards = column.items.some((l) => !!l.image);
  return (
    <div className="sf-mega__col">
      {column.image?.src && (
        <Image
          src={column.image.src}
          alt={column.image.alt_text || column.title || ""}
          className="sf-mega__col-img"
          width={300}
          height={300}
          loading="lazy"
          unoptimized
        />
      )}
      {/* A column can itself be a link (flat panel): clickable title when it has a
          href, else a plain heading for its leaves. A column can now also be an
          external link (any resource type can be a child). */}
      {column.title &&
        (column.href ? (
          column.isExternal ? (
            <a
              href={column.href}
              className="sf-mega__col-title"
              target="_blank"
              rel="noopener noreferrer"
            >
              {column.title}
            </a>
          ) : (
            <Link href={column.href} className="sf-mega__col-title">
              {column.title}
            </Link>
          )
        ) : (
          <span className="sf-mega__col-title">{column.title}</span>
        ))}
      <div className={cards ? "sf-mega__cards" : "sf-mega__links"}>
        {column.items.map((leaf) => (
          <DesktopLeaf key={leaf.id} leaf={leaf} />
        ))}
      </div>
    </div>
  );
}

/* ── Desktop: one top-level entry (link / external / dropdown / mega) ──────────── */
function DesktopItem({
  entry,
  open,
  onEnter,
  onLeave,
}: {
  entry: NavEntry;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const hasPanel = entry.kind === "mega" || entry.kind === "dropdown";

  // Label + optional leading icon. `entry.image` is the item's own image (icon or
  // featured), surfaced by the platform on EVERY entry kind. Data-driven: renders
  // only when the merchant attached one in admin — no image, no markup change.
  const label = (
    <>
      {entry.image?.src && (
        <Image
          src={entry.image.src}
          alt={entry.image.alt_text || entry.label}
          className="sf-nav__icon"
          width={20}
          height={20}
          unoptimized
        />
      )}
      {entry.label}
    </>
  );

  return (
    <li
      className={`sf-nav__item ${open ? "is-open" : ""}`}
      onMouseEnter={hasPanel ? onEnter : undefined}
      onMouseLeave={hasPanel ? onLeave : undefined}
    >
      {entry.kind === "external" ? (
        <a
          href={entry.href}
          className="sf-nav__link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={entry.ariaLabel}
        >
          {label}
        </a>
      ) : entry.kind === "link" ? (
        <Link href={entry.href} className="sf-nav__link">
          {label}
        </Link>
      ) : entry.href ? (
        // mega / dropdown that is ALSO a link → label navigates, hover opens panel.
        // The link itself may be external (any resource type can be a trigger).
        entry.isExternal ? (
          <a
            href={entry.href}
            className="sf-nav__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-haspopup="true"
            aria-expanded={open}
          >
            {label}
            <span className="sf-nav__chevron" aria-hidden="true">
              ▾
            </span>
          </a>
        ) : (
          <Link
            href={entry.href}
            className="sf-nav__link"
            aria-haspopup="true"
            aria-expanded={open}
          >
            {label}
            <span className="sf-nav__chevron" aria-hidden="true">
              ▾
            </span>
          </Link>
        )
      ) : (
        // mega / dropdown that is NOT a link → non-navigable label
        <span
          className="sf-nav__link"
          aria-haspopup="true"
          aria-expanded={open}
        >
          {label}
          <span className="sf-nav__chevron" aria-hidden="true">
            ▾
          </span>
        </span>
      )}

      {/* Mega-menu panel */}
      {entry.kind === "mega" && open && (
        <div className="sf-mega">
          <div className="sf-mega__inner">
            {entry.panel.hero?.src && (
              <Image
                src={entry.panel.hero.src}
                alt={entry.panel.hero.alt_text || entry.label}
                className="sf-mega__hero"
                width={300}
                height={300}
                loading="lazy"
                unoptimized
              />
            )}
            {entry.panel.columns.map((column) => (
              <DesktopColumn key={column.id} column={column} />
            ))}
          </div>
        </div>
      )}

      {/* Simple dropdown */}
      {entry.kind === "dropdown" && open && (
        <div className="sf-dropdown">
          {entry.items.map((leaf) =>
            leaf.isExternal ? (
              <a
                key={leaf.id}
                href={leaf.href}
                className="sf-dropdown__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {leaf.title}
              </a>
            ) : (
              <Link
                key={leaf.id}
                href={leaf.href}
                className="sf-dropdown__link"
              >
                {leaf.title}
              </Link>
            )
          )}
        </div>
      )}
    </li>
  );
}

/* ── Mobile: one top-level entry as an accordion row ──────────────────────────── */
function MobileItem({ entry }: { entry: NavEntry }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = entry.kind === "mega" || entry.kind === "dropdown";

  // Label + optional leading icon (see DesktopItem). Data-driven from entry.image.
  const label = (
    <>
      {entry.image?.src && (
        <Image
          src={entry.image.src}
          alt={entry.image.alt_text || entry.label}
          className="sf-drawer__icon"
          width={20}
          height={20}
          unoptimized
        />
      )}
      {entry.label}
    </>
  );

  if (!hasChildren) {
    return entry.kind === "external" ? (
      <a
        href={entry.href}
        className="sf-drawer__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    ) : (
      <Link href={entry.href} className="sf-drawer__link">
        {label}
      </Link>
    );
  }

  // Flatten the panel to one level for the drawer. Mega: a leaf-less column is
  // itself a link, so fall back to the column. Dropdown: its items.
  const children: MegaMenuLeaf[] =
    entry.kind === "mega"
      ? entry.panel.columns.flatMap((c) =>
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
        )
      : entry.items;

  return (
    <div className="sf-drawer__group">
      {entry.href ? (
        // Trigger is itself a link: the label navigates, a separate caret expands.
        // The link may be external.
        <div className="sf-drawer__row">
          {entry.isExternal ? (
            <a
              href={entry.href}
              className="sf-drawer__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          ) : (
            <Link href={entry.href} className="sf-drawer__link">
              {label}
            </Link>
          )}
          <button
            className="sf-drawer__expand"
            aria-label={`${expanded ? "Collapse" : "Expand"} ${entry.label}`}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          </button>
        </div>
      ) : (
        <button
          className="sf-drawer__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {label}
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
      )}
      {expanded && (
        <div className="sf-drawer__sub">
          {children.map((child) =>
            child.isExternal ? (
              <a
                key={child.id}
                href={child.href}
                className="sf-drawer__sublink"
                target="_blank"
                rel="noopener noreferrer"
              >
                {child.title}
              </a>
            ) : (
              <Link
                key={child.id}
                href={child.href}
                className="sf-drawer__sublink"
              >
                {child.title}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ── The header shell (desktop bar + mobile drawer) ───────────────────────────── */
export const V1 = memo(function V1({ settings }: HeaderProps) {
  const brand = settings?.brandName ?? "Store";
  const entries = useNav(settings?.menuHandle ?? "main-menu"); // ← the whole contract
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <header className="sf-header">
      <div className="sf-header__bar">
        <button
          className="sf-header__burger"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          ☰
        </button>

        <Link href="/" className="sf-header__brand">
          {brand}
        </Link>

        {/* Desktop nav — hidden on mobile via CSS */}
        <nav className="sf-nav" aria-label="Main navigation">
          <ul className="sf-nav__list">
            {entries.length > 0
              ? entries.map((entry) => (
                  <DesktopItem
                    key={entry.id}
                    entry={entry}
                    open={openId === entry.id}
                    onEnter={() => setOpenId(entry.id)}
                    onLeave={() => setOpenId(null)}
                  />
                ))
              : FALLBACK_NAV.map((l) => (
                  <li key={l.href} className="sf-nav__item">
                    <Link href={l.href} className="sf-nav__link">
                      {l.title}
                    </Link>
                  </li>
                ))}
          </ul>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={`sf-drawer ${drawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <button
          className="sf-drawer__close"
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}
        >
          ×
        </button>
        <nav className="sf-drawer__nav" aria-label="Mobile navigation">
          {entries.length > 0
            ? entries.map((entry) => (
                <MobileItem key={entry.id} entry={entry} />
              ))
            : FALLBACK_NAV.map((l) => (
                <Link key={l.href} href={l.href} className="sf-drawer__link">
                  {l.title}
                </Link>
              ))}
        </nav>
      </div>
      {drawerOpen && (
        <div
          className="sf-header__overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
});

export { V1 as default };
