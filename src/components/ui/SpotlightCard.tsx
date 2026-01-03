import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
  enableBorder?: boolean;
}

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.1)",
  enableBorder = false,
  ...props
}: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

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
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Optional Border Reveal */}
      {enableBorder && (
         <div
           className="absolute inset-0 z-20 pointer-events-none rounded-[inherit] transition-opacity duration-300"
           style={{
             opacity,
             background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${spotlightColor}, transparent 40%)`,
             mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
             maskComposite: "exclude",
             WebkitMaskComposite: "xor",
             padding: "1px",
           }}
         />
      )}

      <div className="relative z-0">{children}</div>
    </div>
  );
};
