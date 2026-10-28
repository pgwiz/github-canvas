import { cn } from "@/lib/utils";
import { ReactNode, useRef, useState } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glow?: "primary" | "secondary" | "none";
  hover?: boolean;
  accent?: "green" | "teal" | "purple" | "blue" | "none";
  active?: boolean;
}

export function GlassPanel({
  children,
  className,
  glow = "none",
  hover = false,
  accent = "none",
  active = false
}: GlassPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current || !hover) return;
    const div = panelRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (hover) setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (hover) setOpacity(0);
  };

  const glowColors = {
    blue: "hsl(var(--primary))",
    green: "hsl(var(--primary))", // Maps to primary electric blue
    teal: "hsl(var(--secondary))",
    purple: "hsl(var(--chart-3))",
    none: "hsl(var(--foreground))"
  };

  const accentEdgeColors = {
    blue: "rgba(59, 130, 246, 0.25)",
    green: "rgba(59, 130, 246, 0.25)",
    teal: "rgba(14, 165, 233, 0.25)",
    purple: "rgba(139, 92, 246, 0.25)",
    none: "rgba(255, 255, 255, 0.1)"
  };

  const hoverHighlightColors = {
    blue: "rgba(59, 130, 246, 0.08)",
    green: "rgba(59, 130, 246, 0.08)",
    teal: "rgba(14, 165, 233, 0.08)",
    purple: "rgba(139, 92, 246, 0.08)",
    none: "rgba(255, 255, 255, 0.05)"
  };

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "backdrop-blur-xl group",
        "text-white",
        hover && "cursor-pointer hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5",
        glow === "primary" && "shadow-[0_0_20px_hsl(var(--primary)/0.2)]",
        glow === "secondary" && "shadow-[0_0_20px_hsl(var(--secondary)/0.2)]",
        className
      )}
      style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)`,
        border: `1px solid ${accentEdgeColors[accent]}`,
        boxShadow: active
          ? `0 8px 32px -4px rgba(0, 0, 0, 0.5),
             0 0 16px -2px ${accentEdgeColors[accent]},
             inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : `0 4px 20px rgba(0, 0, 0, 0.25),
             inset 0 1px 0 rgba(255, 255, 255, 0.06)`,
        // @ts-expect-error -- CSS custom properties
        "--glow-color": glowColors[accent],
        "--mouse-x": `${position.x}px`,
        "--mouse-y": `${position.y}px`,
      } as React.CSSProperties}
    >
      {/* Interactive hover gradient that follows cursor */}
      {hover && (
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity,
            background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), ${hoverHighlightColors[accent]}, transparent 60%)`
          }}
        />
      )}

      {/* Subtle top highlight edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${accentEdgeColors[accent]} 50%, transparent 95%)`
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Inner frosted glass sub-panel component
export function GlassInnerPanel({
  children,
  className,
  accent = "none"
}: {
  children: ReactNode;
  className?: string;
  accent?: "green" | "teal" | "purple" | "blue" | "none";
}) {
  const accentBorders = {
    blue: "rgba(59, 130, 246, 0.2)",
    green: "rgba(59, 130, 246, 0.2)",
    teal: "rgba(14, 165, 233, 0.2)",
    purple: "rgba(139, 92, 246, 0.2)",
    none: "rgba(255, 255, 255, 0.08)"
  };

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300",
        className
      )}
      style={{
        background: `rgba(255, 255, 255, 0.02)`,
        border: `1px solid ${accentBorders[accent]}`,
        boxShadow: `
          0 2px 10px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `
      }}
    >
      {/* Top edge subtle highlight */}
      <div
        className="absolute top-0 left-2 right-2 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)`
        }}
      />
      {children}
    </div>
  );
}
