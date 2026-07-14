import "./style.css";
import type React from "react";
import Link from "next/link";
import { normalizeBlock } from "../_shared/blocks";
import { HeroV2Props, HeroBlock, HeroSettings } from "./types";
import {
  BlockType,
  ButtonStyle,
  ButtonWidth,
  OverlayStyle,
  GradientDirection,
  SectionWidth,
  CssVar,
  ClassName,
  schemeColorVars,
  PAGE_CONTENT_MAX_WIDTH,
  PAGE_INLINE_PADDING,
  FULL_INLINE_PADDING,
  CONTENT_BLOCK_PADDING,
  EMPTY_MEDIA_BG,
  DEFAULTS,
} from "./constants";
import {
  resolveHeroMedia,
  resolveAlignment,
  heightVars,
  spacing,
} from "./utils";
import { MediaSlot, TextBlock } from "./components";
import { ButtonBlock } from "../_shared/ButtonBlock";

/* ------------------------------------------------------------------ */
/* Block dispatch                                                      */
/* ------------------------------------------------------------------ */

function renderBlock(
  raw: HeroBlock,
  index: number,
  buttonStyle: HeroSettings["button_style"] | undefined,
  isPrimaryCta: boolean
) {
  // Accept flat ({ type, ...fields }) and nested ({ type, settings }) blocks.
  const block = normalizeBlock(raw);
  const key = block.id ?? `${block.type}-${index}`;
  switch (block.type) {
    case BlockType.Text:
      return <TextBlock key={key} block={block} />;
    case BlockType.Button: {
      const s = block.settings ?? {};
      const widthStyle: React.CSSProperties = {
        width:
          s.width === ButtonWidth.Custom
            ? `${s.custom_width ?? 100}%`
            : ButtonWidth.Fit,
      };
      return (
        <ButtonBlock
          key={key}
          label={s.label ?? DEFAULTS.buttonLabel}
          href={s.link}
          variant={buttonStyle ?? s.style_class ?? ButtonStyle.Primary}
          open_in_new_tab={s.open_in_new_tab}
          style={widthStyle}
          testId={isPrimaryCta ? "hero-cta" : "hero-button-block"}
        />
      );
    }
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Component (Server Component — no client JS)                         */
/* ------------------------------------------------------------------ */

export function V2({ vm, className }: HeroV2Props) {
  const s = vm.v2 ?? {}; // the VM seam: body below reads only the extension

  const media = resolveHeroMedia(s);
  const { flexDirection, justifyContent, alignItems } = resolveAlignment(s);

  const blocks = Array.isArray(s.blocks) ? s.blocks : [];

  const showOverlay = s.toggle_overlay ?? false;
  const overlayColor = s.overlay_color ?? DEFAULTS.overlayColor;
  const overlayStyle = s.overlay_style ?? OverlayStyle.Solid;
  const gradientDirection = s.gradient_direction ?? GradientDirection.ToTop;

  const showReflection =
    (s.blurred_reflection ?? false) &&
    !media.hasOnlyVideo &&
    media.mediaCount > 0;
  const reflectionOpacity =
    (s.reflection_opacity ?? DEFAULTS.reflectionOpacity) / 100;

  // The first button block is the primary CTA (gets data-testid="hero-cta").
  const firstButtonIndex = blocks.findIndex(
    (b) => normalizeBlock(b).type === BlockType.Button
  );

  // Per-instance values passed as inline CSS variables (consumed by the
  // static .cs-hero-v2 rules in style.css). Keeps the widget server-rendered.
  const rootStyle: React.CSSProperties = {
    // Scheme colors come from theme.json (config.colors.scheme-N-*); the hero's
    // components/styles read the generic var(--color-foreground) etc.
    ...schemeColorVars(s.color_scheme),
    // Per-instance color overrides win over the scheme vars (later keys).
    // Buttons: both style pairs are overridden so primary AND secondary CTAs
    // follow the setting regardless of their style_class.
    ...(s.section_background
      ? { ["--color-background"]: s.section_background }
      : {}),
    ...(s.cta_background
      ? {
          ["--color-primary-button-background"]: s.cta_background,
          ["--color-secondary-button-border"]: s.cta_background,
          ["--color-primary-button-hover-background"]: s.cta_background,
        }
      : {}),
    ...(s.cta_text_color
      ? {
          ["--color-primary-button-text"]: s.cta_text_color,
          ["--color-secondary-button-text"]: s.cta_text_color,
          ["--color-primary-button-hover-text"]: s.cta_text_color,
        }
      : {}),
    [CssVar.BlurOpacity]: String(reflectionOpacity),
    [CssVar.HeroCols]: String(Math.max(media.mediaCount, 1)),
    ...heightVars(s),
  } as React.CSSProperties;

  const rootClassName = [
    ClassName.Root,
    s.stack_media_on_mobile ? ClassName.RootStackMobile : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle: React.CSSProperties = {
    paddingTop: spacing(s["padding-block-start"]),
    paddingBottom: spacing(s["padding-block-end"]),
    alignItems: "stretch",
    justifyContent: "center",
  };

  const isFullWidth = s.section_width === SectionWidth.Full;
  const contentStyle: React.CSSProperties = {
    flexDirection,
    gap: `${s.gap ?? DEFAULTS.gap}px`,
    justifyContent,
    alignItems,
    maxWidth: isFullWidth ? "none" : PAGE_CONTENT_MAX_WIDTH,
    marginInline: "auto",
    paddingInline: isFullWidth ? FULL_INLINE_PADDING : PAGE_INLINE_PADDING,
    paddingBlock: CONTENT_BLOCK_PADDING,
  };

  const overlayStyles: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
    background:
      overlayStyle === OverlayStyle.Gradient
        ? `linear-gradient(${gradientDirection}, ${overlayColor}, transparent)`
        : overlayColor,
  };

  return (
    <section
      className={rootClassName}
      style={rootStyle}
      aria-label="Hero"
      data-testid="hero"
    >
      {showReflection ? (
        <div className={ClassName.BlurredImage} aria-hidden="true">
          {media.reflectionImages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" />
          ))}
        </div>
      ) : null}

      <div className={ClassName.Container} style={containerStyle}>
        {s.link ? (
          <Link
            href={s.link}
            className={ClassName.Link}
            aria-label="Hero link"
            target={s.open_in_new_tab ? "_blank" : undefined}
            rel={s.open_in_new_tab ? "noopener" : undefined}
          />
        ) : null}

        <div className={ClassName.MediaGrid} data-testid="hero-media-wrapper">
          {showOverlay ? (
            <div aria-hidden="true" style={overlayStyles} />
          ) : null}

          {media.slots.map((slot, i) => (
            <MediaSlot key={i} slot={slot} priority={i === 0} />
          ))}

          {media.mediaCount === 0 ? (
            <div
              className={ClassName.MediaWrapper}
              style={{ background: EMPTY_MEDIA_BG }}
            />
          ) : null}
        </div>

        <div
          className={`${ClassName.ContentWrapper}${
            s.vertical_on_mobile ? ` ${ClassName.MobileColumn}` : ""
          }`}
          style={contentStyle}
        >
          {blocks.map((b, i) =>
            renderBlock(b, i, s.button_style, i === firstButtonIndex)
          )}
        </div>
      </div>
    </section>
  );
}

export { V2 as default };
