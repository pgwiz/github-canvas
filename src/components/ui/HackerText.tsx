import React, { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HackerTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export const HackerText: React.FC<HackerTextProps> = ({
  text,
  className,
  speed = 30
}) => {
  const [displayText, setDisplayText] = useState(text);
  const iterations = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations.current) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iterations.current += 1 / 3;
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    iterations.current = 0;
    animate();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animate]);

  const handleMouseEnter = () => {
    iterations.current = 0;
    animate();
  };

  return (
    <span
      className={cn("font-mono cursor-default", className)}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  );
};
