"use client";

/**
 * Shared contextual message bar — exact same as ProductStickyBarV2.
 * Animated teal fill grows from 0% to 100% as cart goes 0→3.
 * Celebration confetti when bar completes (cart reaches 3).
 */

import { useCartTotalQuantity } from "@shopkit/cart";
import { useEffect, useId, useRef, useState } from "react";

function OfferBadgeIcon({ clipId }: { clipId: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M8.16008 0.113856C9.82302 -0.0866159 10.0529 0.94997 11.0849 1.71763C11.5789 2.08434 12.3028 1.89365 12.8848 1.93766C14.0587 2.02567 14.9782 2.94979 15.0662 4.12329C15.1102 4.70514 14.9244 5.42879 15.2863 5.91776C15.8879 6.72943 16.8025 7.04233 16.9003 8.26474C17.0275 9.86849 16.0346 10.0836 15.2863 11.0909C14.9244 11.575 15.1053 12.279 15.0662 12.8512C14.9831 14.0491 14.0831 14.9781 12.8799 15.0661C12.2979 15.1101 11.574 14.9243 11.0849 15.2861C10.273 15.8924 9.96487 16.8019 8.73719 16.8997C7.12804 17.0317 6.91775 16.0342 5.91019 15.2861C5.42596 14.9243 4.72165 15.1052 4.14941 15.0661C2.95599 14.983 2.0218 14.0784 1.93377 12.8805C1.88974 12.2986 2.07561 11.575 1.71367 11.086C1.11207 10.2743 0.197445 9.96142 0.0996237 8.73901C-0.0275433 7.13034 0.965338 6.92501 1.71367 5.91285C2.462 4.90073 1.88974 4.69536 1.93377 4.11351C2.0218 2.91557 2.96089 2.011 4.1543 1.93277C5.34773 1.85453 5.43087 2.07456 5.91506 1.71274C6.68785 1.13577 7.01555 0.245874 8.16495 0.108966L8.16008 0.113856ZM6.32594 5.38966C4.97112 5.58525 5.10805 7.7562 6.57049 7.72689C8.14538 7.69754 8.07689 5.13541 6.32594 5.38966ZM10.6154 5.72218C10.5567 5.73196 10.498 5.75153 10.4442 5.77105L5.81727 10.3526C5.41617 10.9247 6.14496 11.5896 6.67807 11.1398L11.1729 6.6512C11.4762 6.22089 11.1241 5.6586 10.6154 5.72705V5.72218ZM10.361 9.28177C8.80081 9.42357 8.99153 11.8146 10.6398 11.6141C12.068 11.4429 11.8675 9.13997 10.361 9.28177Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="17" height="17" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function ContextualMessageBar({
  message,
  thresholdProductCount,
  dataTestId,
}: {
  message: string;
  thresholdProductCount: number;
  dataTestId?: string;
}) {
  const cartCount = useCartTotalQuantity();
  const clipId = useId();
  const prevCartCountRef = useRef<number | null>(null);
  const prevThresholdRef = useRef(thresholdProductCount);
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const CONFETTI_PREFIX = "confetti_shown_";

  // Clear all confetti keys (used when cart empties — checkout or remove all)
  const clearAllConfettiKeys = () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CONFETTI_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  };

  // Show confetti once per threshold, tracked in localStorage
  const triggerConfetti = (threshold: number) => {
    const storageKey = `${CONFETTI_PREFIX}${threshold}`;
    if (localStorage.getItem(storageKey) === "1") {
      return;
    }
    localStorage.setItem(storageKey, "1");
    setShowConfetti(true);
    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
    }
    confettiTimerRef.current = setTimeout(() => setShowConfetti(false), 3000);
  };

  // Cleanup confetti timer on unmount
  useEffect(() => {
    return () => {
      if (confettiTimerRef.current) {
        clearTimeout(confettiTimerRef.current);
      }
    };
  }, []);

  // Track cart count & threshold changes — clear on empty, trigger confetti on crossing
  useEffect(() => {
    // Skip initial mount — just record current values
    if (prevCartCountRef.current === null) {
      prevCartCountRef.current = cartCount;
      prevThresholdRef.current = thresholdProductCount;
      return;
    }

    const prevCount = prevCartCountRef.current;
    const prevThreshold = prevThresholdRef.current;

    // Clear confetti keys when cart count decreases (items removed)
    // so re-crossing a threshold triggers confetti again
    if (cartCount < prevCount) {
      clearAllConfettiKeys();
      setShowConfetti(false);
    }

    // Intermediate threshold crossed: thresholdProductCount jumped up
    if (
      cartCount > prevCount &&
      thresholdProductCount > prevThreshold &&
      prevThreshold > 0
    ) {
      triggerConfetti(prevThreshold);
    }

    // Final threshold crossed: cart count reached the threshold
    if (
      thresholdProductCount === prevThreshold &&
      thresholdProductCount > 0 &&
      prevCount < thresholdProductCount &&
      cartCount >= thresholdProductCount
    ) {
      triggerConfetti(thresholdProductCount);
    }

    prevCartCountRef.current = cartCount;
    prevThresholdRef.current = thresholdProductCount;
  }, [cartCount, thresholdProductCount]);

  return (
    <div className="relative px-[15px] py-[6px]">
      {/* Confetti GIF — mobile only, floats above the message bar */}
      {showConfetti && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="https://images.mamaearth.in/gif/tierDiscount/confetti.gif"
          alt=""
          aria-hidden="true"
          className="block md:hidden absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[200px] h-[360px] pointer-events-none z-[9999]"
        />
      )}

      <div
        className="relative flex items-center gap-2 p-[9.5px] rounded-full overflow-hidden"
        style={{
          WebkitBackdropFilter: "blur(32px)",
          backdropFilter: "blur(32px)",
          border: "1px solid",
          borderImageSource:
            "linear-gradient(90deg, rgba(221, 221, 221, .2) 0%, rgba(221, 221, 221, .4) 100%)",
          background: "#dad6ffb2",
        }}
      >
        {/* Animated teal fill — grows from 0% to 100% as cart goes 0→3 */}
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width:
              thresholdProductCount > 0
                ? `${(Math.min(cartCount, thresholdProductCount) / thresholdProductCount) * 100}%`
                : "0%",
            backgroundColor: "#C1FF8380",
            transition: "width 600ms ease",
          }}
        />

        <div className="relative z-10 flex items-center gap-2">
          <OfferBadgeIcon clipId={clipId} />
          <p
            className="text-[12px] leading-tight text-[#1D1D1D] font-[500] font-accent "
            {...(dataTestId && { "data-testid": dataTestId })}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
