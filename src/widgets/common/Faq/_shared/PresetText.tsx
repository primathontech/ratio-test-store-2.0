import type { CSSProperties, ReactNode } from "react";
import { TypePreset, typePresetStyle, typePresetTag } from "./typography";

interface PresetTextProps {
  /** Type preset driving the font size (h1..h6 / paragraph / rte). */
  preset?: TypePreset;
  /** Override the rendered tag (e.g. preset h2 styling on a semantic <h1>). */
  as?: keyof JSX.IntrinsicElements;
  /** Trusted CMS HTML — rendered via dangerouslySetInnerHTML when provided. */
  html?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Optional test id forwarded as data-testid. */
  testId?: string;
}

/**
 * PresetText — renders text at a type preset (server component).
 *
 * Font size comes from the global `--font-{preset}--size` tokens, so every
 * usage stays consistent with the single type scale. Pass `as` to keep
 * semantics independent of the visual size (e.g. an <h1> shown at the h2
 * preset, exactly how a product title block works).
 */
export function PresetText({
  preset = TypePreset.Paragraph,
  as,
  html,
  children,
  className,
  style,
  testId,
}: PresetTextProps) {
  const Tag = (as ?? typePresetTag(preset)) as keyof JSX.IntrinsicElements;
  const mergedStyle = { ...typePresetStyle(preset), ...style };

  if (typeof html === "string") {
    return (
      <Tag
        className={className}
        style={mergedStyle}
        data-testid={testId}
        // Trusted CMS-authored content — intentional HTML injection.
        // eslint-disable-next-line react/no-danger, no-restricted-syntax
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <Tag className={className} style={mergedStyle} data-testid={testId}>
      {children}
    </Tag>
  );
}
