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
  const accentStyles = {
    green: "border-primary/20 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.15)]",
    teal: "border-secondary/20 shadow-[0_8px_32px_-8px_hsl(var(--secondary)/0.15)]",
    purple: "border-chart-3/20 shadow-[0_8px_32px_-8px_hsl(var(--chart-3)/0.15)]",
    none: ""
  };

  const activeStyles = {
    green: "shadow-[0_0_40px_-4px_hsl(var(--primary)/0.4),0_8px_32px_-8px_hsl(var(--primary)/0.3)] border-primary/40",
    teal: "shadow-[0_0_40px_-4px_hsl(var(--secondary)/0.4),0_8px_32px_-8px_hsl(var(--secondary)/0.3)] border-secondary/40",
    purple: "shadow-[0_0_40px_-4px_hsl(var(--chart-3)/0.4),0_8px_32px_-8px_hsl(var(--chart-3)/0.3)] border-chart-3/40",
    none: ""
  };

  const glowColors = {
    green: "hsl(var(--primary))",
    teal: "hsl(var(--secondary))",
    purple: "hsl(var(--chart-3))",
    none: "hsl(var(--primary))"
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 transition-all duration-300",
        "bg-[rgba(13,17,23,0.3)] backdrop-blur-xl",
        "border border-white/10",
        "text-white",
        hover && "hover:scale-[1.02] hover:shadow-lg cursor-pointer hover:border-white/20",
        glow === "primary" && "shadow-glow",
        glow === "secondary" && "shadow-glow-secondary",
        accent !== "none" && accentStyles[accent],
        active && accent !== "none" && activeStyles[accent],
        className
      )}
    >
      {/* Slice animation border effect */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColors[accent]}, transparent)`,
          backgroundSize: '200% 100%',
          animation: 'slice 3s linear infinite',
          opacity: 0.3,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      {/* Inner accent glow */}
      {accent !== "none" && (
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none opacity-10"
          style={{
            background: `radial-gradient(ellipse at top left, ${glowColors[accent]}, transparent 70%)`
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
