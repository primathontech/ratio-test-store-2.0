"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
  words: string[];
  /** ms per character while typing forward. */
  typeSpeed?: number;
  /** ms per character while deleting. */
  deleteSpeed?: number;
  /** ms to hold the fully-typed word before deleting. */
  delayBetweenWords?: number;
  /** Loop back to the first word after the last. Defaults to true. */
  loop?: boolean;
}

/**
 * Cycles a list of strings through a typewriter animation. Returns the
 * currently-visible substring; consumers render it as a placeholder.
 *
 * Mirrors the V2 reference hook so SearchInput behaves identically.
 */
export function useTypewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 50,
  delayBetweenWords = 1000,
  loop = true,
}: UseTypewriterOptions): string {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!words || words.length === 0) {
      setText("");
      return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      if (cancelled) {
        return;
      }
      const word = words[wordIndex];
      if (!isDeleting) {
        charIndex += 1;
        setText(word.substring(0, charIndex));
        if (charIndex >= word.length) {
          timer = setTimeout(() => {
            isDeleting = true;
            tick();
          }, delayBetweenWords);
          return;
        }
        timer = setTimeout(tick, typeSpeed);
      } else {
        charIndex -= 1;
        setText(word.substring(0, charIndex));
        if (charIndex <= 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          if (!loop && wordIndex === 0) {
            return;
          }
          timer = setTimeout(tick, 300);
          return;
        }
        timer = setTimeout(tick, deleteSpeed);
      }
    };

    timer = setTimeout(tick, 500);

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [words, typeSpeed, deleteSpeed, delayBetweenWords, loop]);

  return text;
}

export default useTypewriter;
