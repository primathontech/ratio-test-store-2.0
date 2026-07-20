import Image from "next/image";
import { ResolvedMedia, ClassName } from "../constants";
import type { ResolvedSlot } from "../utils";

interface MediaSlotProps {
  slot: ResolvedSlot;
  priority: boolean;
}

interface MediaElementProps {
  kind: ResolvedMedia;
  src: string;
  alt: string;
  priority: boolean;
  className: string;
}

function MediaElement({
  kind,
  src,
  alt,
  priority,
  className,
}: MediaElementProps) {
  if (kind === ResolvedMedia.Video) {
    return (
      // Full-bleed cover video filling a fixed-min-height hero slot (h/w 100%
      // via .cs-hero-v2__media) — the container reserves space, so no layout shift.
      // eslint-disable-next-line no-restricted-syntax
      <video
        className={`${ClassName.Media} ${className}`}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src={src}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      className={`${ClassName.Media} ${className}`}
    />
  );
}

/**
 * Renders a single hero media slot. When a distinct mobile source exists,
 * a desktop element (hidden <750px) and a mobile element (shown <750px) are
 * emitted; otherwise the single source is shown at all breakpoints.
 *
 * The first slot (above the fold) is the LCP element on whichever viewport
 * is active, so BOTH its desktop and mobile variants are marked `priority`
 * (eager + fetchpriority high + preload). Every other slot/variant is left
 * to next/image's default lazy loading.
 */
export function MediaSlot({ slot, priority }: MediaSlotProps) {
  const hasMobile = Boolean(slot.mobileSrc);

  return (
    <div className={ClassName.MediaWrapper}>
      <MediaElement
        kind={slot.kind}
        src={slot.desktopSrc}
        alt={slot.alt}
        priority={priority}
        className={hasMobile ? ClassName.MediaDesktopHasMobile : ""}
      />
      {hasMobile ? (
        <MediaElement
          kind={slot.kind}
          src={slot.mobileSrc as string}
          alt={slot.alt}
          priority={priority}
          className={ClassName.MediaMobile}
        />
      ) : null}
    </div>
  );
}
