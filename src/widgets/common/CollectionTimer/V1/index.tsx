"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { CollectionTimerProps } from "../types";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const TimerDigit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center rounded-full border-2 border-[#80808054] bg-white w-[60px] h-[60px]">
    <span className="text-[25px] text-black leading-none tabular-nums">
      {value.toString().padStart(2, "0")}
    </span>
    <span className="text-sm text-primary">{label}</span>
  </div>
);

const DecorativeLines = ({ color }: { color: string }) => (
  <>
    <span
      className="block h-[3px] w-9 rounded-full"
      style={{ backgroundColor: color }}
    />
    <span
      className="block h-[3px] w-[29px] rounded-full"
      style={{ backgroundColor: color }}
    />
    <span
      className="block h-[3px] w-9 rounded-full"
      style={{ backgroundColor: color }}
    />
  </>
);

export const V1 = memo(function CollectionTimerV1({
  settings,
  className = "",
}: CollectionTimerProps) {
  const {
    endDateString,
    timerInterval = 1000,
    urgencyText = "Hurry Up!",
    saleLabel = "Sale ends in:",
    expiredText = "Oops! Offer is Expired",
    visible = true,
    backgroundColor = "#ffffff",
    textColor = "#1D1D1D",
    urgencyColor = "#EA499A",
    style,
  } = settings ?? {};

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
  });

  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = useCallback((endDateStr: string): TimeLeft => {
    try {
      const endDate = new Date(endDateStr);
      if (isNaN(endDate.getTime())) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
      };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    if (!endDateString) {
      return;
    }

    setTimeLeft(calculateTimeLeft(endDateString));

    intervalRef.current = setInterval(() => {
      const next = calculateTimeLeft(endDateString);
      if (!isMountedRef.current) {
        return;
      }
      setTimeLeft(next);
      if (next.isExpired && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, timerInterval);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endDateString, timerInterval, calculateTimeLeft]);

  if (!visible || !endDateString) {
    return null;
  }

  return (
    <div
      data-testid="collection-timer-container"
      className={`w-full flex flex-col items-center justify-center pt-20 pb-8 ${className || ""}`.trim()}
      style={{ backgroundColor, color: textColor, ...style }}
    >
      {/* Urgency heading with decorative lines */}
      <div
        data-testid="collection-timer-urgency"
        className="flex items-center gap-4 mb-4"
      >
        <span className="flex flex-col items-end gap-[9px]">
          <DecorativeLines color={urgencyColor} />
        </span>

        <h2
          className="text-2xl lg:text-5xl font-bold leading-none"
          style={{ color: urgencyColor }}
        >
          {urgencyText}
        </h2>

        <span className="flex flex-col gap-[9px]">
          <DecorativeLines color={urgencyColor} />
        </span>
      </div>

      {/* Expired text OR sale label */}
      <p
        data-testid="collection-timer-status-text"
        className="text-[28px] lg:text-[38px] font-semibold mb-2 text-center"
        style={{ color: textColor }}
      >
        {timeLeft.isExpired ? expiredText : saleLabel}
      </p>

      {/* Timer digits — always rendered, zeroed when expired */}
      <div
        data-testid="collection-timer-digits"
        className="flex items-start gap-4 md:gap-6"
      >
        <TimerDigit value={timeLeft.days} label="Days" />
        <TimerDigit value={timeLeft.hours} label="Hr" />
        <TimerDigit value={timeLeft.minutes} label="Min" />
        <TimerDigit value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
});
