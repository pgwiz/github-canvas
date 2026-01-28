import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HackerTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export function HackerText({ text, className, speed = 40 }: HackerTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
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
    scramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scramble]);

  return (
    <span
      className={cn("inline-block font-mono cursor-default", className)}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
}
