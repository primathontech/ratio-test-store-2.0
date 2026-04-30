"use client";

import EmblaCarousel from "embla-carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProductImage } from "../types";

interface UseAutoplayProps {
  autoPlay: boolean;
  autoPlayInterval: number;
  pauseOnHover: boolean;
  isHovered: boolean;
  isZoomOpen: boolean;
  images: ProductImage[];
  currentIndex: number;
  onSlideChange: (index: number) => void;
}

interface UseAutoplayReturn {
  sliderRef: (node: HTMLDivElement | null) => void;
  instanceRef: React.MutableRefObject<EmblaCarouselType | undefined>;
  handlePrevious: () => void;
  handleNext: () => void;
  handleThumbnailClick: (index: number) => void;
  isSliderReady: boolean;
}

/**
 * Owns the embla-carousel instance for the main image slider plus autoplay
 * and external-sync (zoom modal / thumbnail clicks) behaviour.
 *
 * The slider is initialised lazily via the returned `sliderRef` callback so
 * the embla instance only exists once the DOM node is mounted.
 */
export const useAutoplay = ({
  autoPlay,
  autoPlayInterval,
  pauseOnHover,
  isHovered,
  isZoomOpen,
  images,
  currentIndex,
  onSlideChange,
}: UseAutoplayProps): UseAutoplayReturn => {
  const [isSliderReady, setIsSliderReady] = useState(false);
  const emblaApiRef = useRef<EmblaCarouselType | null>(null);

  // Track the last index to detect external changes (e.g. zoom modal navigation)
  const lastIndexRef = useRef<number>(currentIndex);
  const isInternalChangeRef = useRef(false);

  // Sync embla position when currentIndex changes externally
  useEffect(() => {
    const emblaApi = emblaApiRef.current;
    if (!emblaApi || !isSliderReady) {
      return;
    }

    const currentEmblaIndex = emblaApi.selectedScrollSnap();
    if (
      lastIndexRef.current !== currentIndex &&
      currentEmblaIndex !== currentIndex
    ) {
      isInternalChangeRef.current = true;
      emblaApi.scrollTo(currentIndex, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isInternalChangeRef.current = false;
        });
      });
    }

    lastIndexRef.current = currentIndex;
  }, [currentIndex, isSliderReady]);

  // Track slide changes from embla → propagate to gallery state
  useEffect(() => {
    const emblaApi = emblaApiRef.current;
    if (!emblaApi) {
      return;
    }

    const onSelect = () => {
      if (isInternalChangeRef.current) {
        return;
      }
      onSlideChange(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [onSlideChange, isSliderReady]);

  // Auto-play tick
  useEffect(() => {
    const emblaApi = emblaApiRef.current;
    if (!emblaApi || !autoPlay || images.length <= 1) {
      return;
    }

    let timeout: NodeJS.Timeout;
    const scheduleNext = () => {
      timeout = setTimeout(() => {
        emblaApi.scrollNext();
        scheduleNext();
      }, autoPlayInterval);
    };

    if (!pauseOnHover || !isHovered) {
      if (!isZoomOpen) {
        scheduleNext();
      }
    }

    return () => clearTimeout(timeout);
  }, [
    autoPlayInterval,
    isHovered,
    pauseOnHover,
    autoPlay,
    isZoomOpen,
    images.length,
  ]);

  const handlePrevious = useCallback(() => {
    emblaApiRef.current?.scrollPrev();
  }, []);

  const handleNext = useCallback(() => {
    emblaApiRef.current?.scrollNext();
  }, []);

  const handleThumbnailClick = useCallback((index: number) => {
    emblaApiRef.current?.scrollTo(index);
  }, []);

  /**
   * Ref callback — mounts/unmounts the embla instance.
   * Called by React when the slider DOM node attaches/detaches.
   */
  const sliderRef = useCallback((node: HTMLDivElement | null) => {
    if (node && !emblaApiRef.current) {
      const embla = EmblaCarousel(node, {
        loop: false,
        align: "start",
        dragFree: true,
        containScroll: "trimSnaps",
        watchDrag: true,
      });

      emblaApiRef.current = embla;

      const onInit = () => setIsSliderReady(true);

      // Snap to nearest slide shortly after drag ends so dragFree momentum
      // doesn't leave the user mid-slide.
      let snapTimeout: NodeJS.Timeout;
      const onPointerUp = () => {
        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(() => {
          if (!embla.internalEngine()) {
            return;
          }
          embla.scrollTo(embla.selectedScrollSnap());
        }, 100);
      };
      const onDestroy = () => clearTimeout(snapTimeout);

      embla.on("init", onInit);
      embla.on("pointerUp", onPointerUp);
      embla.on("destroy", onDestroy);
      embla.reInit();
    } else if (!node && emblaApiRef.current) {
      emblaApiRef.current.destroy();
      emblaApiRef.current = null;
      setIsSliderReady(false);
    }
  }, []);

  const instanceRef = useRef<EmblaCarouselType | undefined>(
    emblaApiRef.current || undefined
  );

  useEffect(() => {
    instanceRef.current = emblaApiRef.current || undefined;
  }, [isSliderReady]);

  return {
    sliderRef,
    instanceRef,
    handlePrevious,
    handleNext,
    handleThumbnailClick,
    isSliderReady,
  };
};
