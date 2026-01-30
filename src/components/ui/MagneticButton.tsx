import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface MagneticButtonProps extends ButtonProps {
  strength?: number; // How strong the magnetic pull is (default: 0.5)
  activeScale?: number; // Scale when clicked (default: 0.95)
  shimmer?: boolean; // Enable internal shimmer/spotlight effect
}

export function MagneticButton({
  strength = 0.5,
  activeScale = 0.95,
  shimmer = true,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;

    setPosition({ x, y });
    setMousePosition({ x: clientX - left, y: clientY - top });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsPressed(false);
    setIsHovered(false);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  // If asChild is true, we pass children directly to Button (which becomes Slot).
  // We cannot inject shimmer or wrapper div because Slot expects a single child.
  if (props.asChild) {
    return (
      <Button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className={cn(
          "relative transition-transform duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform",
          className
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${isPressed ? activeScale : 1})`,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(
        "relative transition-transform duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform overflow-hidden",
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${isPressed ? activeScale : 1})`,
      }}
      {...props}
    >
      {/* Liquid Glow Effect */}
      {shimmer && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(120px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 50%)`,
          }}
        />
      )}

      {/* Secondary Ambient Glow */}
       {shimmer && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.05), transparent 70%)`,
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

      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
    </Button>
  );
}
