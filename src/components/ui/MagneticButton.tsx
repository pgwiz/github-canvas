import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface MagneticButtonProps extends ButtonProps {
  strength?: number; // How strong the magnetic pull is (default: 0.5)
  activeScale?: number; // Scale when clicked (default: 0.95)
  shimmer?: boolean; // Enable internal shimmer/spotlight effect
}

// Create a motion version of the Button component outside the render loop
// to ensure stable component identity and prevent re-mounting on state changes.
const MotionButton = motion(Button);

export function MagneticButton({
  strength = 0.5,
  activeScale = 0.95,
  shimmer = true,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const liquidBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.8), transparent 50%)`
  );

  const spotlightBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(150px circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

    const xPos = (clientX - (left + width / 2)) * strength;
    const yPos = (clientY - (top + height / 2)) * strength;

    x.set(xPos);
    y.set(yPos);

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  // If asChild is true, we simply pass the children through to the MotionButton
  // We cannot inject extra DOM elements for effects because Slot expects a single child
  if (props.asChild) {
    return (
      <MotionButton
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className={cn(
          "relative will-change-transform",
          className
        )}
        style={{
          x: springX,
          y: springY,
          scale: isPressed ? activeScale : 1,
        }}
        {...props}
      >
        {children}
      </MotionButton>
    );
  }

  // Standard render with effects
  return (
    <MotionButton
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(
        "relative will-change-transform overflow-hidden",
        className
      )}
      style={{
        x: springX,
        y: springY,
        scale: isPressed ? activeScale : 1,
      }}
      {...props}
    >
      {/* Liquid Background Effect */}
      {isHovered && !props.variant?.includes("outline") && !props.variant?.includes("ghost") && (
        <motion.div
          className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
          style={{
            background: liquidBackground
          }}
        />
      )}

      {/* Shine effect */}
      {isHovered && (
        <div
          className="absolute inset-0 animate-shimmer pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            backgroundSize: "200% 100%"
          }}
        />
      )}

      {/* Internal spotlight effect */}
      {shimmer && isHovered && (
         <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: spotlightBackground
          }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </MotionButton>
  );
}
