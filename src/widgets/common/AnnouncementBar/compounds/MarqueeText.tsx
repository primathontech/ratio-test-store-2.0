"use client";

import React from "react";
import { AnnouncementText } from "./AnnouncementText";
import { Separator } from "./Separator";
import { IBannerTextItemFlat, TSeparator } from "../types";

interface MarqueeTextProps {
  texts: IBannerTextItemFlat[];
  marqueeSpeed?: number | string;
  pauseOnHover?: boolean;
  fontColor?: string;
  reverse?: boolean;
  separator?: TSeparator;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({
  texts,
  fontColor,
  marqueeSpeed = "30s",
  pauseOnHover = true,
  reverse,
  separator,
}) => {
  // Marquee mode - scrolling animation
  const marqueeStyles = `
    .marquee-content {
      display: flex;
      animation: marquee ${marqueeSpeed} linear infinite;
      white-space: nowrap;
    }
    .announcement-bar:hover .marquee-content {
      animation-play-state: ${pauseOnHover ? "paused" : "running"};
    }
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `;

  const marqueeReverseStyles = `
    .marquee-content {
      display: flex;
      animation: marquee ${marqueeSpeed} linear infinite;
      white-space: nowrap;
    }
    .announcement-bar:hover .marquee-content {
      animation-play-state: ${pauseOnHover ? "paused" : "running"};
    }
    @keyframes marquee {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;

  return (
    <>
      <style>{reverse ? marqueeReverseStyles : marqueeStyles}</style>
      <div className="marquee-content">
        {texts.map((text, index) => (
          <React.Fragment key={text.id || index}>
            <span className="mx-8">
              <AnnouncementText text={text} fontColor={fontColor} />
            </span>
            {separator && index < texts.length - 1 && (
              <Separator type={separator} fontColor={fontColor} />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
