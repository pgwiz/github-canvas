import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HackerTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export function HackerText({ text, className, speed = 30 }: HackerTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = useCallback(() => {
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((_char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    startScramble();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startScramble]);

  return (
    <span
      className={cn("inline-block cursor-default", className)}
      onMouseEnter={startScramble}
      aria-label={text}
    >
      {displayText}
    </span>
  );
}
