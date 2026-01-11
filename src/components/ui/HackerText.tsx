import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HackerTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  className?: string;
  speed?: number; // Speed of the scramble effect in ms (default: 30)
  scrambleOnHover?: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function HackerText({
  text,
  className,
  speed = 30,
  scrambleOnHover = true,
  ...props
}: HackerTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startScramble = React.useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    let iteration = 0;
    const maxIterations = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((current) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsAnimating(false);
      }

      iteration += 1 / 3; // Slower reveal for a cooler effect
    }, speed);
  }, [text, speed, isAnimating]);

  useEffect(() => {
    // Initial scramble on mount
    startScramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startScramble]);

  const handleMouseEnter = () => {
    if (scrambleOnHover) {
      startScramble();
    }
  };

  return (
    <span
      className={cn("inline-block font-mono", className)}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {displayText}
    </span>
  );
}
