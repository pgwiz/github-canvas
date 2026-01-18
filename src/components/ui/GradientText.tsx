import { cn } from "@/lib/utils";
import React from "react";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  colors?: string[];
  animate?: boolean;
  direction?: "to-right" | "to-left" | "to-bottom" | "to-top" | "to-br" | "to-bl" | "to-tr" | "to-tl";
  className?: string;
}

export function GradientText({
  children,
  colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--primary))"],
  animate = true,
  direction = "to-br",
  className,
  ...props
}: GradientTextProps) {
  const gradientDirection = {
    "to-right": "to right",
    "to-left": "to left",
    "to-bottom": "to bottom",
    "to-top": "to top",
    "to-br": "to bottom right",
    "to-bl": "to bottom left",
    "to-tr": "to top right",
    "to-tl": "to top left",
  }[direction];

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-[length:200%_auto]",
        animate && "animate-shimmer",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(${gradientDirection}, ${colors.join(", ")})`,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
