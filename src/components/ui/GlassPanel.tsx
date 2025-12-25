import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glow?: "primary" | "secondary" | "none";
  hover?: boolean;
  accent?: "green" | "teal" | "purple" | "none";
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
  const glowColors = {
    green: "hsl(var(--primary))",
    teal: "hsl(var(--secondary))",
    purple: "hsl(var(--chart-3))",
    none: "hsl(var(--foreground))"
  };

  const accentBorderColors = {
    green: "rgba(12, 247, 9, 0.15)",
    teal: "rgba(0, 225, 255, 0.15)",
    purple: "rgba(139, 92, 246, 0.15)",
    none: "rgba(255, 255, 255, 0.1)"
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "backdrop-blur-xl",
        "text-white",
        hover && "hover:scale-[1.02] cursor-pointer",
        glow === "primary" && "shadow-glow",
        glow === "secondary" && "shadow-glow-secondary",
        active && "shadow-[0_0_60px_-8px_var(--glow-color)]",
        className
      )}
      style={{
        background: `linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)`,
        border: `1px solid rgba(255, 255, 255, 0.12)`,
        boxShadow: active 
          ? `0 0 60px -8px ${glowColors[accent]}, 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : `0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
        // @ts-ignore
        "--glow-color": glowColors[accent],
      } as React.CSSProperties}
    >
      {/* Top highlight edge */}
      <div 
        className="absolute top-0 left-4 right-4 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)`
        }}
      />
      
      {/* Slice animation border effect */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 25%, ${glowColors[accent]} 50%, transparent 75%)`,
          backgroundSize: '300% 100%',
          animation: 'slice 4s linear infinite',
          opacity: active ? 0.4 : 0.2,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      
      {/* Inner accent glow */}
      {accent !== "none" && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${accentBorderColors[accent]}, transparent 50%)`
          }}
        />
      )}
      
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
  accent?: "green" | "teal" | "purple" | "none";
}) {
  const accentColors = {
    green: "rgba(12, 247, 9, 0.08)",
    teal: "rgba(0, 225, 255, 0.08)",
    purple: "rgba(139, 92, 246, 0.08)",
    none: "rgba(255, 255, 255, 0.03)"
  };

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden backdrop-blur-sm",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${accentColors[accent]} 0%, rgba(255, 255, 255, 0.02) 100%)`,
        border: `1px solid rgba(255, 255, 255, 0.06)`,
        boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.05)`
      }}
    >
      {children}
    </div>
  );
}
