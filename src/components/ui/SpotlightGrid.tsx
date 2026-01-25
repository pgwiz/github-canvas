import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface SpotlightGridProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number; // Size of grid cells (default: 50)
  spotlightRadius?: number; // Radius of spotlight (default: 300)
  opacity?: number; // Opacity of the grid lines (default: 0.1)
  spotlightColor?: string; // Color of spotlight (default: white)
  gridColor?: string; // RGB tuple for grid lines (default: "255, 255, 255")
}

export function SpotlightGrid({
  className,
  gridSize = 50,
  spotlightRadius = 300,
  opacity = 0.1,
  spotlightColor = "white",
  gridColor = "255, 255, 255",
  ...props
}: SpotlightGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
    };

    const container = containerRef.current;
    // We attach listeners to the parent to track mouse over the whole area
    // that the grid covers (usually a section or full page)
    if (container && container.parentElement) {
        container.parentElement.addEventListener("mousemove", handleMouseMove);
        container.parentElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
        if (container && container.parentElement) {
            container.parentElement.removeEventListener("mousemove", handleMouseMove);
            container.parentElement.removeEventListener("mouseleave", handleMouseLeave);
        }
    };
  }, [mouseX, mouseY]);

  const maskImage = useMotionTemplate`radial-gradient(circle ${spotlightRadius}px at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      {...props}
    >
      <motion.div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
            backgroundImage: `
              linear-gradient(to right, rgba(${gridColor}, ${opacity}) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(${gridColor}, ${opacity}) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            maskImage: maskImage,
            WebkitMaskImage: maskImage,
        }}
      />

      {/* Base grid (always visible but faint) */}
       <div
        className="absolute inset-0"
        style={{
            backgroundImage: `
              linear-gradient(to right, rgba(${gridColor}, ${opacity * 0.3}) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(${gridColor}, ${opacity * 0.3}) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
    </div>
  );
}
