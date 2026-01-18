import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MockCardProps {
  type: "user" | "streak" | "languages";
  className?: string;
}

export function MockCard({ type, className }: MockCardProps) {
  if (type === "user") {
    return (
      <div className={cn("w-full h-full p-4 flex flex-col gap-3", className)}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          <div className="space-y-1">
            <div className="w-20 h-3 rounded bg-white/10 animate-pulse" />
            <div className="w-12 h-2 rounded bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded p-2 flex flex-col gap-1 items-center">
              <div className="w-4 h-4 rounded-full bg-white/10" />
              <div className="w-8 h-2 rounded bg-white/10" />
            </div>
          ))}
        </div>

        {/* Graph Area */}
        <div className="mt-auto h-8 flex items-end gap-1 justify-between px-2">
          {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-full bg-primary/20 rounded-t-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "streak") {
    return (
      <div className={cn("w-full h-full p-4 flex flex-col gap-3", className)}>
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
             <div className="w-24 h-4 rounded bg-white/10 animate-pulse" />
             <div className="w-16 h-8 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
             <div className="w-5 h-5 bg-secondary/40 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Streak Squares */}
        <div className="mt-auto flex gap-1 justify-center flex-wrap">
          {Array.from({ length: 14 }).map((_, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.05 }}
               className={cn(
                 "w-3 h-3 rounded-sm",
                 i > 10 ? "bg-secondary/40" : "bg-white/5"
               )}
             />
          ))}
        </div>
      </div>
    );
  }

  if (type === "languages") {
    return (
      <div className={cn("w-full h-full p-4 flex flex-col gap-3", className)}>
        <div className="w-32 h-4 rounded bg-white/10 animate-pulse mb-2" />

        {/* Language Bars */}
        <div className="space-y-3">
          {[
            { width: "70%", color: "bg-chart-3/40" },
            { width: "45%", color: "bg-chart-4/40" },
            { width: "30%", color: "bg-chart-1/40" }
          ].map((bar, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn("h-3 rounded-full animate-pulse", bar.color)} style={{ width: bar.width }} />
              <div className="w-8 h-2 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
