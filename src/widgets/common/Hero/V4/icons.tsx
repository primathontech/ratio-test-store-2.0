/**
 * Shoppable hero (v4) icon primitives — exact viewBox + path geometry from the
 * source look's harvested inline SVGs; `currentColor` so glyphs follow the
 * hotspot/text color settings.
 */

type IconProps = { className?: string };

// Hotspot "+" dot — viewBox 0 0 20 20.
export function PlusIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox="0 0 20 20"
      className={className}
    >
      <path
        fill="currentColor"
        d="M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z"
      />
    </svg>
  );
}

// Hotspot icon-style: Dot (small filled circle).
export function DotIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox="0 0 20 20"
      className={className}
    >
      <circle cx="10" cy="10" r="8" fill="currentColor" />
    </svg>
  );
}

// Hotspot icon-style: Tag (price-tag glyph).
export function TagIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41 12 22l-9-9V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Hotspot icon-style: Bag (shopping-bag glyph).
export function BagIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

// Popover "View product" chevron — viewBox 0 0 284.49 498.98.
export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox="0 0 284.49 498.98"
      className={className}
    >
      <path
        fill="currentColor"
        d="M35 498.98a35 35 0 0 1-24.75-59.75l189.74-189.74L10.25 59.75a35.002 35.002 0 0 1 49.5-49.5l214.49 214.49a35 35 0 0 1 0 49.5L59.75 488.73A34.89 34.89 0 0 1 35 498.98Z"
      />
    </svg>
  );
}

// Quick-shop modal close "X" — viewBox 0 0 64 64 (stroked).
export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="m19 17.61 27.12 27.13m0-27.12L19 44.74" />
    </svg>
  );
}
