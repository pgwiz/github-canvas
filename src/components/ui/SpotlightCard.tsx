import { cn } from "@/lib/utils";
import React, { useRef } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.15)",
  ...props
}: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    div.style.setProperty("--mouse-x", `${x}px`);
    div.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseEnter = () => {
    if (divRef.current) {
      divRef.current.style.setProperty("--spotlight-opacity", "1");
    }
  };

  const handleMouseLeave = () => {
    if (divRef.current) {
      divRef.current.style.setProperty("--spotlight-opacity", "0");
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card border border-white/10",
        className
      )}
      style={
        {
          "--spotlight-opacity": "0",
          "--spotlight-color": spotlightColor,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-10"
        style={{
          opacity: "var(--spotlight-opacity)",
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), var(--spotlight-color), transparent 40%)`,
        }}
      />
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
};
