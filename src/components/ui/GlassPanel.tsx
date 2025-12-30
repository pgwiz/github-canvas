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

  const accentEdgeColors = {
    green: "rgba(12, 247, 9, 0.3)",
    teal: "rgba(0, 225, 255, 0.3)",
    purple: "rgba(139, 92, 246, 0.3)",
    none: "rgba(255, 255, 255, 0.15)"
  };

  const particleColors = {
    green: "rgba(12, 247, 9, 0.6)",
    teal: "rgba(0, 225, 255, 0.6)",
    purple: "rgba(139, 92, 246, 0.6)",
    none: "rgba(255, 255, 255, 0.4)"
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "backdrop-blur-2xl",
        "text-white",
        hover && "hover:scale-[1.02] cursor-pointer hover:shadow-[0_8px_40px_-8px_rgba(255,255,255,0.1)]",
        glow === "primary" && "shadow-glow",
        glow === "secondary" && "shadow-glow-secondary",
        className
      )}
      style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)`,
        border: `1px solid ${accentEdgeColors[accent]}`,
        boxShadow: active 
          ? `0 0 60px -8px ${glowColors[accent]}, 
             0 4px 30px rgba(0, 0, 0, 0.3), 
             0 0 0 1px rgba(255, 255, 255, 0.05),
             inset 0 1px 0 rgba(255, 255, 255, 0.1),
             inset 0 -1px 0 rgba(0, 0, 0, 0.1)`
          : `0 4px 30px rgba(0, 0, 0, 0.2), 
             0 0 0 1px rgba(255, 255, 255, 0.03),
             inset 0 1px 0 rgba(255, 255, 255, 0.08),
             inset 0 -1px 0 rgba(0, 0, 0, 0.05)`,
        // @ts-ignore
        "--glow-color": glowColors[accent],
      } as React.CSSProperties}
    >
      {/* Frost particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Particle 1 */}
        <div 
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: particleColors[accent],
            left: '15%',
            bottom: '20%',
            animation: 'frost-drift-1 8s ease-in-out infinite',
            boxShadow: `0 0 4px ${particleColors[accent]}`
          }}
        />
        {/* Particle 2 */}
        <div 
          className="absolute w-0.5 h-0.5 rounded-full"
          style={{
            background: particleColors[accent],
            left: '45%',
            bottom: '30%',
            animation: 'frost-drift-2 10s ease-in-out infinite',
            animationDelay: '1s',
            boxShadow: `0 0 3px ${particleColors[accent]}`
          }}
        />
        {/* Particle 3 */}
        <div 
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: particleColors[accent],
            left: '75%',
            bottom: '15%',
            animation: 'frost-drift-3 12s ease-in-out infinite',
            animationDelay: '2s',
            opacity: 0.4,
            boxShadow: `0 0 6px ${particleColors[accent]}`
          }}
        />
        {/* Particle 4 */}
        <div 
          className="absolute w-0.5 h-0.5 rounded-full"
          style={{
            background: particleColors[accent],
            left: '30%',
            bottom: '50%',
            animation: 'frost-drift-1 9s ease-in-out infinite',
            animationDelay: '3s',
            boxShadow: `0 0 2px ${particleColors[accent]}`
          }}
        />
        {/* Particle 5 */}
        <div 
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: particleColors[accent],
            left: '60%',
            bottom: '40%',
            animation: 'frost-drift-2 11s ease-in-out infinite',
            animationDelay: '4s',
            boxShadow: `0 0 4px ${particleColors[accent]}`
          }}
        />
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${particleColors[accent]}, transparent 60%)`,
            animation: 'frost-shimmer 6s ease-in-out infinite',
          }}
        />
      </div>

      {/* Top highlight edge */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${accentEdgeColors[accent]} 50%, transparent 90%)`
        }}
      />
      
      {/* Left edge highlight */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-px"
        style={{
          background: `linear-gradient(180deg, ${accentEdgeColors[accent]} 0%, transparent 50%, rgba(255,255,255,0.05) 100%)`
        }}
      />
      
      {/* Slice animation border effect */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 25%, ${glowColors[accent]} 50%, transparent 75%)`,
          backgroundSize: '300% 100%',
          animation: 'slice 4s linear infinite',
          opacity: active ? 0.5 : 0.25,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      
      {/* Inner frost effect */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.1), transparent 50%)`
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
  accent?: "green" | "teal" | "purple" | "none";
}) {
  const accentBorders = {
    green: "rgba(12, 247, 9, 0.25)",
    teal: "rgba(0, 225, 255, 0.25)",
    purple: "rgba(139, 92, 246, 0.25)",
    none: "rgba(255, 255, 255, 0.1)"
  };

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden backdrop-blur-sm",
        className
      )}
      style={{
        background: `rgba(255, 255, 255, 0.02)`,
        border: `1px solid ${accentBorders[accent]}`,
        boxShadow: `
          0 2px 10px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          inset 0 -1px 0 rgba(0, 0, 0, 0.05)
        `
      }}
    >
      {/* Top edge frost highlight */}
      <div 
        className="absolute top-0 left-2 right-2 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)`
        }}
      />
      {children}
    </div>
  );
}
