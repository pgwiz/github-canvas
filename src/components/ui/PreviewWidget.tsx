import { motion } from "framer-motion";
import { Sparkles, Flame, Github, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type WidgetType = "user-stats" | "languages" | "streak" | "activity" | "quotes" | "custom";
type AccentColor = "green" | "teal" | "purple" | "none";

interface PreviewWidgetProps {
  type: WidgetType;
  accent?: AccentColor;
  className?: string;
}

export function PreviewWidget({ type, accent = "none", className }: PreviewWidgetProps) {
  const accentColors = {
    green: "text-primary",
    teal: "text-secondary",
    purple: "text-chart-3",
    none: "text-muted-foreground",
  };

  const bgColors = {
    green: "bg-primary/20",
    teal: "bg-secondary/20",
    purple: "bg-chart-3/20",
    none: "bg-muted",
  };

  switch (type) {
    case "user-stats":
      return (
        <div className={cn("flex items-center gap-3", className)}>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: [20, 40 + Math.random() * 20, 20], opacity: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: i * 0.2 }}
                className={cn("h-1.5 rounded-full", bgColors[accent].replace("/20", "/60"))}
                style={{ width: 40 }}
              />
            ))}
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn("p-2 rounded-full", bgColors[accent])}
          >
            <Github className={cn("w-4 h-4", accentColors[accent])} />
          </motion.div>
        </div>
      );

    case "languages":
      return (
        <div className={cn("flex flex-col gap-2 w-full max-w-[120px]", className)}>
          <div className="flex h-3 w-full rounded-full overflow-hidden bg-white/5 border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "50%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-chart-1"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "30%" }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="h-full bg-chart-2"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "20%" }}
              transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
              className="h-full bg-chart-3"
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono px-1">
            <span className="text-chart-1">TS</span>
            <span className="text-chart-2">PY</span>
            <span className="text-chart-3">RS</span>
          </div>
        </div>
      );

    case "streak":
      return (
        <div className={cn("flex flex-col items-center justify-center", className)}>
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame className={cn("w-8 h-8", accentColors[accent])} fill="currentColor" />
            </motion.div>
            <motion.div
              className={cn("absolute inset-0 blur-xl opacity-40 scale-150", accentColors[accent])}
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.2, 1.5, 1.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
          </div>
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="text-[10px] font-bold mt-1 text-muted-foreground font-mono"
          >
            STREAK
          </motion.div>
        </div>
      );

    case "activity":
      return (
        <div className={cn("grid grid-cols-7 gap-1", className)}>
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: Math.random() > 0.6 ? [0.2, 0.8, 0.2] : 0.2 }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              className={cn(
                "w-1.5 h-1.5 rounded-[1px]",
                Math.random() > 0.7 ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>
      );

    case "quotes":
      return (
        <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
          <Quote className="w-5 h-5 text-muted-foreground/40" />
          <div className="space-y-1.5 flex flex-col items-center">
             <motion.div
               className="h-0.5 w-16 bg-white/20 rounded-full"
               animate={{ width: [0, 24, 24], opacity: [0, 1, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
             <motion.div
               className="h-0.5 w-10 bg-white/20 rounded-full"
               animate={{ width: [0, 16, 16], opacity: [0, 1, 1] }}
               transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
             />
          </div>
        </div>
      );

    default:
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      );
  }
}
