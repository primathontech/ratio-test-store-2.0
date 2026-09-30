"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface TimerProps {
  /** End date string in format "Jan 20, 2026 12:59:59" */
  endDateString: string;
  /** Update interval in milliseconds */
  interval?: number;
  /** Custom styling */
  className?: string;
  /** Fires whenever the expired state changes (incl. initial mount). */
  onExpiredChange?: (expired: boolean) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const RollingDigit: React.FC<{ value: number; maxValue?: number }> = ({
  value,
  maxValue = 99,
}) => {
  const digitHeight = 45;

  return (
    <div
      className="relative overflow-hidden bg-[#7A224E] rounded-[7px] py-[9px] xl:py-4 min-w-[60px] xl:min-w-20"
      style={{ height: `${digitHeight}px` }}
    >
      <div
        className="absolute w-full transition-transform duration-500 ease-out"
        style={{
          transform: `translateY(${value * digitHeight}px)`,
          top: `-${maxValue * digitHeight}px`,
        }}
      >
        {Array.from({ length: maxValue + 1 }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-white font-normal leading-none"
            style={{
              height: `${digitHeight}px`,
              fontSize: "26.22px",
              letterSpacing: "-8.5%",
            }}
          >
            {(maxValue - i).toString().padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Timer: React.FC<TimerProps> = ({
  endDateString,
  interval = 1000,
  className = "",
  onExpiredChange,
}) => {
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

      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isExpired: false };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
  }, []);

  const safeSetTimeLeft = useCallback((newTimeLeft: TimeLeft) => {
    if (isMountedRef.current) {
      setTimeLeft(newTimeLeft);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const initial = calculateTimeLeft(endDateString);
    safeSetTimeLeft(initial);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const next = calculateTimeLeft(endDateString);
      safeSetTimeLeft(next);
      if (next.isExpired && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, interval);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [endDateString, interval, calculateTimeLeft, safeSetTimeLeft]);

  // Notify parent whenever the expired state transitions (incl. initial).
  useEffect(() => {
    onExpiredChange?.(timeLeft.isExpired);
  }, [timeLeft.isExpired, onExpiredChange]);

  const renderTimeUnit = useCallback(
    (value: number, label: string, maxValue: number) => (
      <div className="text-center" key={label}>
        <RollingDigit value={value} maxValue={maxValue} />
        <div
          data-testid={`timer-unit-label-${label.toLowerCase()}`}
          className="text-white text-[8px] xl:text-xs font-medium leading-none mt-[5px]"
        >
          {label}
        </div>
      </div>
    ),
    []
  );

  return (
    <div className={`flex gap-3 ${className}`}>
      {renderTimeUnit(timeLeft.days, "Days", 99)}
      {renderTimeUnit(timeLeft.hours, "Hours", 23)}
      {renderTimeUnit(timeLeft.minutes, "Minutes", 59)}
      {renderTimeUnit(timeLeft.seconds, "Seconds", 59)}
    </div>
  );
};
