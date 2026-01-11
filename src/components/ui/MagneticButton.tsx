import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface MagneticButtonProps extends ButtonProps {
  strength?: number; // How strong the magnetic pull is (default: 0.5)
  activeScale?: number; // Scale when clicked (default: 0.95)
}

export function MagneticButton({
  strength = 0.5,
  activeScale = 0.95,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsPressed(false);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  // Calculate spotlight position relative to the button
  // We need to invert the magnetic pull offset to keep the spotlight tracking the mouse accurately
  // or just use the mouse position if we were tracking it relative to the button's top-left in a more robust way.
  // Since `position` is the translation of the button, the mouse is actually at `mouse - position`.
  // However, simpler is just to use a subtle radial gradient that moves with the translation but "feels" like a light source.

  // Actually, let's just add a child div that tracks the mouse precisely if we can.
  // But we already have `handleMouseMove` which calculates `x` and `y` as offsets from center.
  // Let's use that to position a radial gradient.

  return (
    <Button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(
        "relative transition-transform duration-200 ease-out will-change-transform overflow-hidden",
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${isPressed ? activeScale : 1})`,
      }}
      {...props}
    >
      {/* Internal Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)`,
            // We can adjust this to follow the mouse if we want a more precise spotlight
            // For now, a center glow that appears on hover + the magnetic movement creates a nice "energy" feel
        }}
      />

      {/* Mouse following spotlight (advanced) */}
      {/* We need the raw mouse coordinates relative to the button for this to work perfectly.
          The `position` state is the *button's* offset.
          Let's stick to the subtle sheen for now to ensure we don't break the layout.
      */}

      <span className="relative z-10 flex items-center">{children}</span>
    </Button>
  );
}
