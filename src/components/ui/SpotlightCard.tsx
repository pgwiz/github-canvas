import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleMouseEnter = () => {
    opacity.set(1);
  };

  const handleMouseLeave = () => {
    opacity.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl group",
        className
      )}
      {...props}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-0">{children}</div>
    </div>
  );
};
