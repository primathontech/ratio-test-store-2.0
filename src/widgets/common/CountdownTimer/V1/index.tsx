"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CountdownTimerProps } from "../types";

/* ------------------------------------------------------------------ */
/* Decorative SVG — three horizontal bars (red), flanks the heading   */
/* ------------------------------------------------------------------ */
const DecorativeLines = ({ mirror }: { mirror?: boolean }) => (
  <div
    style={mirror ? { transform: "rotate(180deg)" } : undefined}
    className="flex items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="50"
      viewBox="0 0 29.872 25.061"
      fill="red"
      className="w-[55px] h-[50px]"
    >
      <g fill="transparent" stroke="transparent">
        <path stroke="none" d="M0 0h29.872v25.061H0z" />
        <path fill="none" d="M.5.5h28.872v24.061H.5z" />
      </g>
      <g transform="translate(-10.75 -80.053)">
        <rect
          width="19.872"
          height="1.673"
          rx="0.837"
          transform="translate(15.75 98.44)"
        />
        <rect
          width="19.872"
          height="1.673"
          rx="0.837"
          transform="translate(15.75 85.053)"
        />
        <rect
          width="15.898"
          height="1.673"
          rx="0.837"
          transform="translate(15.75 91.746)"
        />
      </g>
    </svg>
  </div>
);

/* ------------------------------------------------------------------ */
/* Single countdown circle                                            */
/* ------------------------------------------------------------------ */
interface CountdownUnitProps {
  value: string;
  label: string;
}

const CountdownUnit = ({ value, label }: CountdownUnitProps) => (
  <div
    className="flex flex-col items-center justify-center w-[60px] h-[60px] rounded-[50%] p-[7px]"
    style={{ border: "2px solid rgba(128, 128, 128, 0.33)" }}
  >
    <span className="block text-[25px] leading-[19px] font-[400] text-center text-[#1d1d1d]">
      {value}
    </span>
    <div className="text-[14px] leading-[22px] font-[400] text-center text-[#1d1d1d]">
      {label}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Helper: default target date = 7 days from now                      */
/* ------------------------------------------------------------------ */
function getDefaultTargetDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/* ------------------------------------------------------------------ */
/* Pad a number to two digits                                         */
/* ------------------------------------------------------------------ */
function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/* ------------------------------------------------------------------ */
/* V1 variant                                                         */
/* ------------------------------------------------------------------ */
export const V1: React.FC<CountdownTimerProps> = ({ settings, className }) => {
  const heading = settings?.heading ?? "Hurry Up!";
  const subheading = settings?.subheading ?? "Hurry! Offer Will Expire in";
  const expiredText = settings?.expiredText ?? "Oops! Offer is Expired";

  const targetMs = useMemo(() => {
    const raw = settings?.targetDate;
    if (raw) {
      const parsed = new Date(raw).getTime();
      if (!Number.isNaN(parsed)) return parsed;
    }
    return new Date(getDefaultTargetDate()).getTime();
  }, [settings?.targetDate]);

  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [expired, setExpired] = useState(false);

  const tick = useCallback(() => {
    const distance = targetMs - Date.now();
    if (distance <= 0) {
      setDays("00");
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      setExpired(true);
      return false; // signal to clear interval
    }
    setDays(pad(Math.floor(distance / (1000 * 60 * 60 * 24))));
    setHours(
      pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    );
    setMinutes(pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))));
    setSeconds(pad(Math.floor((distance % (1000 * 60)) / 1000)));
    return true; // keep running
  }, [targetMs]);

  useEffect(() => {
    // Run once immediately so we don't flash "00 00 00 00"
    const running = tick();
    if (!running) return;

    const id = setInterval(() => {
      const keepGoing = tick();
      if (!keepGoing) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [tick]);

  return (
    <section
      className={`text-center pt-[30px] pb-[39px] md:pt-[40px] md:pb-[52px] ${className ?? ""}`}
      style={{ fontFamily: "Gotham, sans-serif" }}
    >
      {/* Hurry Up! heading with decorative SVGs */}
      <div className="inline-flex items-center justify-center">
        <DecorativeLines mirror />
        <div className="text-[24px] md:text-[48px] font-[700] leading-[1.6] text-[#ff0000]">
          {heading}
        </div>
        <DecorativeLines />
      </div>

      {/* Sub-heading / expired text */}
      <div className="text-[28px] md:text-[38px] font-[600] leading-[1.6] text-[#1d1d1d] text-center">
        {expired ? expiredText : subheading}
      </div>

      {/* Countdown circles */}
      <div className="flex justify-center gap-[10px] mt-[0px]">
        <CountdownUnit value={days} label="Days" />
        <CountdownUnit value={hours} label="Hr" />
        <CountdownUnit value={minutes} label="Min" />
        <CountdownUnit value={seconds} label="Sec" />
      </div>
    </section>
  );
};
