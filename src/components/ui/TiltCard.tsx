import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number; // Maximum tilt angle in degrees (default: 15)
  perspective?: number; // CSS perspective value (default: 1000)
  scale?: number; // Scale on hover (default: 1.05)
  speed?: number; // Transition speed in ms (default: 300)
  glareEnable?: boolean; // Enable glare effect (default: true)
  glareMaxOpacity?: number; // Max opacity of glare (default: 0.4)
}

export function TiltCard({
  children,
  className,
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  speed = 400,
  glareEnable = true,
  glareMaxOpacity = 0.3,
  ...props
}: TiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to center of card
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation
    const rotateX = (mouseY / (height / 2)) * -maxTilt;
    const rotateY = (mouseX / (width / 2)) * maxTilt;

    // Calculate glare position (in percentage)
    const glareX = ((e.clientX - rect.left) / width) * 100;
    const glareY = ((e.clientY - rect.top) / height) * 100;

    // Use requestAnimationFrame for smooth updates
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      }
      if (glareRef.current && glareEnable) {
        glareRef.current.style.left = `${glareX - 50}%`;
        glareRef.current.style.top = `${glareY - 50}%`;
        glareRef.current.style.opacity = `${glareMaxOpacity}`;
      }
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (containerRef.current) {
      containerRef.current.style.transitionDuration = "100ms";
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (containerRef.current) {
      containerRef.current.style.transitionDuration = `${speed}ms`;
      containerRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative transition-transform ease-out will-change-transform",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        // Initial state
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}

        {glareEnable && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
            style={{
              transform: "translateZ(1px)", // Sit slightly above content
            }}
          >
            <div
              ref={glareRef}
              className="absolute w-[200%] h-[200%]"
              style={{
                background: `radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%)`,
                left: "0%",
                top: "0%",
                opacity: 0,
                transition: "opacity 300ms ease-out",
                pointerEvents: "none",
                mixBlendMode: "overlay",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
