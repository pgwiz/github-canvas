import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glow?: "primary" | "secondary" | "none";
  hover?: boolean;
}

export function GlassPanel({ 
  children, 
  className, 
  glow = "none",
  hover = false 
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-lg p-6 transition-all duration-300",
        hover && "hover:scale-[1.02] hover:shadow-glow cursor-pointer",
        glow === "primary" && "shadow-glow",
        glow === "secondary" && "shadow-glow-secondary",
        className
      )}
    >
      {children}
    </div>
  );
}
