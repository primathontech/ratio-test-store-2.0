"use client";

import React, { useEffect, useState } from "react";

import { useResponsive } from "@/hooks/useResponsive";

import { MainImageSlider } from "./MainImageSlider";
import { ThumbnailContainer } from "./ThumbnailContainer";
import { ZoomModal } from "./ZoomModal";
import { HoverPreview } from "./HoverPreview";
import { GALLERY_CONFIG, GALLERY_DEFAULTS } from "../constants";
import { useGalleryState } from "../hooks/useGalleryState";
import { useAutoplay } from "../hooks/useAutoplay";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { ProductImage, ProductLabel } from "../types";

interface ProductGalleryProps {
  images: ProductImage[];
  productLabel?: ProductLabel | null;
  /**
   * Fired when the desktop hover-magnifier opens / closes — the parent (the
   * ProductDetail right column) uses this to dim the info side while the
   * magnifier is showing.
   */
  onHoverPreviewChange?: (isVisible: boolean) => void;
  className?: string;
}

/**
 * Orchestrates the entire product image gallery: embla slider, hover
 * magnifier, lightbox/zoom modal, keyboard nav, and the desktop thumbnail
 * strip — composed via the components in this folder.
 *
 * Settings are hardcoded to the bblunt-tuned defaults in
 * [`../constants`](../constants/index.ts) per the porting decision in
 * `docs/PDP_PRODUCT_GALLERY_FLOW.md` §7.2.
 */
export const ProductGallery: React.FC<ProductGalleryProps> = React.memo(
  function ProductGallery({
    images,
    productLabel,
    onHoverPreviewChange,
    className,
  }) {
    const settings = GALLERY_DEFAULTS;

    const { isMobile } = useResponsive();
    const galleryState = useGalleryState();
    const [isHoveringNavigationArrow, setIsHoveringNavigationArrow] =
      useState(false);

    const {
      sliderRef,
      handlePrevious,
      handleNext,
      handleThumbnailClick,
      isSliderReady,
    } = useAutoplay({
      autoPlay: settings.autoPlay,
      autoPlayInterval: settings.autoPlayInterval,
      pauseOnHover: settings.pauseOnHover,
      isHovered: galleryState.isHovered,
      isZoomOpen: galleryState.isZoomOpen,
      images,
      currentIndex: galleryState.currentIndex,
      onSlideChange: galleryState.setCurrentIndex,
    });

    useKeyboardNavigation({
      isZoomOpen: galleryState.isZoomOpen,
      onPrevious: handlePrevious,
      onNext: handleNext,
    });

    // Toggle a body class while the lightbox is open so other widgets
    // (header, sticky ATC bar) can hide via CSS — see §7.4 of the flow doc.
    useEffect(() => {
      if (galleryState.isZoomOpen) {
        document.body.classList.add("zoom-modal-open");
      } else {
        document.body.classList.remove("zoom-modal-open");
      }
      return () => {
        document.body.classList.remove("zoom-modal-open");
      };
    }, [galleryState.isZoomOpen]);

    // Suppress hover-preview while a navigation arrow is hovered — moving
    // the cursor across the magnifier-trigger region while clicking arrows
    // looks jumpy otherwise.
    useEffect(() => {
      if (settings.enableHoverPreview && !isMobile) {
        if (isHoveringNavigationArrow) {
          galleryState.setIsHoverPreviewVisible(false);
          galleryState.setMousePosition({ x: 0, y: 0 });
          onHoverPreviewChange?.(false);
        }
      }
    }, [
      isHoveringNavigationArrow,
      isMobile,
      galleryState,
      onHoverPreviewChange,
      settings.enableHoverPreview,
    ]);

    if (!images || images.length === 0) {
      return null;
    }

    const handleMainImageClick = (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }
      if (settings.enableZoom) {
        galleryState.setIsZoomOpen(true);
      }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        !settings.enableHoverPreview ||
        !galleryState.mainImageRef.current ||
        isMobile ||
        isHoveringNavigationArrow
      ) {
        return;
      }
      galleryState.setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      if (
        settings.enableHoverPreview &&
        galleryState.mainImageRef.current &&
        !isMobile &&
        !isHoveringNavigationArrow
      ) {
        const rect = galleryState.mainImageRef.current.getBoundingClientRect();
        galleryState.setContainerDimensions({
          width: rect.width,
          height: rect.height,
        });
        galleryState.setIsHoverPreviewVisible(true);
        onHoverPreviewChange?.(true);
      }
      if (settings.pauseOnHover) {
        galleryState.setIsHovered(true);
      }
    };

    const handleMouseLeave = () => {
      if (settings.enableHoverPreview && !isMobile) {
        galleryState.setIsHoverPreviewVisible(false);
        galleryState.setMousePosition({ x: 0, y: 0 });
        onHoverPreviewChange?.(false);
      }
      if (settings.pauseOnHover) {
        galleryState.setIsHovered(false);
      }
    };

    const handleHoverPreviewDisable = () => {
      if (settings.enableHoverPreview && !isMobile) {
        setIsHoveringNavigationArrow(true);
        galleryState.setIsHoverPreviewVisible(false);
        galleryState.setMousePosition({ x: 0, y: 0 });
        onHoverPreviewChange?.(false);
      }
    };

    const handleHoverPreviewEnable = () => {
      if (settings.enableHoverPreview && !isMobile) {
        setIsHoveringNavigationArrow(false);
        if (galleryState.mainImageRef.current) {
          const rect =
            galleryState.mainImageRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            galleryState.setContainerDimensions({
              width: rect.width,
              height: rect.height,
            });
            galleryState.setIsHoverPreviewVisible(true);
            onHoverPreviewChange?.(true);
          }
        }
      }
    };

    return (
      <div
        aria-label="Product image gallery"
        role="region"
        className={className}
      >
        <div
          className={`flex gap-4 w-full max-w-full ${
            galleryState.isHoverPreviewVisible && settings.enableHoverPreview
              ? "opacity-50"
              : ""
          }`}
        >
          <div className="flex-1 min-w-0">
            <MainImageSlider
              images={images}
              currentIndex={galleryState.currentIndex}
              onSlideChange={galleryState.setCurrentIndex}
              onThumbnailClick={handleThumbnailClick}
              onImageClick={handleMainImageClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onExpandClick={() => galleryState.setIsZoomOpen(true)}
              mainImageRadius={settings.mainImageRadius}
              autoPlay={settings.autoPlay}
              autoPlayAnimation={settings.autoPlayAnimation}
              showNavigationArrows={settings.showNavigationArrows}
              navigationArrowSize={settings.navigationArrowSize}
              navigationArrowBgColor={settings.navigationArrowBgColor}
              navigationArrowIconColor={settings.navigationArrowIconColor}
              navigationArrowShape={settings.navigationArrowShape}
              enableHoverPreview={settings.enableHoverPreview && !isMobile}
              showSelectionBox={
                GALLERY_CONFIG.SELECTION_BOX.DEFAULT_SHOW && !isMobile
              }
              isHoverPreviewVisible={galleryState.isHoverPreviewVisible}
              mousePosition={galleryState.mousePosition}
              containerDimensions={galleryState.containerDimensions}
              hoverPreviewSize={
                GALLERY_CONFIG.HOVER_PREVIEW.DEFAULT_SIZE_MULTIPLIER
              }
              selectionBoxBorderColor={
                GALLERY_CONFIG.SELECTION_BOX.DEFAULT_BORDER_COLOR
              }
              selectionBoxBorderWidth={
                GALLERY_CONFIG.SELECTION_BOX.DEFAULT_BORDER_WIDTH
              }
              selectionBoxBackgroundOpacity={
                GALLERY_CONFIG.SELECTION_BOX.DEFAULT_BACKGROUND_OPACITY
              }
              onHoverPreviewDisable={handleHoverPreviewDisable}
              onHoverPreviewEnable={handleHoverPreviewEnable}
              containerRef={galleryState.mainImageRef}
              sliderRef={sliderRef}
              isSliderReady={isSliderReady}
              productLabel={productLabel}
            />

            <div
              ref={galleryState.thumbnailContainerRef}
              className={`max-h-[459px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-auto md:pt-[10px] ${
                galleryState.isHoverPreviewVisible &&
                settings.enableHoverPreview
                  ? "opacity-50"
                  : ""
              }`}
            >
              <ThumbnailContainer
                images={images}
                currentIndex={galleryState.currentIndex}
                onThumbnailClick={handleThumbnailClick}
                layout="horizontal"
                thumbnailSize={settings.thumbnailSize}
                thumbnailRadius={settings.thumbnailRadius}
                thumbnailSpacing={settings.thumbnailSpacing}
                activeThumbnailBorderColor={settings.activeThumbnailBorderColor}
                activeThumbnailBorderWidth={settings.activeThumbnailBorderWidth}
                thumbnailLayout={settings.thumbnailLayout}
                containerRef={galleryState.thumbnailContainerRef}
              />
            </div>
          </div>
        </div>

        <ZoomModal
          images={images}
          currentIndex={galleryState.currentIndex}
          isOpen={galleryState.isZoomOpen}
          onClose={() => galleryState.setIsZoomOpen(false)}
          onNavigate={galleryState.setCurrentIndex}
          bgColor={settings.lightboxBgColor}
          overlayOpacity={settings.lightboxOverlayOpacity}
          zoomIconColor={settings.zoomIconColor}
        />

        {settings.enableHoverPreview && !isMobile && images.length > 0 && (
          <HoverPreview
            image={images[galleryState.currentIndex]}
            isVisible={galleryState.isHoverPreviewVisible}
            mousePosition={galleryState.mousePosition}
            containerRef={galleryState.mainImageRef}
            containerDimensions={galleryState.containerDimensions}
          />
        )}
      </div>
    );
  }
);
