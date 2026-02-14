"use client";
import React, { useState, useEffect, useCallback } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";

/**
 * Enhanced Image component with fallback support and optimized performance.
 *
 * Built on top of Next.js Image component with additional features:
 * - Multi-level fallback system (primary → fallback → final placeholder)
 * - Automatic object-fit handling via Tailwind classes
 * - Enhanced error handling and developer warnings
 * - Type-safe props with full TypeScript support
 *
 * @example
 * ```tsx
 * // Basic usage with dimensions
 * <Image
 *   src="/photo.jpg"
 *   alt="Profile photo"
 *   width={400}
 *   height={300}
 * />
 *
 * // With fallback images
 * <Image
 *   src="/user-avatar.jpg"
 *   alt="User avatar"
 *   fallbackSrc="/default-avatar.png"
 *   width={100}
 *   height={100}
 *   objectFit="cover"
 * />
 *
 * // Fill container (responsive)
 * <div className="relative w-full h-64">
 *   <Image
 *     src="/hero-banner.jpg"
 *     alt="Hero banner"
 *     fill
 *     objectFit="cover"
 *     priority
 *   />
 * </div>
 *
 * // With error handling
 * <Image
 *   src="/gallery-image.jpg"
 *   alt="Gallery image"
 *   fallbackSrc="/image-placeholder.svg"
 *   width={300}
 *   height={200}
 *   onError={() => analytics.track('image_load_failed')}
 * />
 * ```
 */
export interface ImageProps extends Omit<
  NextImageProps,
  "src" | "alt" | "onError"
> {
  /**
   * Primary image source URL
   * @example "/images/photo.jpg" or "https://example.com/image.png"
   */
  src: string;

  /**
   * Alternative text for accessibility and SEO
   * @example "User profile photo" or "Product showcase image"
   */
  alt: string;

  /**
   * Fallback image source when primary image fails to load
   * @example "/images/default-avatar.png"
   */
  fallbackSrc?: string;

  /**
   * Final fallback when both primary and fallback images fail
   * Defaults to a base64-encoded SVG placeholder
   * @example "/images/error-placeholder.svg"
   */
  finalFallbackSrc?: string;

  /**
   * Object fit behavior using Tailwind CSS classes for optimal performance
   * - "cover": Scales to cover entire container (may crop)
   * - "contain": Scales to fit within container (maintains aspect ratio)
   * - "fill": Stretches to fill container (may distort)
   * - "none": No scaling
   * - "scale-down": Same as contain or none, whichever is smaller
   * @default "cover"
   */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";

  /**
   * Callback fired when any image (primary, fallback, or final) fails to load
   * Useful for analytics, logging, or additional error handling
   * @example () => console.log('Image failed to load')
   */
  onError?: () => void;
}

/**
 * Enhanced Image Component
 *
 * @param props - Image component props extending Next.js ImageProps
 * @returns JSX.Element | null
 *
 * @example
 * ```tsx
 * // Product image with fallback
 * <Image
 *   src="/products/item-123.jpg"
 *   alt="Wireless headphones"
 *   fallbackSrc="/images/product-placeholder.jpg"
 *   width={400}
 *   height={300}
 *   objectFit="contain"
 *   className="rounded-lg shadow-md"
 * />
 *
 * // Avatar with multiple fallbacks
 * <Image
 *   src={user.avatarUrl}
 *   alt={`${user.name}'s avatar`}
 *   fallbackSrc="/images/default-avatar.png"
 *   finalFallbackSrc="/images/anonymous-user.svg"
 *   width={64}
 *   height={64}
 *   objectFit="cover"
 *   className="rounded-full"
 * />
 *
 * // Responsive hero image
 * <div className="relative w-full h-screen">
 *   <Image
 *     src="/images/hero-background.jpg"
 *     alt="Company headquarters"
 *     fill
 *     objectFit="cover"
 *     priority
 *     quality={90}
 *   />
 * </div>
 * ```
 */
export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallbackSrc,
  finalFallbackSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY5NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=",
  objectFit = "cover",
  fill = false,
  className = "",
  style,
  onError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [errorState, setErrorState] = useState<"none" | "fallback" | "final">(
    "none"
  );

  // Reset state when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setErrorState("none");
  }, [src]);

  const handleError = useCallback(() => {
    if (errorState === "none" && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setErrorState("fallback");
    } else if (errorState === "fallback" && finalFallbackSrc) {
      setCurrentSrc(finalFallbackSrc);
      setErrorState("final");
    }

    // Call user's onError callback if provided
    onError?.();
  }, [fallbackSrc, finalFallbackSrc, errorState, onError]);

  // Validation
  if (!fill && (!props.width || !props.height)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Image component requires either fill=true or both width and height props.",
        { src, alt }
      );
    }
    return null;
  }

  // Build className with object-fit
  const objectFitClass = objectFit ? `object-${objectFit}` : "";
  const combinedClassName = [className, objectFitClass]
    .filter(Boolean)
    .join(" ");

  const sharedProps = {
    src: currentSrc,
    alt,
    onError: handleError,
    className: combinedClassName,
    style,
    ...props,
  };

  return fill ? (
    <div className="relative w-full h-full">
      <NextImage fill {...sharedProps} />
    </div>
  ) : (
    <NextImage {...sharedProps} />
  );
};

export default Image;

/**
 * USAGE GUIDE & BEST PRACTICES
 * ============================
 *
 * ## Basic Usage
 * ```tsx
 * import Image from '@/components/Image';
 *
 * // Standard image with dimensions
 * <Image src="/photo.jpg" alt="Description" width={400} height={300} />
 * ```
 *
 * ## Common Patterns
 *
 * ### 1. User Avatars
 * ```tsx
 * <Image
 *   src={user.avatar}
 *   alt={`${user.name}'s avatar`}
 *   fallbackSrc="/default-avatar.png"
 *   width={48}
 *   height={48}
 *   objectFit="cover"
 *   className="rounded-full"
 * />
 * ```
 *
 * ### 2. Product Images
 * ```tsx
 * <Image
 *   src={product.imageUrl}
 *   alt={product.name}
 *   fallbackSrc="/product-placeholder.jpg"
 *   width={300}
 *   height={200}
 *   objectFit="contain"
 *   className="bg-gray-50"
 * />
 * ```
 *
 * ### 3. Hero/Banner Images (Responsive)
 * ```tsx
 * <div className="relative w-full h-96">
 *   <Image
 *     src="/hero.jpg"
 *     alt="Hero image"
 *     fill
 *     objectFit="cover"
 *     priority // Load immediately
 *     sizes="100vw" // Responsive sizing
 *   />
 * </div>
 * ```
 *
 * ### 4. Gallery with Loading States
 * ```tsx
 * <Image
 *   src={galleryItem.src}
 *   alt={galleryItem.caption}
 *   fallbackSrc="/image-loading.svg"
 *   width={250}
 *   height={250}
 *   objectFit="cover"
 *   loading="lazy" // Lazy load for performance
 *   onError={() => {
 *     console.log('Failed to load gallery image');
 *     analytics.track('image_error', { src: galleryItem.src });
 *   }}
 * />
 * ```
 *
 * ## Performance Tips
 *
 * 1. **Use appropriate sizes**: Always provide width/height or use fill properly
 * 2. **Optimize images**: Use WebP format when possible
 * 3. **Lazy loading**: Use loading="lazy" for images below the fold
 * 4. **Priority loading**: Use priority={true} for above-the-fold images
 * 5. **Responsive images**: Use sizes prop for responsive layouts
 *
 * ## Accessibility Best Practices
 *
 * - Always provide meaningful alt text
 * - Use empty alt="" for decorative images
 * - Consider screen reader experience
 *
 * ```tsx
 * // Good alt text
 * <Image src="/chart.png" alt="Sales increased 25% in Q4 2024" />
 *
 * // Decorative image
 * <Image src="/decoration.svg" alt="" />
 * ```
 *
 * ## Error Handling
 *
 * The component provides three levels of fallback:
 * 1. Primary image (your src prop)
 * 2. Fallback image (fallbackSrc prop)
 * 3. Final fallback (finalFallbackSrc prop or default placeholder)
 *
 * ```tsx
 * <Image
 *   src="/might-not-exist.jpg"
 *   alt="User content"
 *   fallbackSrc="/backup-image.jpg"
 *   finalFallbackSrc="/final-placeholder.svg"
 *   onError={() => logImageError()}
 * />
 * ```
 *
 * ## Tailwind CSS Integration
 *
 * The component uses Tailwind classes for object-fit:
 * - objectFit="cover" → class="object-cover"
 * - objectFit="contain" → class="object-contain"
 * - etc.
 *
 * Make sure Tailwind CSS is properly configured in your project.
 *
 * ## TypeScript Support
 *
 * The component is fully typed and extends Next.js ImageProps:
 * ```tsx
 * interface MyComponentProps {
 *   imageProps: ImageProps;
 * }
 *
 * const MyComponent: React.FC<MyComponentProps> = ({ imageProps }) => (
 *   <Image {...imageProps} />
 * );
 * ```
 */
