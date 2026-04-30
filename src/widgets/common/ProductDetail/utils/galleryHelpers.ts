/**
 * Pure helpers for the product gallery — animation classes, expand-icon
 * positioning, and video detection. Kept separate from the React tree so
 * components stay focused on rendering.
 */

export const getAnimationClass = (
  autoPlay: boolean,
  autoPlayAnimation: string
): string => {
  if (!autoPlay || autoPlayAnimation === "none") {
    return "";
  }
  switch (autoPlayAnimation) {
    case "slide-left":
    case "slide-right":
      return "transition-transform duration-500";
    case "fade":
      return "transition-opacity duration-400";
    default:
      return "";
  }
};

export const getExpandIconPositionStyle = (
  position: string
): React.CSSProperties => {
  switch (position) {
    case "top-right":
      return { top: "8px", right: "8px" };
    case "top-left":
      return { top: "8px", left: "8px" };
    case "bottom-right":
      return { bottom: "8px", right: "8px" };
    case "bottom-left":
      return { bottom: "8px", left: "8px" };
    default:
      return { top: "8px", right: "8px" };
  }
};

/**
 * A media item is a video when its API `type` is "VIDEO" or its URL has a
 * known video extension. Used to skip videos in the zoom modal and to swap
 * to a poster thumbnail in the carousel peek state.
 */
export const isVideo = (media: { url?: string; type?: string }): boolean => {
  if (media.type) {
    return media.type.toUpperCase() === "VIDEO";
  }
  const url = media.url?.toLowerCase() || "";
  return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
};
