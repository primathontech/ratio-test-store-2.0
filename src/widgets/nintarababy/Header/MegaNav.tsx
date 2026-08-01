"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type {
  NavEntry,
  MegaMenuColumn,
  MegaMenuLeaf,
} from "@shopkit/navigation/client";

/**
 * MegaNav — desktop navigation row, rendered from a normalized NavEntry[].
 *
 * The Header passes `useNav("main-menu")` straight in. This component is PURE
 * markup over the model: it switches on `entry.kind` and reads pre-resolved fields
 * (label, href, ariaLabel, panel). It never imports a helper, never inspects
 * resource_type/depth/url, and can't reintroduce shape bugs. Copy + restyle freely.
 */
interface MegaNavProps {
  entries: NavEntry[];
  pathname: string;
}

const Chevron = () => (
  <svg
    className="nintara-header__nav-chevron"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** A single leaf inside a mega-menu column (image → card, else text link). */
function MegaLeaf({ leaf }: { leaf: MegaMenuLeaf }) {
  const content = leaf.image ? (
    <>
      {/* Admin-supplied remote image of unknown domain — `unoptimized` so
          next/image needs no per-merchant remotePatterns. CSS controls size. */}
      <Image
        src={leaf.image.src}
        alt={leaf.image.alt_text || leaf.title || ""}
        className="nintara-header__mega-product-img"
        width={400}
        height={400}
        loading="lazy"
        unoptimized
      />
      <span className="nintara-header__mega-product-title">{leaf.title}</span>
    </>
  ) : (
    leaf.title
  );
  const className = leaf.image
    ? "nintara-header__mega-product"
    : "nintara-header__mega-link";

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

/** A column in a mega-menu panel. */
function MegaColumn({ column }: { column: MegaMenuColumn }) {
  const hasImageLeaves = column.items.some((l) => !!l.image);
  return (
    <div className="nintara-header__mega-col">
      {column.image?.src && (
        <Image
          src={column.image.src}
          alt={column.image.alt_text || column.title || ""}
          className="nintara-header__mega-col-image"
          width={300}
          height={300}
          loading="lazy"
          unoptimized
        />
      )}
      {/* A column can itself be a link (flat panel): clickable title when it has a
          href, else a plain heading for its leaves. */}
      {column.title &&
        (column.href ? (
          <Link href={column.href} className="nintara-header__mega-col-title">
            {column.title}
          </Link>
        ) : (
          <span className="nintara-header__mega-col-title">{column.title}</span>
        ))}
      <div
        className={
          hasImageLeaves
            ? "nintara-header__mega-products"
            : "nintara-header__mega-links"
        }
      >
        {column.items.map((leaf) => (
          <MegaLeaf key={leaf.id} leaf={leaf} />
        ))}
      </div>
    </div>
  );
}

export function MegaNav({ entries, pathname }: MegaNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <nav className="nintara-header__nav" aria-label="Main navigation">
      <ul className="nintara-header__nav-list">
        {entries.map((entry) => {
          const hasPanel = entry.kind === "mega" || entry.kind === "dropdown";
          const open = activeId === entry.id;
          const isActive =
            !!entry.href &&
            entry.href !== "/" &&
            (pathname === entry.href || pathname.startsWith(entry.href + "/"));

          return (
            <li
              key={entry.id}
              className={`nintara-header__nav-item ${
                hasPanel ? "nintara-header__nav-item--has-dropdown" : ""
              } ${open || isActive ? "nintara-header__nav-item--active" : ""}`}
              onMouseEnter={hasPanel ? () => setActiveId(entry.id) : undefined}
              onMouseLeave={hasPanel ? () => setActiveId(null) : undefined}
            >
              {/* Trigger — by kind */}
              {entry.kind === "external" ? (
                <a
                  href={entry.href}
                  className="nintara-header__nav-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={entry.ariaLabel}
                >
                  {entry.label}
                </a>
              ) : entry.kind === "link" ? (
                <Link href={entry.href} className="nintara-header__nav-link">
                  {entry.label}
                </Link>
              ) : entry.href ? (
                // mega / dropdown that is ALSO a link → label navigates, hover opens
                <Link
                  href={entry.href}
                  className="nintara-header__nav-link"
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-label={entry.ariaLabel}
                >
                  {entry.label}
                  <Chevron />
                </Link>
              ) : (
                // mega / dropdown that is NOT a link → non-navigable label
                <span
                  className="nintara-header__nav-link"
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-label={entry.ariaLabel}
                >
                  {entry.label}
                  <Chevron />
                </span>
              )}

              {/* Mega-menu panel */}
              {entry.kind === "mega" && open && (
                <div className="nintara-header__mega-panel">
                  <div className="nintara-header__mega-inner">
                    {entry.panel.hero?.src && (
                      <Image
                        src={entry.panel.hero.src}
                        alt={entry.panel.hero.alt_text || entry.label}
                        className="nintara-header__mega-hero"
                        width={300}
                        height={300}
                        loading="lazy"
                        unoptimized
                      />
                    )}
                    {entry.panel.columns.map((column) => (
                      <MegaColumn key={column.id} column={column} />
                    ))}
                  </div>
                </div>
              )}

              {/* Simple dropdown panel */}
              {entry.kind === "dropdown" && open && (
                <div className="nintara-header__dropdown">
                  <div className="nintara-header__dropdown-inner">
                    {entry.items.map((leaf) => (
                      <div
                        key={leaf.id}
                        className="nintara-header__dropdown-item"
                      >
                        <Link
                          href={leaf.href}
                          className="nintara-header__dropdown-link"
                        >
                          {leaf.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* =====================================================================
   Mobile drawer (slide-in) — same NavEntry[] model, accordion layout
   ===================================================================== */

/** Drawer expand/collapse caret (matches the existing nintara drawer chevron). */
function DrawerChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`nintara-header__drawer-chevron mr-5 transition-transform ${
        expanded ? "rotate-180" : ""
      }`}
      width="8"
      height="8"
      viewBox="0 0 19 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.5 1.5L9.5 9.5L17.5 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** One top-level entry as a drawer accordion row. */
function MobileMenuItem({
  entry,
  onNavigate,
}: {
  entry: NavEntry;
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = entry.kind === "mega" || entry.kind === "dropdown";

  // Leaf (link / external): a single drawer link.
  if (!hasChildren) {
    return (
      <li className="nintara-header__drawer-item">
        {entry.kind === "external" ? (
          <a
            href={entry.href}
            className="nintara-header__drawer-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
          >
            {entry.label}
          </a>
        ) : (
          <Link
            href={entry.href}
            className="nintara-header__drawer-link"
            onClick={onNavigate}
          >
            {entry.label}
          </Link>
        )}
      </li>
    );
  }

  // Flatten the panel to a single level of links. Mega panels: a leaf-less column
  // is itself a link, so fall back to the column. Dropdown: its items.
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
                  isExternal: false,
                },
              ]
        )
      : entry.items;

  return (
    <li className="nintara-header__drawer-item">
      <div className="flex items-center justify-between">
        {/* When the trigger is itself a link, the label navigates and a separate
            caret expands the sub-items; otherwise the whole row toggles. */}
        {entry.href ? (
          <Link
            href={entry.href}
            className="nintara-header__drawer-link"
            onClick={onNavigate}
          >
            {entry.label}
          </Link>
        ) : (
          <span className="nintara-header__drawer-link">{entry.label}</span>
        )}
        <button
          type="button"
          className="p-2 flex-1 mr-1"
          aria-label={`Toggle ${entry.label} submenu`}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <DrawerChevron expanded={expanded} />
        </button>
      </div>
      {expanded && children.length > 0 && (
        <ul className="pl-4 mt-1 flex flex-col gap-1">
          {children.map((child) => (
            <li key={child.id}>
              <Link
                href={child.href}
                className="nintara-header__drawer-link text-sm"
                onClick={onNavigate}
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * MegaNavMobile — the slide-in drawer's nav, rendered from the same NavEntry[].
 */
export function MegaNavMobile({
  entries,
  onNavigate,
}: {
  entries: NavEntry[];
  onNavigate?: () => void;
}) {
  return (
    <ul className="nintara-header__drawer-list">
      {entries.map((entry) => (
        <MobileMenuItem key={entry.id} entry={entry} onNavigate={onNavigate} />
      ))}
    </ul>
  );
}
