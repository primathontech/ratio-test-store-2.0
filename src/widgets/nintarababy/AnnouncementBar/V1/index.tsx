"use client";

import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import { AnnouncementBarProps } from "../types";
import {
  DEFAULT_MESSAGES,
  DESIGN_TOKENS,
  type AnnouncementMessage,
} from "../types";
import "../style.css";

/**
 * AnnouncementBar V1 Component
 *
 * A full-width promotional bar that auto-rotates between messages.
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
}: AnnouncementBarProps) {
  // Priority: settings.messages → data.messages → DEFAULT_MESSAGES
  const messages: AnnouncementMessage[] =
    (settings?.messages?.length ?? 0) > 0
      ? settings!.messages!
      : (data?.messages?.length ?? 0) > 0
        ? data!.messages!
        : DEFAULT_MESSAGES;

  const autoPlayInterval =
    settings?.autoPlayInterval ?? DESIGN_TOKENS.animation.autoPlayInterval;
  const pauseOnHover = settings?.pauseOnHover ?? true;
  const transitionDuration =
    settings?.transitionDuration ?? DESIGN_TOKENS.animation.transitionDuration;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isPausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messageCount = messages.length;

  const goToNext = useCallback(() => {
    if (messageCount <= 1) {
      return;
    }
    setIsTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % messageCount);
      setIsTransitioning(false);
    }, transitionDuration);
  }, [messageCount, transitionDuration]);

  useEffect(() => {
    if (messageCount <= 1) {
      return;
    }

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        if (!isPausedRef.current) {
          goToNext();
        }
        startTimer();
      }, autoPlayInterval);
    };

    startTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, [autoPlayInterval, goToNext, messageCount]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = true;
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = false;
    }
  }, [pauseOnHover]);

  const nextIndex = (currentIndex + 1) % messageCount;

  return (
    <div
      className={`nintara-announcement-bar ${className ?? ""}`}
      style={
        {
          "--nintara-ab-transition-duration": `${transitionDuration}ms`,
        } as React.CSSProperties
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Promotional announcements"
      data-testid="momsco-announcement-bar-container"
    >
      <div
        className="nintara-announcement-bar__container"
        data-testid="momsco-announcement-bar-wrapper"
      >
        <div
          className="nintara-announcement-bar__viewport"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className={`nintara-announcement-bar__slide ${
              isTransitioning
                ? "nintara-announcement-bar__slide--exit-left"
                : "nintara-announcement-bar__slide--active"
            }`}
          >
            <MessageContent message={messages[currentIndex]} />
          </div>

          {isTransitioning && messageCount > 1 && (
            <div className="nintara-announcement-bar__slide nintara-announcement-bar__slide--enter-left">
              <MessageContent message={messages[nextIndex]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const MessageContent = memo(function MessageContent({
  message,
}: {
  message: AnnouncementMessage;
}) {
  const text = (
    <p
      className="nintara-announcement-bar__message"
      data-testid="momsco-announcement-bar-text"
    >
      {message.text}
    </p>
  );

  if (message.href) {
    return (
      <a href={message.href} className="nintara-announcement-bar__link">
        {text}
      </a>
    );
  }

  return text;
});

export { V1 as default };
