/**
 * Voice-widget iconography — the Ratio brand mark + the call controls, ported
 * verbatim from the approved "Ratio Voice AI" design (artifact 637ac59f). Kept as
 * tiny presentational components (no state, no props beyond className) so the
 * widget stays composable and the SVG paths live in exactly one place.
 *
 * All icons inherit `currentColor` + stroke width from the design, so tinting is a
 * pure CSS concern (the widget's `--rv-*` tokens), never hardcoded here.
 */

type IconProps = { className?: string };

/** The brand glyph: a shopping bag whose contents are a voice waveform — commerce
 *  + voice in one mark. Carries the identity at rest (launcher) and while live
 *  (call avatar). */
export function RatioMark({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 8V6.9a3 3 0 0 1 6 0V8" />
      <path d="M6.7 8H17.3V18.6a1.7 1.7 0 0 1-1.7 1.7H8.4a1.7 1.7 0 0 1-1.7-1.7Z" />
      <path d="M9.8 16v-2M12 16v-3.6M14.2 16v-2.6" />
    </svg>
  );
}

/** End-call (a handset rotated 135° into the universal "hang up" pose). */
export function HangUpIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
      style={{ transform: "rotate(135deg)" }}
      aria-hidden="true"
    >
      <path d="M6.6 4H4.3C3.6 4 3 4.6 3 5.3 3 13.4 9.6 20 17.7 20c.7 0 1.3-.6 1.3-1.3v-2.3c0-.6-.4-1.1-1-1.2l-2.6-.5c-.5-.1-1 .1-1.3.5l-.9 1.2a12.4 12.4 0 0 1-5.1-5.1l1.2-.9c.4-.3.6-.8.5-1.3l-.5-2.6c-.1-.6-.6-1-1.2-1z" />
    </svg>
  );
}

/** Mic (live/unmuted). */
export function MicOnIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

/** Mic with a strike-through (muted). */
export function MicOffIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 9v-.5a3 3 0 0 1 6 0V12M15 14a3 3 0 0 1-4.5 1.3M5 11a7 7 0 0 0 10.9 5.8M12 18v3" />
      <path d="M4 4l16 16" />
    </svg>
  );
}

/** Small slash badge overlaid on the avatar when muted. */
export function SlashIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 5l14 14M9 8.5V8a3 3 0 0 1 6 0v3" />
    </svg>
  );
}
