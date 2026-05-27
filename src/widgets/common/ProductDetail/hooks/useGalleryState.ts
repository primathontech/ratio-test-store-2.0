"use client";

import { useState, useCallback, useRef } from "react";

interface GalleryState {
  currentIndex: number;
  isZoomOpen: boolean;
  isHovered: boolean;
  isHoverPreviewVisible: boolean;
  mousePosition: { x: number; y: number };
  containerDimensions: { width: number; height: number };
}

export interface UseGalleryStateReturn extends GalleryState {
  setCurrentIndex: (index: number) => void;
  setIsZoomOpen: (isOpen: boolean) => void;
  setIsHovered: (isHovered: boolean) => void;
  setIsHoverPreviewVisible: (isVisible: boolean) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  setContainerDimensions: (dimensions: {
    width: number;
    height: number;
  }) => void;
  resetState: () => void;
  mainImageRef: React.RefObject<HTMLDivElement>;
  thumbnailContainerRef: React.RefObject<HTMLDivElement>;
}

const initialState: GalleryState = {
  currentIndex: 0,
  isZoomOpen: false,
  isHovered: false,
  isHoverPreviewVisible: false,
  mousePosition: { x: 0, y: 0 },
  containerDimensions: { width: 0, height: 0 },
};

/**
 * Centralised gallery state — index, zoom flag, hover flag, mouse position,
 * container dimensions, plus refs to the main image and thumbnail container.
 */
export const useGalleryState = (): UseGalleryStateReturn => {
  const [state, setState] = useState<GalleryState>(initialState);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const setCurrentIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentIndex: index }));
  }, []);

  const setIsZoomOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isZoomOpen: isOpen }));
  }, []);

  const setIsHovered = useCallback((isHovered: boolean) => {
    setState((prev) => ({ ...prev, isHovered }));
  }, []);

  const setIsHoverPreviewVisible = useCallback((isVisible: boolean) => {
    setState((prev) => ({ ...prev, isHoverPreviewVisible: isVisible }));
  }, []);

  const setMousePosition = useCallback((position: { x: number; y: number }) => {
    setState((prev) => ({ ...prev, mousePosition: position }));
  }, []);

  const setContainerDimensions = useCallback(
    (dimensions: { width: number; height: number }) => {
      setState((prev) => ({ ...prev, containerDimensions: dimensions }));
    },
    []
  );

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setCurrentIndex,
    setIsZoomOpen,
    setIsHovered,
    setIsHoverPreviewVisible,
    setMousePosition,
    setContainerDimensions,
    resetState,
    mainImageRef,
    thumbnailContainerRef,
  };
};
